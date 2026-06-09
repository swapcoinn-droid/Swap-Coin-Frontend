import type { ApiUser } from './authApi'

const AUTH_TOKEN_KEY = 'swap-coin-access-token'
const AUTH_USER_KEY = 'swap-coin-session-user'

export type SessionUser = Pick<ApiUser, 'id' | 'username' | 'email'>

function getStorageItem(key: string) {
  return localStorage.getItem(key) ?? sessionStorage.getItem(key)
}

export function saveAuthSession(token: string, user: SessionUser, persistent: boolean) {
  const storage = persistent ? localStorage : sessionStorage

  clearAuthSession()
  storage.setItem(AUTH_TOKEN_KEY, token)
  storage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export function getAuthToken() {
  return getStorageItem(AUTH_TOKEN_KEY)
}

export function getSessionUser(): SessionUser | null {
  const storedUser = getStorageItem(AUTH_USER_KEY)

  if (!storedUser) {
    return null
  }

  try {
    const parsedUser = JSON.parse(storedUser) as Partial<SessionUser>

    if (!parsedUser.id || !parsedUser.username || !parsedUser.email) {
      clearAuthSession()
      return null
    }

    return {
      id: parsedUser.id,
      username: parsedUser.username,
      email: parsedUser.email,
    }
  } catch {
    clearAuthSession()
    return null
  }
}

export function hasAuthSession() {
  return Boolean(getAuthToken() && getSessionUser())
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
  sessionStorage.removeItem(AUTH_TOKEN_KEY)
  sessionStorage.removeItem(AUTH_USER_KEY)
}
