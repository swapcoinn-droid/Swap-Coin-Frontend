export type CurrencyCode = 'COP' | 'USD' | 'EUR'
export type DashboardIconKey = 'bag' | 'bank' | 'home' | 'plane' | 'plus' | 'swap'
export type DashboardRouteKey = 'exchange' | 'topUp' | 'withdraw'

export const dashboardSummaryMock = {
  totalBalance: '$ 5.960.450 COP',
  updatedLabel: 'Actualizado hoy',
}

export const dashboardMetricsMock = [
  {
    title: 'Peso colombiano',
    value: '$ 4.560.200',
    label: 'COP' as CurrencyCode,
    footerLabel: 'Cuenta principal',
    tone: 'brand' as const,
  },
  {
    title: 'Dólar americano',
    value: '$ 1,120.50',
    label: 'USD' as CurrencyCode,
    footerLabel: 'Disponible',
    tone: 'secondary' as const,
  },
  {
    title: 'Euro',
    value: '€ 950.00',
    label: 'EUR' as CurrencyCode,
    footerLabel: 'Ahorro activo',
    tone: 'brand' as const,
  },
]

export const exchangeRatesMock = [
  { from: 'USD' as CurrencyCode, to: 'COP' as CurrencyCode, rate: '1 USD = $ 4.075 COP' },
  { from: 'EUR' as CurrencyCode, to: 'COP' as CurrencyCode, rate: '1 EUR = $ 4.390 COP' },
  { from: 'COP' as CurrencyCode, to: 'USD' as CurrencyCode, rate: '$ 100.000 COP = 24.54 USD' },
]

export const quickActionsMock = [
  {
    label: 'Cambiar divisa',
    tone: 'highlight' as const,
    icon: 'swap' as DashboardIconKey,
    route: 'exchange' as DashboardRouteKey,
  },
  {
    label: 'Retirar',
    tone: 'neutral' as const,
    icon: 'bank' as DashboardIconKey,
    route: 'withdraw' as DashboardRouteKey,
  },
  {
    label: 'Agregar saldo',
    tone: 'neutral' as const,
    icon: 'plus' as DashboardIconKey,
    route: 'topUp' as DashboardRouteKey,
  },
]

export const goalsMock = [
  {
    title: 'Vuelo a Bali',
    amount: '$850 / $1,200 USD',
    progress: 70,
    subtitle: 'Ahorro para viaje',
    icon: 'plane' as DashboardIconKey,
    progressTone: 'brand' as const,
  },
  {
    title: 'Nómada Hub Rent',
    amount: '€400 / €600 EUR',
    progress: 66,
    subtitle: 'Renta mensual',
    icon: 'home' as DashboardIconKey,
    progressTone: 'warning' as const,
  },
]

export const transactionsMock = [
  {
    title: 'Starbucks Bogota',
    subtitle: 'Hoy, 10:45 AM',
    amount: '- $ 18,500 COP',
    amountTone: 'negative' as const,
    meta: 'Comida y bebida',
    icon: 'bag' as DashboardIconKey,
  },
  {
    title: 'Cambio USD a COP',
    subtitle: 'Ayer, 04:20 PM',
    amount: '+ $ 350,000 COP',
    amountTone: 'positive' as const,
    meta: 'Conversión',
    icon: 'swap' as DashboardIconKey,
  },
  {
    title: 'Airbnb Madrid',
    subtitle: '12 Oct 2023',
    amount: '- € 120.00 EUR',
    amountTone: 'negative' as const,
    meta: 'Alojamiento',
    icon: 'plane' as DashboardIconKey,
  },
  {
    title: 'Recarga de saldo',
    subtitle: '10 Oct 2023',
    amount: '+ $ 500,00 USD',
    amountTone: 'positive' as const,
    meta: 'Transferencia',
    icon: 'plus' as DashboardIconKey,
  },
]
