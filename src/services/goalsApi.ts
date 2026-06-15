import { apiRequest } from '../api'
import { getAuthToken } from './authSession'
import type { CurrencyCode } from './walletApi'

export type GoalStatus = 'active' | 'completed' | 'cancelled'

export type SavingsGoal = {
  id: number
  name: string
  currency: CurrencyCode
  currencySymbol: string
  targetAmount: number
  currentAmount: number
  progress: number
  targetDate: string | null
  status: GoalStatus
  createdAt: string
}

export type GoalsResponse = {
  data: SavingsGoal[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export type CreateGoalInput = {
  name: string
  targetAmount: number
  currency: CurrencyCode
  targetDate?: string | null
}

export type GoalActionResponse = {
  id: number
  name: string
  targetAmount: number
  currentAmount: number
  progress: number
  status: GoalStatus
  completed: boolean
  withdrawn?: number
}

function getAuthHeaders() {
  const token = getAuthToken()

  if (!token) {
    throw new Error('Debes iniciar sesión para continuar.')
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}

export function getGoals(page = 1, limit = 100) {
  const query = new URLSearchParams({ page: String(page), limit: String(limit) })

  return apiRequest<GoalsResponse>(`/api/goals?${query}`, {
    headers: getAuthHeaders(),
  })
}

export function createGoal(input: CreateGoalInput) {
  return apiRequest<SavingsGoal>('/api/goals', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(input),
  })
}

export function contributeToGoal(goalId: number, amount: number) {
  return apiRequest<GoalActionResponse>(`/api/goals/${goalId}/contribute`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ amount }),
  })
}

export function withdrawFromGoal(goalId: number, amount: number) {
  return apiRequest<GoalActionResponse>(`/api/goals/${goalId}/withdraw`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ amount }),
  })
}

export function deleteGoal(goalId: number) {
  return apiRequest<{ message: string }>(`/api/goals/${goalId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
}
