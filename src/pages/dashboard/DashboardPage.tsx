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
  ShoppingCartIcon,
  SwapIcon,
} from '../../components/icons/AuthIcons'

import './dashboard-page.css'

const metrics = [
  {
    title: 'Peso colombiano',
    value: '$ 4.560.200',
    label: 'COP',
    tone: 'brand' as const,
    icon: <IconBubble tone="blue">₱</IconBubble>,
  },
  {
    title: 'Dólar americano',
    value: '$ 1,120.50',
    label: 'USD',
    tone: 'secondary' as const,
    icon: <IconBubble tone="navy">$</IconBubble>,
  },
  {
    title: 'Euro',
    value: '€ 950.00',
    label: 'EUR',
    tone: 'brand' as const,
    icon: <IconBubble tone="blue">€</IconBubble>,
  },
]

const quickActions = [
  { label: 'Comprar divisa', tone: 'highlight' as const, icon: <ShoppingCartIcon /> },
  { label: 'Cambiar divisa', tone: 'neutral' as const, icon: <SwapIcon /> },
  { label: 'Retirar', tone: 'neutral' as const, icon: <BankIcon /> },
  { label: 'Agregar saldo', tone: 'neutral' as const, icon: <PlusIcon /> },
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
  return (
    <div className="dashboard-page">
      <section className="dashboard-page__hero">
        <div>
          <h1>¡Hola, Juan Andrés!</h1>
          <p>Bienvenido de nuevo a tu centro financiero nómada.</p>
        </div>

        <div className="dashboard-page__avatar" aria-hidden="true">
          <span />
        </div>
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
          />
        ))}
      </section>

      <section className="dashboard-page__section">
        <SectionHeader eyebrow="Acciones rápidas" title="Acciones rápidas" />

        <div className="dashboard-page__quick-actions">
          {quickActions.map((action) => (
            <QuickActionCard key={action.label} label={action.label} tone={action.tone} icon={action.icon} />
          ))}
        </div>
      </section>

      <section className="dashboard-page__main-grid">
        <Card className="dashboard-panel dashboard-panel--goals">
          <SectionHeader
            eyebrow="Mis metas"
            title="Mis metas"
            action={
              <Button variant="ghost" size="sm">
                Ver todas
              </Button>
            }
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

            <button type="button" className="dashboard-panel__new-goal">
              <span>+</span>
              <span>Nueva meta</span>
            </button>
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