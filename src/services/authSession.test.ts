import {
  clearAuthSession,
  getAuthToken,
  getSessionUser,
  hasAuthSession,
  saveAuthSession,
} from './authSession'

const sessionUser = {
  id: 'user-1',
  name: 'Andres Arias',
  email: 'andres@example.com',
}

describe('auth session storage', () => {
  beforeEach(() => {
    clearAuthSession()
  })

  it('saves persistent sessions in localStorage', () => {
    saveAuthSession('token-123', sessionUser, true)

    expect(localStorage.getItem('swap-coin-access-token')).toBe('token-123')
    expect(sessionStorage.getItem('swap-coin-access-token')).toBeNull()
    expect(getAuthToken()).toBe('token-123')
    expect(getSessionUser()).toEqual(sessionUser)
    expect(hasAuthSession()).toBe(true)
  })

  it('saves temporary sessions in sessionStorage', () => {
    saveAuthSession('token-456', sessionUser, false)

    expect(sessionStorage.getItem('swap-coin-access-token')).toBe('token-456')
    expect(localStorage.getItem('swap-coin-access-token')).toBeNull()
    expect(getAuthToken()).toBe('token-456')
  })

  it('normalizes legacy username values', () => {
    localStorage.setItem('swap-coin-access-token', 'token-789')
    localStorage.setItem('swap-coin-session-user', JSON.stringify({
      id: 'user-2',
      username: 'Legacy Name',
      email: 'legacy@example.com',
    }))

    expect(getSessionUser()).toEqual({
      id: 'user-2',
      name: 'Legacy Name',
      email: 'legacy@example.com',
    })
  })

  it('clears invalid stored users', () => {
    localStorage.setItem('swap-coin-access-token', 'token-000')
    localStorage.setItem('swap-coin-session-user', '{invalid')

    expect(getSessionUser()).toBeNull()
    expect(getAuthToken()).toBeNull()
    expect(hasAuthSession()).toBe(false)
  })
})
