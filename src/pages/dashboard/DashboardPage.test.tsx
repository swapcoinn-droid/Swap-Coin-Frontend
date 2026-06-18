import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { getGoals, type GoalsResponse } from '../../services/goalsApi'
import {
  getWallet,
  getWalletTransactions,
  type TransactionsResponse,
  type Wallet,
} from '../../services/walletApi'
import { routes } from '../../router/routes'
import { pageRoute, renderWithAuth } from '../../test/renderWithAuth'
import { DashboardPage } from './DashboardPage'

vi.mock('../../services/goalsApi', () => ({
  getGoals: vi.fn(),
}))

vi.mock('../../services/walletApi', () => ({
  getWallet: vi.fn(),
  getWalletTransactions: vi.fn(),
}))

const wallet: Wallet = {
  walletId: 1,
  totalEstimatedCOP: 350000,
  balances: [
    {
      currency: 'COP',
      name: 'Peso colombiano',
      symbol: '$',
      amount: 200000,
      estimatedCOP: 200000,
    },
    {
      currency: 'USD',
      name: 'DÃ³lar americano',
      symbol: 'US$',
      amount: 50,
      estimatedCOP: 150000,
    },
  ],
}

const transactionsResponse: TransactionsResponse = {
  data: [
    {
      id: 1,
      type: 'deposit',
      amount: 200000,
      currency: 'COP',
      currencySymbol: '$',
      targetCurrency: null,
      targetCurrencySymbol: null,
      exchangeRate: null,
      description: 'Recarga de prueba',
      createdAt: '2026-06-15T10:00:00.000Z',
    },
  ],
  pagination: {
    total: 1,
    page: 1,
    limit: 4,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  },
}

const goalsResponse: GoalsResponse = {
  data: [
    {
      id: 1,
      name: 'Viaje a Brasil',
      currency: 'USD',
      currencySymbol: 'US$',
      targetAmount: 1000,
      currentAmount: 250,
      progress: 25,
      targetDate: '2026-12-01T00:00:00.000Z',
      status: 'active',
      createdAt: '2026-06-15T10:00:00.000Z',
    },
  ],
  pagination: {
    total: 1,
    page: 1,
    limit: 2,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  },
}

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.mocked(getWallet).mockResolvedValue(wallet)
    vi.mocked(getWalletTransactions).mockResolvedValue(transactionsResponse)
    vi.mocked(getGoals).mockResolvedValue(goalsResponse)
  })

  it('renders user name, wallet balances, goals and transactions', async () => {
    renderWithAuth(<DashboardPage />, {
      auth: {
        isAuthenticated: true,
        currentName: 'Andres',
        currentUserEmail: 'andres@example.com',
      },
    })

    expect(screen.getByRole('heading', { name: /hola, andres/i })).toBeInTheDocument()
    expect(await screen.findByText('Peso colombiano')).toBeInTheDocument()
    expect(screen.getByText('DÃ³lar americano')).toBeInTheDocument()
    expect(screen.getByText('Viaje a Brasil')).toBeInTheDocument()
    expect(screen.getByText('Recarga de saldo')).toBeInTheDocument()
    expect(getWalletTransactions).toHaveBeenCalledWith(1, 4)
    expect(getGoals).toHaveBeenCalledWith(1, 2)
  })

  it('shows financial API errors', async () => {
    vi.mocked(getWallet).mockRejectedValue(new Error('Wallet no disponible'))
    vi.mocked(getWalletTransactions).mockResolvedValue(transactionsResponse)

    renderWithAuth(<DashboardPage />, {
      auth: { isAuthenticated: true, currentName: 'Andres' },
    })

    expect(await screen.findByText('Wallet no disponible')).toBeInTheDocument()
  })

  it('navigates to history from the transactions card action', async () => {
    const user = userEvent.setup()

    renderWithAuth(<DashboardPage />, {
      auth: { isAuthenticated: true },
      initialEntries: [routes.dashboard],
      routes: (
        <>
          {pageRoute(routes.dashboard, <DashboardPage />)}
          {pageRoute(routes.history, <h1>Historial listo</h1>)}
        </>
      ),
    })

    await screen.findByText('Recarga de saldo')
    await user.click(screen.getByRole('button', { name: /ver historial/i }))

    expect(await screen.findByRole('heading', { name: /historial listo/i })).toBeInTheDocument()
  })
})
