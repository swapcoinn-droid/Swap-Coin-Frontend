import { createContext } from 'react'

export type AuthContextValue = {
  isAuthenticated: boolean
  startSession: (token: string) => void
  endSession: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
