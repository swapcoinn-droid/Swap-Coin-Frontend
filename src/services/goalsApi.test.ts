import { apiRequest } from '../api'
import { clearAuthSession, saveAuthSession } from './authSession'
import {
  contributeToGoal,
  createGoal,
  deleteGoal,
  getGoals,
  updateGoal,
  withdrawFromGoal,
} from './goalsApi'

vi.mock('../api', () => ({
  apiRequest: vi.fn(),
}))

const user = {
  id: 'user-1',
  name: 'Andres Arias',
  email: 'andres@example.com',
}

describe('goals API service', () => {
  beforeEach(() => {
    clearAuthSession()
    vi.clearAllMocks()
  })

  it('requires an auth token', () => {
    expect(() => getGoals()).toThrow('Debes iniciar sesión para continuar.')
    expect(apiRequest).not.toHaveBeenCalled()
  })

  it('fetches paginated goals with auth headers', () => {
    saveAuthSession('goal-token', user, true)

    getGoals(2, 5)

    expect(apiRequest).toHaveBeenCalledWith('/api/goals?page=2&limit=5', {
      headers: { Authorization: 'Bearer goal-token' },
    })
  })

  it('creates and updates goals with the expected payloads', () => {
    saveAuthSession('goal-token', user, true)

    createGoal({ name: 'Viaje', targetAmount: 1000, currency: 'USD', targetDate: null })
    updateGoal(7, { targetAmount: 1200, targetDate: '2026-10-20' })

    expect(apiRequest).toHaveBeenNthCalledWith(1, '/api/goals', {
      method: 'POST',
      headers: { Authorization: 'Bearer goal-token' },
      body: JSON.stringify({ name: 'Viaje', targetAmount: 1000, currency: 'USD', targetDate: null }),
    })
    expect(apiRequest).toHaveBeenNthCalledWith(2, '/api/goals/7', {
      method: 'PATCH',
      headers: { Authorization: 'Bearer goal-token' },
      body: JSON.stringify({ targetAmount: 1200, targetDate: '2026-10-20' }),
    })
  })

  it('sends contribute, withdraw and delete requests', () => {
    saveAuthSession('goal-token', user, true)

    contributeToGoal(3, 50)
    withdrawFromGoal(3, 20)
    deleteGoal(3)

    expect(apiRequest).toHaveBeenNthCalledWith(1, '/api/goals/3/contribute', {
      method: 'POST',
      headers: { Authorization: 'Bearer goal-token' },
      body: JSON.stringify({ amount: 50 }),
    })
    expect(apiRequest).toHaveBeenNthCalledWith(2, '/api/goals/3/withdraw', {
      method: 'POST',
      headers: { Authorization: 'Bearer goal-token' },
      body: JSON.stringify({ amount: 20 }),
    })
    expect(apiRequest).toHaveBeenNthCalledWith(3, '/api/goals/3', {
      method: 'DELETE',
      headers: { Authorization: 'Bearer goal-token' },
    })
  })
})
