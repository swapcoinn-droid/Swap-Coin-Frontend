import { useEffect, useState, type ReactNode } from 'react'

import { useNavigate } from 'react-router-dom'

import {
  Button,
  Card,
  FloatingActionButton,
  GoalRow,
  IconBubble,
  MetricCard,
  QuickActionCard,
  SectionHeader,
  TransactionItem,
} from '../../components/ui'
import {
  BagIcon,
  BankIcon,
  ChatIcon,
  HomeIcon,
  PlaneIcon,
  PlusIcon,
  SwapIcon,
} from '../../components/icons/AuthIcons'
import { useAuth } from '../../hooks/useAuth'
import { routes } from '../../router/routes'
import {
  getWallet,
  getWalletTransactions,
  type CurrencyCode,
  type Wallet,
  type WalletTransaction,
} from '../../services/walletApi'
import {
  exchangeRatesMock,
  goalsMock,
  quickActionsMock,
  type DashboardIconKey,
  type DashboardRouteKey,
} from './dashboard.mocks'

import './dashboard-page.css'

const currencyFlags: Record<CurrencyCode, { label: string }> = {
  COP: { label: 'Bandera de Colombia' },
  USD: { label: 'Bandera de Estados Unidos' },
  EUR: { label: 'Bandera de la Unión Europea' },
}

function CurrencyFlag({ currency }: { currency: CurrencyCode }) {
  const { label } = currencyFlags[currency]

  return (
    <svg
      className={`dashboard-currency-flag dashboard-currency-flag--${currency.toLowerCase()}`}
      viewBox="0 0 48 32"
      role="img"
      aria-label={label}
      focusable="false"
    >
      {currency === 'COP' ? (
        <>
          <rect width="48" height="16" fill="#fcd116" />
          <rect y="16" width="48" height="8" fill="#003893" />
          <rect y="24" width="48" height="8" fill="#ce1126" />
        </>
      ) : null}

      {currency === 'USD' ? (
        <>
          <rect width="48" height="32" fill="#ffffff" />
          {Array.from({ length: 7 }).map((_, index) => (
            <rect key={index} y={index * 4.92} width="48" height="2.46" fill="#b22234" />
          ))}
          <rect width="20.5" height="17.2" fill="#3c3b6e" />
          {Array.from({ length: 12 }).map((_, index) => (
            <circle
              key={index}
              cx={3.2 + (index % 4) * 4.6}
              cy={3.2 + Math.floor(index / 4) * 4.6}
              r="0.8"
              fill="#ffffff"
            />
          ))}
        </>
      ) : null}

      {currency === 'EUR' ? (
        <>
          <rect width="48" height="32" fill="#003399" />
          {Array.from({ length: 12 }).map((_, index) => {
            const angle = (index / 12) * Math.PI * 2 - Math.PI / 2
            const cx = 24 + Math.cos(angle) * 8.2
            const cy = 16 + Math.sin(angle) * 8.2

            return <circle key={index} cx={cx} cy={cy} r="1.25" fill="#ffcc00" />
          })}
        </>
      ) : null}
    </svg>
  )
}

const dashboardIcons: Record<DashboardIconKey, ReactNode> = {
  bag: <BagIcon />,
  bank: <BankIcon />,
  home: <HomeIcon />,
  plane: <PlaneIcon />,
  plus: <PlusIcon />,
  swap: <SwapIcon />,
}

const quickActionRoutes: Record<DashboardRouteKey, string> = {
  exchange: routes.exchange,
  topUp: routes.topUp,
  withdraw: routes.withdraw,
}

const transactionIcons: Record<WalletTransaction['type'], DashboardIconKey> = {
  deposit: 'plus',
  withdrawal: 'bank',
  exchange: 'swap',
}

function formatMoney(amount: number, currency: CurrencyCode) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
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

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'No fue posible consultar la información financiera.'
}

export function DashboardPage() {
  const { currentName } = useAuth()
  const navigate = useNavigate()
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [financialError, setFinancialError] = useState('')
  const [isFinancialDataLoading, setIsFinancialDataLoading] = useState(true)

  useEffect(() => {
    let isActive = true

    Promise.all([getWallet(), getWalletTransactions(1, 4)])
      .then(([walletData, transactionResponse]) => {
        if (isActive) {
          setWallet(walletData)
          setTransactions(transactionResponse.data)
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          setFinancialError(getErrorMessage(error))
        }
      })
      .finally(() => {
        if (isActive) {
          setIsFinancialDataLoading(false)
        }
      })

    return () => {
      isActive = false
    }
  }, [])

  const openGoals = () => {
    navigate(routes.goals)
  }

  const openHistory = () => {
    navigate(routes.history)
  }

  return (
    <div className="dashboard-page">
      <section className="dashboard-page__hero">
        <div className="dashboard-page__hero-copy">
          <span className="dashboard-page__eyebrow">Dashboard financiero</span>
          <h1>{currentName ? `¡Hola, ${currentName}!` : '¡Hola!'}</h1>
          <p>Bienvenido de nuevo a tu centro financiero nómada.</p>
        </div>

        <aside className="dashboard-page__hero-panel" aria-label="Resumen financiero">
          <span className="dashboard-page__hero-panel-label">Saldo total estimado</span>
          <strong>
            {isFinancialDataLoading
              ? 'Consultando...'
              : formatMoney(wallet?.totalEstimatedCOP ?? 0, 'COP')}
          </strong>
          <span className="dashboard-page__hero-panel-note">
            {financialError || 'Información actualizada desde tu wallet'}
          </span>

          <div className="dashboard-page__rates" aria-label="Tasas destacadas">
            {exchangeRatesMock.map((rate) => (
              <div className="dashboard-page__rate" key={`${rate.from}-${rate.to}`}>
                <CurrencyFlag currency={rate.from} />
                <span>{rate.rate}</span>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="dashboard-page__metrics" aria-label="Resumen de saldos">
        {wallet?.balances.map((balance) => (
          <MetricCard
            key={balance.currency}
            title={balance.name}
            value={formatMoney(balance.amount, balance.currency)}
            label={balance.currency}
            tone={balance.currency === 'USD' ? 'secondary' : 'brand'}
            icon={<CurrencyFlag currency={balance.currency} />}
            footerNote={`${formatMoney(balance.estimatedCOP, 'COP')} estimados`}
          />
        ))}
      </section>

      <section className="dashboard-page__section">
        <SectionHeader eyebrow="Acciones rápidas" title="Acciones rápidas" />

        <div className="dashboard-page__quick-actions">
          {quickActionsMock.map((action) => (
            <QuickActionCard
              key={action.label}
              label={action.label}
              tone={action.tone}
              icon={dashboardIcons[action.icon]}
              to={quickActionRoutes[action.route]}
            />
          ))}
        </div>
      </section>

      <section className="dashboard-page__main-grid">
        <Card
          className="dashboard-panel dashboard-panel--goals dashboard-panel--clickable"
          onClick={openGoals}
          role="link"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              openGoals()
            }
          }}
        >
          <SectionHeader
            eyebrow="Mis metas"
            title="Mis metas"
            action={<span className="dashboard-panel__link-label">Ver todas</span>}
          />

          <div className="dashboard-panel__goals-list">
            {goalsMock.map((goal) => (
              <GoalRow
                key={goal.title}
                title={goal.title}
                amount={goal.amount}
                progress={goal.progress}
                subtitle={goal.subtitle}
                icon={dashboardIcons[goal.icon]}
                progressTone={goal.progressTone}
              />
            ))}

            <div className="dashboard-panel__new-goal" aria-hidden="true">
              <span>+</span>
              <span>Nueva meta</span>
            </div>
          </div>
        </Card>

        <Card className="dashboard-panel dashboard-panel--transactions">
          <SectionHeader
            eyebrow="Últimas transacciones"
            title="Últimas transacciones"
            action={
              <Button variant="ghost" size="sm" onClick={openHistory}>
                Ver historial
              </Button>
            }
          />

          <div className="dashboard-panel__transactions-list">
            {isFinancialDataLoading ? (
              <p className="dashboard-panel__status">Consultando movimientos...</p>
            ) : null}

            {!isFinancialDataLoading && transactions.length === 0 ? (
              <p className="dashboard-panel__status">Todavía no tienes transacciones registradas.</p>
            ) : null}

            {transactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                title={getTransactionTitle(transaction)}
                subtitle={formatDate(transaction.createdAt)}
                amount={`${transaction.type === 'deposit' ? '+' : '-'} ${formatMoney(transaction.amount, transaction.currency)}`}
                amountTone={transaction.type === 'deposit' ? 'positive' : 'negative'}
                icon={<IconBubble tone="light">{dashboardIcons[transactionIcons[transaction.type]]}</IconBubble>}
                meta={transaction.description}
              />
            ))}
          </div>
        </Card>
      </section>

      <FloatingActionButton label="Abrir chat" icon={<ChatIcon />} />
    </div>
  )
}
