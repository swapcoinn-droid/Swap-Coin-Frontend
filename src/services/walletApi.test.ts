import { apiRequest } from '../api'
import { clearAuthSession, saveAuthSession } from './authSession'
import {
  depositFunds,
  exchangeFunds,
  getWallet,
  getWalletTransactions,
  withdrawFunds,
} from './walletApi'

vi.mock('../api', () => ({
  apiRequest: vi.fn(),
}))

const user = {
  id: 'user-1',
  name: 'Andres Arias',
  email: 'andres@example.com',
}

describe('wallet API service', () => {
  beforeEach(() => {
    clearAuthSession()
    vi.clearAllMocks()
  })

  it('requires an auth token', () => {
    expect(() => getWallet()).toThrow('Debes iniciar sesión para continuar.')
    expect(apiRequest).not.toHaveBeenCalled()
  })

  it('fetches wallet and transactions with auth headers', () => {
    saveAuthSession('wallet-token', user, true)

    getWallet()
    getWalletTransactions(3, 12)

    expect(apiRequest).toHaveBeenNthCalledWith(1, '/api/wallet', {
      headers: { Authorization: 'Bearer wallet-token' },
    })
    expect(apiRequest).toHaveBeenNthCalledWith(2, '/api/wallet/transactions?page=3&limit=12', {
      headers: { Authorization: 'Bearer wallet-token' },
    })
  })

  it('sends wallet mutation payloads', () => {
    saveAuthSession('wallet-token', user, true)

    depositFunds(100, 'COP')
    withdrawFunds(25, 'USD')
    exchangeFunds('USD', 'EUR', 10)

    expect(apiRequest).toHaveBeenNthCalledWith(1, '/api/wallet/deposit', {
      method: 'POST',
      headers: { Authorization: 'Bearer wallet-token' },
      body: JSON.stringify({ amount: 100, currency: 'COP' }),
    })
    expect(apiRequest).toHaveBeenNthCalledWith(2, '/api/wallet/withdraw', {
      method: 'POST',
      headers: { Authorization: 'Bearer wallet-token' },
      body: JSON.stringify({ amount: 25, currency: 'USD' }),
    })
    expect(apiRequest).toHaveBeenNthCalledWith(3, '/api/wallet/exchange', {
      method: 'POST',
      headers: { Authorization: 'Bearer wallet-token' },
      body: JSON.stringify({ from: 'USD', to: 'EUR', amount: 10 }),
    })
  })
})
