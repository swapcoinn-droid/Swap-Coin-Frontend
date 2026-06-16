import { apiRequest } from '../api'
import { getAuthToken } from './authSession'

export type CurrencyCode = 'COP' | 'USD' | 'EUR'

export type WalletBalance = {
  currency: CurrencyCode
  name: string
  symbol: string
  amount: number
  estimatedCOP: number
}

export type Wallet = {
  walletId: number
  balances: WalletBalance[]
  totalEstimatedCOP: number
}

export type DepositResult = {
  currency: CurrencyCode
  deposited: number
  newBalance: number
}

export type WithdrawResult = {
  currency: CurrencyCode
  withdrawn: number
  newBalance: number
}

export type ExchangeResult = {
  from: {
    currency: CurrencyCode
    debited: number
  }
  to: {
    currency: CurrencyCode
    credited: number
  }
  appliedRate: number
}

export type WalletTransaction = {
  id: number
  type: 'deposit' | 'withdrawal' | 'exchange'
  amount: number
  currency: CurrencyCode
  currencySymbol: string
  targetCurrency: CurrencyCode | null
  targetCurrencySymbol: string | null
  exchangeRate: number | null
  description: string
  createdAt: string
}

export type TransactionsResponse = {
  data: WalletTransaction[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
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

export function getWallet() {
  return apiRequest<Wallet>('/api/wallet', {
    headers: getAuthHeaders(),
  })
}

export function depositFunds(amount: number, currency: CurrencyCode) {
  return apiRequest<DepositResult>('/api/wallet/deposit', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ amount, currency }),
  })
}

export function withdrawFunds(amount: number, currency: CurrencyCode) {
  return apiRequest<WithdrawResult>('/api/wallet/withdraw', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ amount, currency }),
  })
}

export function exchangeFunds(from: CurrencyCode, to: CurrencyCode, amount: number) {
  return apiRequest<ExchangeResult>('/api/wallet/exchange', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ from, to, amount }),
  })
}

export function getWalletTransactions(page = 1, limit = 10) {
  const query = new URLSearchParams({ page: String(page), limit: String(limit) })

  return apiRequest<TransactionsResponse>(`/api/wallet/transactions?${query}`, {
    headers: getAuthHeaders(),
  })
}
