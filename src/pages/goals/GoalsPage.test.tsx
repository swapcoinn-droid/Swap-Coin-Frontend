import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  contributeToGoal,
  createGoal,
  deleteGoal,
  getGoals,
  updateGoal,
  withdrawFromGoal,
  type GoalsResponse,
  type SavingsGoal,
} from '../../services/goalsApi'
import { getWallet, type Wallet } from '../../services/walletApi'
import { renderWithAuth } from '../../test/renderWithAuth'
import { GoalsPage } from './GoalsPage'

vi.mock('../../services/goalsApi', () => ({
  contributeToGoal: vi.fn(),
  createGoal: vi.fn(),
  deleteGoal: vi.fn(),
  getGoals: vi.fn(),
  updateGoal: vi.fn(),
  withdrawFromGoal: vi.fn(),
}))

vi.mock('../../services/walletApi', () => ({
  getWallet: vi.fn(),
}))

const goal: SavingsGoal = {
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
}

const goalsResponse: GoalsResponse = {
  data: [goal],
  pagination: {
    total: 1,
    page: 1,
    limit: 100,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  },
}

const wallet: Wallet = {
  walletId: 1,
  totalEstimatedCOP: 1000000,
  balances: [
    {
      currency: 'USD',
      name: 'DÃ³lar americano',
      symbol: 'US$',
      amount: 500,
      estimatedCOP: 2000000,
    },
  ],
}

describe('GoalsPage', () => {
  beforeEach(() => {
    vi.mocked(getGoals).mockResolvedValue(goalsResponse)
    vi.mocked(getWallet).mockResolvedValue(wallet)
    vi.mocked(createGoal).mockResolvedValue(goal)
    vi.mocked(updateGoal).mockResolvedValue(goal)
    vi.mocked(contributeToGoal).mockResolvedValue({
      id: 1,
      name: 'Viaje a Brasil',
      targetAmount: 1000,
      currentAmount: 300,
      progress: 30,
      status: 'active',
      completed: false,
    })
    vi.mocked(withdrawFromGoal).mockResolvedValue({
      id: 1,
      name: 'Viaje a Brasil',
      targetAmount: 1000,
      currentAmount: 200,
      progress: 20,
      status: 'active',
      completed: false,
      withdrawn: 50,
    })
    vi.mocked(deleteGoal).mockResolvedValue({ message: 'Meta eliminada' })
  })

  it('renders goals with progress and target information', async () => {
    renderWithAuth(<GoalsPage />)

    expect(await screen.findByRole('heading', { name: 'Viaje a Brasil' })).toBeInTheDocument()
    expect(screen.getByText('25%')).toBeInTheDocument()
    expect(screen.getByText('Objetivo')).toBeInTheDocument()
  })

  it('opens the contribute modal with target amount and available balance', async () => {
    const user = userEvent.setup()

    renderWithAuth(<GoalsPage />)

    await screen.findByRole('heading', { name: 'Viaje a Brasil' })
    await user.click(screen.getByRole('button', { name: /aportar/i }))

    expect(screen.getByRole('heading', { name: /aportar a/i })).toBeInTheDocument()
    expect(screen.getByText('Monto objetivo')).toBeInTheDocument()
    expect(screen.getByText('Saldo disponible para aportar')).toBeInTheDocument()
  })

  it('prevents saving an adjusted target below the current target', async () => {
    const user = userEvent.setup()

    renderWithAuth(<GoalsPage />)

    await screen.findByRole('heading', { name: 'Viaje a Brasil' })
    await user.click(screen.getByRole('button', { name: /ajustar meta/i }))
    const targetInput = screen.getByLabelText(/nuevo monto objetivo/i)

    await user.clear(targetInput)
    await user.type(targetInput, '500')

    expect(targetInput).toHaveAccessibleDescription(/el nuevo objetivo debe ser igual o mayor a/i)
    expect(screen.getByRole('button', { name: /guardar cambios/i })).toBeDisabled()
  })
})
