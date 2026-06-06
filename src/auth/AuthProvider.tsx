import { useState, type ReactNode } from 'react'

import { AuthContext } from './authContext'

const AUTH_TOKEN_KEY = 'swap-coin-access-token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(localStorage.getItem(AUTH_TOKEN_KEY)),
  )

  const startSession = (token: string) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
    setIsAuthenticated(true)
  }

  const endSession = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, startSession, endSession }}
    >
      {children}
    </AuthContext.Provider>
  )
}
