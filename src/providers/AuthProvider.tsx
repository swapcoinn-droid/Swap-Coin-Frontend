import { useState, type ReactNode } from 'react'

import { AuthContext } from '../context/AuthContext'
import {
  clearLocalSession,
  createLocalSession,
  getLocalSessionUser,
  hasLocalSession,
  loginLocalUser,
  registerLocalUser,
} from '../services/localAuth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(hasLocalSession)
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(() =>
    getLocalSessionUser()?.email ?? null,
  )
  const [currentUserName, setCurrentUserName] = useState<string | null>(() =>
    getLocalSessionUser()?.fullName ?? null,
  )

  const login = async (email: string, password: string, remember: boolean) => {
    const result = await loginLocalUser(email, password)

    if (!result.ok) {
      return result
    }

    createLocalSession(result.user, remember)
    setIsAuthenticated(true)
    setCurrentUserEmail(result.user.email)
    setCurrentUserName(result.user.fullName)

    return { ok: true }
  }

  const register = async (input: { fullName: string; email: string; password: string }) => {
    const result = await registerLocalUser(input)

    return result.ok ? { ok: true } : result
  }

  const endSession = () => {
    clearLocalSession()
    setIsAuthenticated(false)
    setCurrentUserEmail(null)
    setCurrentUserName(null)
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, currentUserEmail, currentUserName, login, register, endSession }}
    >
      {children}
    </AuthContext.Provider>
  )
}
