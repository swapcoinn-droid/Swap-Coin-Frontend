import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { SelectField, TextField } from '../../components/forms'
import { ArrowLeftIcon, BankIcon, SwapIcon } from '../../components/icons/AuthIcons'
import { Button } from '../../components/ui/button/Button'
import { routes } from '../../router/routes'
import {
  exchangeFunds,
  getWallet,
  type CurrencyCode,
  type ExchangeResult,
  type Wallet,
} from '../../services/walletApi'
import './add-balance-page.css'
import './currency-exchange-page.css'

const currencies: Array<{ code: CurrencyCode; label: string }> = [
  { code: 'COP', label: 'Peso colombiano' },
  { code: 'USD', label: 'Dólar americano' },
  { code: 'EUR', label: 'Euro' },
]

type PendingExchange = {
  amount: number
  from: CurrencyCode
  to: CurrencyCode
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

function getCurrencyName(currency: CurrencyCode) {
  return currencies.find((item) => item.code === currency)?.label ?? currency
}

export function CurrencyExchangePage() {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>('USD')
  const [toCurrency, setToCurrency] = useState<CurrencyCode>('COP')
  const [amount, setAmount] = useState('')
  const [amountError, setAmountError] = useState('')
  const [pageError, setPageError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pendingExchange, setPendingExchange] = useState<PendingExchange | null>(null)
  const [lastExchange, setLastExchange] = useState<ExchangeResult | null>(null)

  const fromBalance = useMemo(
    () => wallet?.balances.find((balance) => balance.currency === fromCurrency),
    [fromCurrency, wallet],
  )

  const toBalance = useMemo(
    () => wallet?.balances.find((balance) => balance.currency === toCurrency),
    [toCurrency, wallet],
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
    if (!pendingExchange) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) {
        setPendingExchange(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isSubmitting, pendingExchange])

  const resetMessages = () => {
    setAmountError('')
    setPageError('')
    setSuccessMessage('')
    setLastExchange(null)
  }

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    resetMessages()
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const numericAmount = Number(amount)
    const hasMoreThanTwoDecimals = !/^\d+(\.\d{1,2})?$/.test(amount)
    const availableAmount = fromBalance?.amount ?? 0

    resetMessages()

    if (fromCurrency === toCurrency) {
      setAmountError('Selecciona monedas diferentes para realizar el cambio.')
      return
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setAmountError('Ingresa un monto mayor a cero.')
      return
    }

    if (hasMoreThanTwoDecimals) {
      setAmountError('El monto puede tener máximo dos decimales.')
      return
    }

    if (numericAmount > availableAmount) {
      setAmountError('No tienes saldo suficiente en la moneda de origen.')
      return
    }

    setPendingExchange({ amount: numericAmount, from: fromCurrency, to: toCurrency })
  }

  const confirmExchange = async () => {
    if (!pendingExchange) return

    setIsSubmitting(true)

    try {
      const result = await exchangeFunds(
        pendingExchange.from,
        pendingExchange.to,
        pendingExchange.amount,
      )

      setLastExchange(result)
      setSuccessMessage(
        `Cambiaste ${formatMoney(result.from.debited, result.from.currency)} por ${formatMoney(result.to.credited, result.to.currency)}.`,
      )
      setAmount('')
      setPendingExchange(null)
      setWallet(await getWallet())
    } catch (error) {
      setPageError(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="add-balance-page currency-exchange-page">
      <header className="add-balance-page__header currency-exchange-page__header">
        <div>
          <span className="add-balance-page__eyebrow">Wallet multimoneda</span>
          <h1>Cambiar divisa</h1>
          <p>Convierte saldo entre monedas usando la tasa vigente del backend.</p>
        </div>
        <Link className="add-balance-page__back-link" to={routes.dashboard}>
          <ArrowLeftIcon />
          <span>Volver al inicio</span>
        </Link>
      </header>

      <section className="currency-exchange-page__grid">
        <form className="add-balance-form currency-exchange-form" onSubmit={handleSubmit} noValidate>
          <div className="add-balance-form__heading">
            <span className="add-balance-form__icon currency-exchange-form__icon" aria-hidden="true">
              <SwapIcon />
            </span>
            <div>
              <h2>Nuevo cambio</h2>
              <p>El saldo se descuenta y acredita automáticamente al confirmar.</p>
            </div>
          </div>

          <div className="currency-exchange-form__selectors">
            <SelectField
              id="exchange-from-currency"
              label="Cambiar desde"
              value={fromCurrency}
              onChange={(event) => {
                setFromCurrency(event.target.value as CurrencyCode)
                resetMessages()
              }}
            >
              {currencies.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.code} - {option.label}
                </option>
              ))}
            </SelectField>

            <button
              className="currency-exchange-form__swap"
              type="button"
              aria-label="Invertir monedas"
              onClick={swapCurrencies}
            >
              <SwapIcon />
            </button>

            <SelectField
              id="exchange-to-currency"
              label="Recibir en"
              value={toCurrency}
              onChange={(event) => {
                setToCurrency(event.target.value as CurrencyCode)
                resetMessages()
              }}
            >
              {currencies.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.code} - {option.label}
                </option>
              ))}
            </SelectField>
          </div>

          <TextField
            id="exchange-amount"
            label="Monto a cambiar"
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            inputMode="decimal"
            placeholder="Ej. 100"
            leadingIcon={<BankIcon />}
            value={amount}
            errorText={amountError}
            onChange={(event) => {
              setAmount(event.target.value)
              resetMessages()
            }}
            required
          />

          <div className="currency-exchange-form__available">
            <span>Saldo disponible</span>
            <strong>
              {isLoading
                ? 'Consultando...'
                : formatMoney(fromBalance?.amount ?? 0, fromCurrency)}
            </strong>
          </div>

          {pageError ? <p className="add-balance-form__message is-error" role="alert">{pageError}</p> : null}
          {successMessage ? <p className="add-balance-form__message is-success" role="status">{successMessage}</p> : null}

          <Button
            className="add-balance-form__submit"
            type="submit"
            size="lg"
            trailingIcon={<SwapIcon />}
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? 'Cambiando divisa...' : 'Cambiar divisa'}
          </Button>
        </form>

        <aside className="currency-exchange-summary" aria-label="Resumen del cambio">
          <div className="currency-exchange-summary__card">
            <span>Desde</span>
            <strong>{fromCurrency}</strong>
            <p>{getCurrencyName(fromCurrency)}</p>
            <small>{formatMoney(fromBalance?.amount ?? 0, fromCurrency)} disponibles</small>
          </div>

          <div className="currency-exchange-summary__bridge" aria-hidden="true">
            <SwapIcon />
          </div>

          <div className="currency-exchange-summary__card">
            <span>Hacia</span>
            <strong>{toCurrency}</strong>
            <p>{getCurrencyName(toCurrency)}</p>
            <small>{formatMoney(toBalance?.amount ?? 0, toCurrency)} actuales</small>
          </div>

          <div className="currency-exchange-summary__rate">
            <span>Tasa aplicada por backend</span>
            <strong>
              {lastExchange
                ? `1 ${lastExchange.from.currency} = ${lastExchange.appliedRate.toLocaleString('es-CO')} ${lastExchange.to.currency}`
                : 'Se confirma al ejecutar el cambio'}
            </strong>
          </div>
        </aside>
      </section>

      {pendingExchange ? (
        <div
          className="add-balance-modal__backdrop"
          onClick={() => {
            if (!isSubmitting) setPendingExchange(null)
          }}
        >
          <section
            className="add-balance-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="exchange-confirmation-title"
            aria-describedby="exchange-confirmation-description"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="add-balance-modal__icon currency-exchange-modal__icon" aria-hidden="true">
              <SwapIcon />
            </span>
            <div className="add-balance-modal__copy">
              <span>Confirma tu cambio</span>
              <h2 id="exchange-confirmation-title">¿Deseas cambiar esta divisa?</h2>
              <p id="exchange-confirmation-description">
                La tasa final se aplicará desde el backend al confirmar la operación.
              </p>
            </div>

            <div className="add-balance-modal__amount">
              <span>Monto a cambiar</span>
              <strong>{formatMoney(pendingExchange.amount, pendingExchange.from)}</strong>
              <span>{pendingExchange.from} a {pendingExchange.to}</span>
            </div>

            <div className="add-balance-modal__actions">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setPendingExchange(null)}
                disabled={isSubmitting}
                autoFocus
              >
                Cancelar
              </Button>
              <Button
                size="lg"
                trailingIcon={<SwapIcon />}
                onClick={confirmExchange}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Cambiando...' : 'Confirmar cambio'}
              </Button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  )
}
