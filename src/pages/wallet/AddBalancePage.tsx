import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { SelectField, TextField } from '../../components/forms'
import { ArrowLeftIcon, BankIcon, PlusIcon } from '../../components/icons/AuthIcons'
import { Button } from '../../components/ui/button/Button'
import { routes } from '../../router/routes'
import {
  depositFunds,
  getWallet,
  type CurrencyCode,
  type Wallet,
} from '../../services/walletApi'
import './add-balance-page.css'

const currencies: Array<{ code: CurrencyCode; label: string }> = [
  { code: 'COP', label: 'Peso colombiano' },
  { code: 'USD', label: 'Dólar americano' },
  { code: 'EUR', label: 'Euro' },
]

type PendingDeposit = {
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

export function AddBalancePage() {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [currency, setCurrency] = useState<CurrencyCode>('COP')
  const [amount, setAmount] = useState('')
  const [amountError, setAmountError] = useState('')
  const [pageError, setPageError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pendingDeposit, setPendingDeposit] = useState<PendingDeposit | null>(null)

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
    if (!pendingDeposit) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) {
        setPendingDeposit(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isSubmitting, pendingDeposit])

  useEffect(() => {
    if (!successMessage) return

    const timeoutId = window.setTimeout(() => {
      setSuccessMessage('')
    }, 7000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [successMessage])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const numericAmount = Number(amount)
    const hasMoreThanTwoDecimals = !/^\d+(\.\d{1,2})?$/.test(amount)

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

    setPendingDeposit({ amount: numericAmount, currency })
  }

  const confirmDeposit = async () => {
    if (!pendingDeposit) return

    setIsSubmitting(true)

    try {
      const result = await depositFunds(pendingDeposit.amount, pendingDeposit.currency)
      setSuccessMessage(
        `Agregaste ${formatMoney(result.deposited, result.currency)}. Tu nuevo saldo es ${formatMoney(result.newBalance, result.currency)}.`,
      )
      setAmount('')
      setPendingDeposit(null)
      setWallet(await getWallet())
    } catch (error) {
      setPageError(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="add-balance-page">
      <header className="add-balance-page__header">
        <div>
          <span className="add-balance-page__eyebrow">Wallet multimoneda</span>
          <h1>Agregar saldo</h1>
          <p>Selecciona una moneda e ingresa el monto que quieres acreditar a tu billetera.</p>
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
              <PlusIcon />
            </span>
            <div>
              <h2>Nueva recarga</h2>
              <p>El depósito se reflejará inmediatamente en tu saldo.</p>
            </div>
          </div>

          <SelectField
            id="deposit-currency"
            label="Moneda"
            value={currency}
            onChange={(event) => {
              setCurrency(event.target.value as CurrencyCode)
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
            id="deposit-amount"
            label="Monto a agregar"
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            inputMode="decimal"
            placeholder="Ej. 50000"
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
            trailingIcon={<PlusIcon />}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Agregando saldo...' : 'Agregar saldo'}
          </Button>
        </form>

        <aside className="add-balance-summary" aria-label="Resumen de saldo">
          <span className="add-balance-summary__label">Saldo actual</span>
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
            Cada recarga actualiza tu balance y crea una transacción de depósito en tu historial.
          </p>
        </aside>
      </section>

      {pendingDeposit ? (
        <div
          className="add-balance-modal__backdrop"
          onClick={() => {
            if (!isSubmitting) setPendingDeposit(null)
          }}
        >
          <section
            className="add-balance-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="deposit-confirmation-title"
            aria-describedby="deposit-confirmation-description"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="add-balance-modal__icon" aria-hidden="true">
              <BankIcon />
            </span>
            <div className="add-balance-modal__copy">
              <span>Confirma tu recarga</span>
              <h2 id="deposit-confirmation-title">¿Deseas agregar este saldo?</h2>
              <p id="deposit-confirmation-description">
                Revisa el monto antes de confirmar la operación.
              </p>
            </div>

            <div className="add-balance-modal__amount">
              <span>Monto a agregar</span>
              <strong>{formatMoney(pendingDeposit.amount, pendingDeposit.currency)}</strong>
              <span>{pendingDeposit.currency}</span>
            </div>

            <div className="add-balance-modal__actions">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setPendingDeposit(null)}
                disabled={isSubmitting}
                autoFocus
              >
                Cancelar
              </Button>
              <Button
                size="lg"
                trailingIcon={<PlusIcon />}
                onClick={confirmDeposit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Agregando saldo...' : 'Confirmar recarga'}
              </Button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  )
}
