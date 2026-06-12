import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { SelectField, TextField } from '../../components/forms'
import { ArrowLeftIcon, BankIcon, LogoutIcon } from '../../components/icons/AuthIcons'
import { Button } from '../../components/ui/button/Button'
import { routes } from '../../router/routes'
import {
  getWallet,
  withdrawFunds,
  type CurrencyCode,
  type Wallet,
} from '../../services/walletApi'
import './add-balance-page.css'

const currencies: Array<{ code: CurrencyCode; label: string }> = [
  { code: 'COP', label: 'Peso colombiano' },
  { code: 'USD', label: 'Dólar americano' },
  { code: 'EUR', label: 'Euro' },
]

type PendingWithdraw = {
  amount: number
  currency: CurrencyCode
}

function formatMoney(amount: number, currency: CurrencyCode) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'COP' ? 0 : 2,
  }).format(amount)
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'No fue posible completar la operación.'
}

export function WithdrawBalancePage() {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [currency, setCurrency] = useState<CurrencyCode>('COP')
  const [amount, setAmount] = useState('')
  const [amountError, setAmountError] = useState('')
  const [pageError, setPageError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pendingWithdraw, setPendingWithdraw] = useState<PendingWithdraw | null>(null)

  const selectedBalance = useMemo(
    () => wallet?.balances.find((balance) => balance.currency === currency),
    [currency, wallet],
  )

  useEffect(() => {
    let isActive = true

    getWallet()
      .then((walletData) => {
        if (isActive) {
          setWallet(walletData)
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          setPageError(getErrorMessage(error))
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false)
        }
      })

    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    if (!pendingWithdraw) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) {
        setPendingWithdraw(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isSubmitting, pendingWithdraw])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const numericAmount = Number(amount)
    const hasMoreThanTwoDecimals = !/^\d+(\.\d{1,2})?$/.test(amount)
    const availableAmount = selectedBalance?.amount ?? 0

    setAmountError('')
    setPageError('')
    setSuccessMessage('')

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setAmountError('Ingresa un monto mayor a cero.')
      return
    }

    if (hasMoreThanTwoDecimals) {
      setAmountError('El monto puede tener máximo dos decimales.')
      return
    }

    if (numericAmount > availableAmount) {
      setAmountError('No tienes saldo suficiente en esta moneda.')
      return
    }

    setPendingWithdraw({ amount: numericAmount, currency })
  }

  const confirmWithdraw = async () => {
    if (!pendingWithdraw) return

    setIsSubmitting(true)

    try {
      const result = await withdrawFunds(pendingWithdraw.amount, pendingWithdraw.currency)
      setSuccessMessage(
        `Retiraste ${formatMoney(result.withdrawn, result.currency)}. Tu nuevo saldo es ${formatMoney(result.newBalance, result.currency)}.`,
      )
      setAmount('')
      setPendingWithdraw(null)
      setWallet(await getWallet())
    } catch (error) {
      setPageError(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="add-balance-page add-balance-page--withdraw">
      <header className="add-balance-page__header">
        <div>
          <span className="add-balance-page__eyebrow">Wallet multimoneda</span>
          <h1>Retirar saldo</h1>
          <p>Selecciona una moneda e ingresa el monto que quieres retirar de tu billetera.</p>
        </div>
        <Link className="add-balance-page__back-link" to={routes.dashboard}>
          <ArrowLeftIcon />
          <span>Volver al inicio</span>
        </Link>
      </header>

      <section className="add-balance-page__grid">
        <form className="add-balance-form" onSubmit={handleSubmit} noValidate>
          <div className="add-balance-form__heading">
            <span className="add-balance-form__icon" aria-hidden="true">
              <LogoutIcon />
            </span>
            <div>
              <h2>Nuevo retiro</h2>
              <p>El retiro se descontará inmediatamente de tu saldo disponible.</p>
            </div>
          </div>

          <SelectField
            id="withdraw-currency"
            label="Moneda"
            value={currency}
            onChange={(event) => {
              setCurrency(event.target.value as CurrencyCode)
              setAmountError('')
              setSuccessMessage('')
            }}
          >
            {currencies.map((option) => (
              <option key={option.code} value={option.code}>
                {option.code} - {option.label}
              </option>
            ))}
          </SelectField>

          <TextField
            id="withdraw-amount"
            label="Monto a retirar"
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            inputMode="decimal"
            placeholder="Ej. 20000"
            leadingIcon={<BankIcon />}
            value={amount}
            errorText={amountError}
            onChange={(event) => {
              setAmount(event.target.value)
              setAmountError('')
              setSuccessMessage('')
            }}
            required
          />

          {pageError ? <p className="add-balance-form__message is-error" role="alert">{pageError}</p> : null}
          {successMessage ? <p className="add-balance-form__message is-success" role="status">{successMessage}</p> : null}

          <Button
            className="add-balance-form__submit"
            type="submit"
            size="lg"
            trailingIcon={<LogoutIcon />}
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? 'Retirando saldo...' : 'Retirar saldo'}
          </Button>
        </form>

        <aside className="add-balance-summary" aria-label="Resumen de saldo disponible">
          <span className="add-balance-summary__label">Saldo disponible</span>
          <strong>
            {isLoading
              ? 'Consultando...'
              : formatMoney(selectedBalance?.amount ?? 0, currency)}
          </strong>
          <span className="add-balance-summary__currency">{currency}</span>

          <div className="add-balance-summary__details">
            <span>Moneda seleccionada</span>
            <strong>{selectedBalance?.name ?? currencies.find((item) => item.code === currency)?.label}</strong>
          </div>

          <p>
            Cada retiro descuenta tu balance y crea una transacción de retiro en tu historial.
          </p>
        </aside>
      </section>

      {pendingWithdraw ? (
        <div
          className="add-balance-modal__backdrop"
          onClick={() => {
            if (!isSubmitting) setPendingWithdraw(null)
          }}
        >
          <section
            className="add-balance-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="withdraw-confirmation-title"
            aria-describedby="withdraw-confirmation-description"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="add-balance-modal__icon" aria-hidden="true">
              <BankIcon />
            </span>
            <div className="add-balance-modal__copy">
              <span>Confirma tu retiro</span>
              <h2 id="withdraw-confirmation-title">¿Deseas retirar este saldo?</h2>
              <p id="withdraw-confirmation-description">
                Revisa el monto antes de confirmar la operación.
              </p>
            </div>

            <div className="add-balance-modal__amount">
              <span>Monto a retirar</span>
              <strong>{formatMoney(pendingWithdraw.amount, pendingWithdraw.currency)}</strong>
              <span>{pendingWithdraw.currency}</span>
            </div>

            <div className="add-balance-modal__actions">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setPendingWithdraw(null)}
                disabled={isSubmitting}
                autoFocus
              >
                Cancelar
              </Button>
              <Button
                size="lg"
                trailingIcon={<LogoutIcon />}
                onClick={confirmWithdraw}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Retirando saldo...' : 'Confirmar retiro'}
              </Button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  )
}
