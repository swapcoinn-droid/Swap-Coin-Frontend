import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { getWalletTransactions, type TransactionsResponse } from '../../services/walletApi'
import { renderWithAuth } from '../../test/renderWithAuth'
import { TransactionsPage } from './TransactionsPage'

vi.mock('../../services/walletApi', () => ({
  getWalletTransactions: vi.fn(),
}))

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
      description: 'Recarga inicial',
      createdAt: '2026-06-15T10:00:00.000Z',
    },
    {
      id: 2,
      type: 'withdrawal',
      amount: 20,
      currency: 'USD',
      currencySymbol: 'US$',
      targetCurrency: null,
      targetCurrencySymbol: null,
      exchangeRate: null,
      description: 'Retiro de prueba',
      createdAt: '2026-06-16T10:00:00.000Z',
    },
    {
      id: 3,
      type: 'exchange',
      amount: 10,
      currency: 'USD',
      currencySymbol: 'US$',
      targetCurrency: 'EUR',
      targetCurrencySymbol: 'â‚¬',
      exchangeRate: 0.9,
      description: 'Cambio de divisa',
      createdAt: '2026-06-17T10:00:00.000Z',
    },
  ],
  pagination: {
    total: 3,
    page: 1,
    limit: 12,
    totalPages: 2,
    hasNextPage: true,
    hasPrevPage: false,
  },
}

describe('TransactionsPage', () => {
  beforeEach(() => {
    vi.mocked(getWalletTransactions).mockResolvedValue(transactionsResponse)
  })

  it('renders transaction summaries and rows', async () => {
    renderWithAuth(<TransactionsPage />)

    expect(await screen.findByText('Recarga de saldo')).toBeInTheDocument()
    expect(screen.getByText('Retiro de saldo')).toBeInTheDocument()
    expect(screen.getByText('Cambio USD a EUR')).toBeInTheDocument()
    expect(screen.getByText('3 transacciones registradas')).toBeInTheDocument()
  })

  it('filters visible transactions by search query', async () => {
    const user = userEvent.setup()

    renderWithAuth(<TransactionsPage />)

    await screen.findByText('Recarga de saldo')
    await user.type(screen.getByLabelText(/buscar/i), 'Retiro')

    expect(screen.getByText('Retiro de saldo')).toBeInTheDocument()
    expect(screen.queryByText('Recarga de saldo')).not.toBeInTheDocument()
    expect(screen.queryByText('Cambio USD a EUR')).not.toBeInTheDocument()
  })

  it('requests the next page from pagination', async () => {
    const user = userEvent.setup()

    renderWithAuth(<TransactionsPage />)

    await screen.findByText('Recarga de saldo')
    await user.click(screen.getByRole('button', { name: /siguiente/i }))

    await waitFor(() => {
      expect(getWalletTransactions).toHaveBeenLastCalledWith(2, 12)
    })
  })
})
