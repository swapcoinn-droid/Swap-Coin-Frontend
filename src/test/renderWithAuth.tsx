import type { ReactNode } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render } from '@testing-library/react'

import { AuthContext, type AuthContextValue } from '../context/AuthContext'

const defaultAuthValue: AuthContextValue = {
  isAuthenticated: false,
  currentUserEmail: null,
  currentName: null,
  login: vi.fn().mockResolvedValue({ ok: true }),
  register: vi.fn().mockResolvedValue({ ok: true }),
  endSession: vi.fn(),
}

type RenderWithAuthOptions = {
  auth?: Partial<AuthContextValue>
  initialEntries?: string[]
  routes?: ReactNode
}

export function renderWithAuth(
  ui: ReactNode,
  { auth = {}, initialEntries = ['/'], routes }: RenderWithAuthOptions = {},
) {
  const authValue = { ...defaultAuthValue, ...auth }

  return {
    authValue,
    ...render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter initialEntries={initialEntries}>
          {routes ? (
            <Routes>
              {routes}
            </Routes>
          ) : ui}
        </MemoryRouter>
      </AuthContext.Provider>,
    ),
  }
}

export function pageRoute(path: string, element: ReactNode) {
  return <Route path={path} element={element} />
}
