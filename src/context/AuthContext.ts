import { createContext } from 'react'

export type AuthContextValue = {
  isAuthenticated: boolean
  currentUserEmail: string | null
  currentUserName: string | null
  login: (email: string, password: string, remember: boolean) => Promise<{ ok: boolean; message?: string }>
  register: (input: { fullName: string; email: string; password: string }) => Promise<{ ok: boolean; message?: string }>
  endSession: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
