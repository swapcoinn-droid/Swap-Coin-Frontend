import { useState, type ReactNode } from 'react'

import { ApiError } from '../api'
import { AuthContext } from '../context/AuthContext'
import { loginUser, registerUser } from '../services/authApi'
import {
  clearAuthSession,
  getSessionUser,
  hasAuthSession,
  saveAuthSession,
} from '../services/authSession'

function getErrorMessage(error: unknown) {
  return error instanceof ApiError ? error.message : 'No fue posible conectar con el servidor.'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(hasAuthSession)
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(() =>
    getSessionUser()?.email ?? null,
  )
  const [currentName, setCurrentName] = useState<string | null>(() =>
    getSessionUser()?.name ?? null,
  )

  const login = async (email: string, password: string, remember: boolean) => {
    try {
      const result = await loginUser(email, password)

      saveAuthSession(result.token, result.user, remember)
      setIsAuthenticated(true)
      setCurrentUserEmail(result.user.email)
      setCurrentName(result.user.name)

      return { ok: true }
    } catch (error) {
      return { ok: false, message: getErrorMessage(error) }
    }
  }

  const register = async (input: { fullName: string; email: string; password: string }) => {
    try {
      await registerUser(input)
      return { ok: true }
    } catch (error) {
      return { ok: false, message: getErrorMessage(error) }
    }
  }

  const endSession = () => {
    clearAuthSession()
    setIsAuthenticated(false)
    setCurrentUserEmail(null)
    setCurrentName(null)
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, currentUserEmail, currentName, login, register, endSession }}
    >
      {children}
    </AuthContext.Provider>
  )
}
