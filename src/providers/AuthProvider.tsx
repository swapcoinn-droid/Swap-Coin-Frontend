import { useState, type ReactNode } from 'react'

import { AuthContext } from '../context/AuthContext'
import {
  clearLocalSession,
  createLocalSession,
  hasLocalSession,
  loginLocalUser,
  registerLocalUser,
} from '../services/localAuth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(hasLocalSession)

  const login = async (email: string, password: string, remember: boolean) => {
    const result = await loginLocalUser(email, password)

    if (!result.ok) {
      return result
    }

    createLocalSession(result.user, remember)
    setIsAuthenticated(true)

    return { ok: true }
  }

  const register = async (input: { fullName: string; email: string; password: string }) => {
    const result = await registerLocalUser(input)

    return result.ok ? { ok: true } : result
  }

  const endSession = () => {
    clearLocalSession()
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, register, endSession }}
    >
      {children}
    </AuthContext.Provider>
  )
}
