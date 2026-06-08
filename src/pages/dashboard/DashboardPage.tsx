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

import './dashboard-page.css'

type CurrencyCode = 'COP' | 'USD' | 'EUR'

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

const metrics = [
  {
    title: 'Peso colombiano',
    value: '$ 4.560.200',
    label: 'COP',
    footerLabel: 'Cuenta principal',
    tone: 'brand' as const,
    icon: <CurrencyFlag currency="COP" />,
  },
  {
    title: 'Dólar americano',
    value: '$ 1,120.50',
    label: 'USD',
    footerLabel: 'Disponible',
    tone: 'secondary' as const,
    icon: <CurrencyFlag currency="USD" />,
  },
  {
    title: 'Euro',
    value: '€ 950.00',
    label: 'EUR',
    footerLabel: 'Ahorro activo',
    tone: 'brand' as const,
    icon: <CurrencyFlag currency="EUR" />,
  },
]

const exchangeRates = [
  { from: 'USD' as const, to: 'COP', rate: '1 USD = $ 4.075 COP' },
  { from: 'EUR' as const, to: 'COP', rate: '1 EUR = $ 4.390 COP' },
  { from: 'COP' as const, to: 'USD', rate: '$ 100.000 COP = 24.54 USD' },
]

const quickActions = [
  { label: 'Cambiar divisa', tone: 'highlight' as const, icon: <SwapIcon />, to: routes.exchange },
  { label: 'Retirar', tone: 'neutral' as const, icon: <BankIcon />, to: routes.withdraw },
  { label: 'Agregar saldo', tone: 'neutral' as const, icon: <PlusIcon />, to: routes.topUp },
]

const goals = [
  {
    title: 'Vuelo a Bali',
    amount: '$850 / $1,200 USD',
    progress: 70,
    subtitle: 'Ahorro para viaje',
    icon: <PlaneIcon />,
    progressTone: 'brand' as const,
  },
  {
    title: 'Nómada Hub Rent',
    amount: '€400 / €600 EUR',
    progress: 66,
    subtitle: 'Renta mensual',
    icon: <HomeIcon />,
    progressTone: 'warning' as const,
  },
]

const transactions = [
  {
    title: 'Starbucks Bogota',
    subtitle: 'Hoy, 10:45 AM',
    amount: '- $ 18,500 COP',
    amountTone: 'negative' as const,
    meta: 'Comida y bebida',
    icon: <BagIcon />,
  },
  {
    title: 'Cambio USD a COP',
    subtitle: 'Ayer, 04:20 PM',
    amount: '+ $ 350,000 COP',
    amountTone: 'positive' as const,
    meta: 'Conversión',
    icon: <SwapIcon />,
  },
  {
    title: 'Airbnb Madrid',
    subtitle: '12 Oct 2023',
    amount: '- € 120.00 EUR',
    amountTone: 'negative' as const,
    meta: 'Alojamiento',
    icon: <PlaneIcon />,
  },
  {
    title: 'Recarga de saldo',
    subtitle: '10 Oct 2023',
    amount: '+ $ 500,00 USD',
    amountTone: 'positive' as const,
    meta: 'Transferencia',
    icon: <PlusIcon />,
  },
]

export function DashboardPage() {
  const { currentUserEmail } = useAuth()
  const navigate = useNavigate()

  const openGoals = () => {
    navigate(routes.goals)
  }

  return (
    <div className="dashboard-page">
      <section className="dashboard-page__hero">
        <div className="dashboard-page__hero-copy">
          <span className="dashboard-page__eyebrow">Dashboard financiero</span>
          <h1>¡Hola, {currentUserEmail ?? 'usuario'}!</h1>
          <p>Bienvenido de nuevo a tu centro financiero nómada.</p>
        </div>

        <aside className="dashboard-page__hero-panel" aria-label="Resumen financiero">
          <span className="dashboard-page__hero-panel-label">Saldo total estimado</span>
          <strong>$ 5.960.450 COP</strong>
          <span className="dashboard-page__hero-panel-note">Actualizado hoy</span>

          <div className="dashboard-page__rates" aria-label="Tasas destacadas">
            {exchangeRates.map((rate) => (
              <div className="dashboard-page__rate" key={`${rate.from}-${rate.to}`}>
                <CurrencyFlag currency={rate.from} />
                <span>{rate.rate}</span>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="dashboard-page__metrics" aria-label="Resumen de saldos">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            label={metric.label}
            tone={metric.tone}
            icon={metric.icon}
            footerLabel={metric.footerLabel}
          />
        ))}
      </section>

      <section className="dashboard-page__section">
        <SectionHeader eyebrow="Acciones rápidas" title="Acciones rápidas" />

        <div className="dashboard-page__quick-actions">
          {quickActions.map((action) => (
            <QuickActionCard
              key={action.label}
              label={action.label}
              tone={action.tone}
              icon={action.icon}
              to={action.to}
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
            {goals.map((goal) => (
              <GoalRow
                key={goal.title}
                title={goal.title}
                amount={goal.amount}
                progress={goal.progress}
                subtitle={goal.subtitle}
                icon={goal.icon}
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
              <Button variant="ghost" size="sm">
                Exportar
              </Button>
            }
          />

          <div className="dashboard-panel__transactions-list">
            {transactions.map((transaction) => (
              <TransactionItem
                key={`${transaction.title}-${transaction.subtitle}`}
                title={transaction.title}
                subtitle={transaction.subtitle}
                amount={transaction.amount}
                amountTone={transaction.amountTone}
                icon={<IconBubble tone="light">{transaction.icon}</IconBubble>}
                meta={transaction.meta}
              />
            ))}
          </div>
        </Card>
      </section>

      <footer className="dashboard-page__footer">
        <div>
          <strong className="dashboard-page__footer-brand">Swap-Coin</strong>
          <p>© 2024 Swap-Coin. Built for the modern nomad.</p>
        </div>

        <nav className="dashboard-page__footer-links" aria-label="Enlaces informativos">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Help Center</a>
          <a href="#">Contact</a>
        </nav>
      </footer>

      <FloatingActionButton label="Abrir chat" icon={<ChatIcon />} />
    </div>
  )
}
