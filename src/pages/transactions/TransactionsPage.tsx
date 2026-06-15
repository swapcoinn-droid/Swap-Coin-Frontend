import { useEffect, useMemo, useState, type ReactNode } from 'react'

import { SelectField, TextField } from '../../components/forms'
import { BankIcon, PlusIcon, SwapIcon } from '../../components/icons/AuthIcons'
import { Button, Card, EmptyState, IconBubble, TransactionItem } from '../../components/ui'
import {
  getWalletTransactions,
  type CurrencyCode,
  type TransactionsResponse,
  type WalletTransaction,
} from '../../services/walletApi'
import './transactions-page.css'

type TransactionTypeFilter = 'all' | WalletTransaction['type']
type CurrencyFilter = 'all' | CurrencyCode

const currencyOptions: Array<{ value: CurrencyFilter; label: string }> = [
  { value: 'all', label: 'Todas las divisas' },
  { value: 'COP', label: 'COP - Peso colombiano' },
  { value: 'USD', label: 'USD - Dólar americano' },
  { value: 'EUR', label: 'EUR - Euro' },
]

const transactionTypeOptions: Array<{ value: TransactionTypeFilter; label: string }> = [
  { value: 'all', label: 'Todos los movimientos' },
  { value: 'deposit', label: 'Recargas' },
  { value: 'withdrawal', label: 'Retiros' },
  { value: 'exchange', label: 'Cambios de divisa' },
]

const transactionIcons: Record<WalletTransaction['type'], ReactNode> = {
  deposit: <PlusIcon />,
  withdrawal: <BankIcon />,
  exchange: <SwapIcon />,
}

function formatMoney(amount: number, currency: CurrencyCode) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'COP' ? 0 : 2,
  }).format(amount)
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

function getTransactionTitle(transaction: WalletTransaction) {
  if (transaction.type === 'deposit') return 'Recarga de saldo'
  if (transaction.type === 'withdrawal') return 'Retiro de saldo'

  return `Cambio ${transaction.currency} a ${transaction.targetCurrency ?? ''}`.trim()
}

function getTransactionAmount(transaction: WalletTransaction) {
  const prefix = transaction.type === 'deposit' ? '+' : '-'

  return `${prefix} ${formatMoney(transaction.amount, transaction.currency)}`
}

function getTransactionTone(transaction: WalletTransaction) {
  if (transaction.type === 'deposit') return 'positive'

  return 'negative'
}

function getTransactionIconClass(transaction: WalletTransaction) {
  return `transactions-page__icon transactions-page__icon--${transaction.type}`
}

function getTransactionMeta(transaction: WalletTransaction) {
  if (transaction.type !== 'exchange' || !transaction.targetCurrency) {
    return transaction.description
  }

  const rate = transaction.exchangeRate
    ? ` · Tasa ${transaction.exchangeRate.toLocaleString('es-CO')}`
    : ''

  return `${transaction.description} · Recibe en ${transaction.targetCurrency}${rate}`
}

function isAfterStartDate(transactionDate: Date, startDate: string) {
  if (!startDate) return true

  const start = new Date(`${startDate}T00:00:00`)

  return transactionDate >= start
}

function isBeforeEndDate(transactionDate: Date, endDate: string) {
  if (!endDate) return true

  const end = new Date(`${endDate}T23:59:59`)

  return transactionDate <= end
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'No fue posible consultar el historial.'
}

export function TransactionsPage() {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [pagination, setPagination] = useState<TransactionsResponse['pagination'] | null>(null)
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<TransactionTypeFilter>('all')
  const [currencyFilter, setCurrencyFilter] = useState<CurrencyFilter>('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isActive = true

    getWalletTransactions(page, 12)
      .then((response) => {
        if (isActive) {
          setTransactions(response.data)
          setPagination(response.pagination)
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          setErrorMessage(getErrorMessage(error))
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
  }, [page])

  const changePage = (nextPage: number) => {
    setIsLoading(true)
    setErrorMessage('')
    setPage(nextPage)
  }

  const filteredTransactions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.createdAt)
      const searchableText = [
        getTransactionTitle(transaction),
        transaction.description,
        transaction.currency,
        transaction.targetCurrency ?? '',
        transaction.type,
      ]
        .join(' ')
        .toLowerCase()

      const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery)
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter
      const matchesCurrency =
        currencyFilter === 'all' ||
        transaction.currency === currencyFilter ||
        transaction.targetCurrency === currencyFilter
      const matchesStartDate = isAfterStartDate(transactionDate, startDate)
      const matchesEndDate = isBeforeEndDate(transactionDate, endDate)

      return matchesQuery && matchesType && matchesCurrency && matchesStartDate && matchesEndDate
    })
  }, [currencyFilter, endDate, query, startDate, transactions, typeFilter])

  const summary = useMemo(() => {
    return filteredTransactions.reduce(
      (accumulator, transaction) => {
        accumulator.total += 1

        if (transaction.type === 'deposit') accumulator.deposits += 1
        if (transaction.type === 'withdrawal') accumulator.withdrawals += 1
        if (transaction.type === 'exchange') accumulator.exchanges += 1

        return accumulator
      },
      { total: 0, deposits: 0, withdrawals: 0, exchanges: 0 },
    )
  }, [filteredTransactions])

  const hasActiveFilters =
    query || typeFilter !== 'all' || currencyFilter !== 'all' || startDate || endDate

  const clearFilters = () => {
    setQuery('')
    setTypeFilter('all')
    setCurrencyFilter('all')
    setStartDate('')
    setEndDate('')
  }

  return (
    <div className="transactions-page">
      <section className="transactions-page__hero">
        <div>
          <span className="transactions-page__eyebrow">Consultor de movimientos</span>
          <h1>Historial de transacciones</h1>
          <p>Consulta tus recargas, retiros y cambios de divisa en un solo lugar.</p>
        </div>

        <div className="transactions-page__hero-card" aria-label="Resumen filtrado">
          <span>Movimientos encontrados</span>
          <strong>{isLoading ? '...' : summary.total}</strong>
          <small>{pagination ? `${pagination.total} transacciones registradas` : 'Historial financiero'}</small>
        </div>
      </section>

      <section className="transactions-page__summary" aria-label="Resumen de transacciones">
        <Card className="transactions-page__summary-card">
          <span>Total consultado</span>
          <strong>{summary.total}</strong>
        </Card>
        <Card className="transactions-page__summary-card is-positive">
          <span>Recargas</span>
          <strong>{summary.deposits}</strong>
        </Card>
        <Card className="transactions-page__summary-card is-negative">
          <span>Retiros</span>
          <strong>{summary.withdrawals}</strong>
        </Card>
        <Card className="transactions-page__summary-card is-exchange">
          <span>Cambios</span>
          <strong>{summary.exchanges}</strong>
        </Card>
      </section>

      <Card className="transactions-page__filters">
        <div className="transactions-page__filters-heading">
          <div>
            <span>Filtros</span>
            <h2>Encuentra un movimiento</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={clearFilters} disabled={!hasActiveFilters}>
            Limpiar filtros
          </Button>
        </div>

        <div className="transactions-page__filters-grid">
          <TextField
            id="transaction-search"
            label="Buscar"
            placeholder="Ej. cambio, COP, retiro..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <SelectField
            id="transaction-type"
            label="Tipo de movimiento"
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value as TransactionTypeFilter)}
          >
            {transactionTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>

          <SelectField
            id="transaction-currency"
            label="Divisa"
            value={currencyFilter}
            onChange={(event) => setCurrencyFilter(event.target.value as CurrencyFilter)}
          >
            {currencyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>

          <TextField
            id="transaction-start-date"
            label="Desde"
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />

          <TextField
            id="transaction-end-date"
            label="Hasta"
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
          />
        </div>
      </Card>

      <Card className="transactions-page__list-card">
        <div className="transactions-page__list-heading">
          <div>
            <span>Resultados</span>
            <h2>Movimientos recientes</h2>
          </div>
          <strong>{filteredTransactions.length} visibles</strong>
        </div>

        {errorMessage ? (
          <p className="transactions-page__status is-error" role="alert">
            {errorMessage}
          </p>
        ) : null}

        {isLoading ? <p className="transactions-page__status">Consultando historial...</p> : null}

        {!isLoading && !errorMessage && filteredTransactions.length === 0 ? (
          <EmptyState
            title="No encontramos movimientos"
            description="Prueba cambiando los filtros o consulta otra página del historial."
          />
        ) : null}

        <div className="transactions-page__list">
          {filteredTransactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              title={getTransactionTitle(transaction)}
              subtitle={formatDate(transaction.createdAt)}
              amount={getTransactionAmount(transaction)}
              amountTone={getTransactionTone(transaction)}
              icon={
                <IconBubble tone="light" className={getTransactionIconClass(transaction)}>
                  {transactionIcons[transaction.type]}
                </IconBubble>
              }
              meta={getTransactionMeta(transaction)}
            />
          ))}
        </div>

        <div className="transactions-page__pagination">
          <Button
            variant="outline"
            size="sm"
            onClick={() => changePage(Math.max(page - 1, 1))}
            disabled={isLoading || !pagination?.hasPrevPage}
          >
            Anterior
          </Button>
          <span>
            Página {pagination?.page ?? page} de {pagination?.totalPages ?? 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => changePage(page + 1)}
            disabled={isLoading || !pagination?.hasNextPage}
          >
            Siguiente
          </Button>
        </div>
      </Card>
    </div>
  )
}
