import { screen } from '@testing-library/react'
import { Route } from 'react-router-dom'

import { routes } from '../routes'
import { pageRoute, renderWithAuth } from '../../test/renderWithAuth'
import { GuestGuard } from './GuestGuard'
import { ProtectedRoute } from './ProtectedRoute'

describe('route guards', () => {
  it('redirects anonymous users from protected routes to login', () => {
    renderWithAuth(null, {
      auth: { isAuthenticated: false },
      initialEntries: [routes.dashboard],
      routes: (
        <>
          <Route element={<ProtectedRoute />}>
            {pageRoute(routes.dashboard, <h1>Dashboard privado</h1>)}
          </Route>
          {pageRoute(routes.login, <h1>Login público</h1>)}
        </>
      ),
    })

    expect(screen.getByRole('heading', { name: /login público/i })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /dashboard privado/i })).not.toBeInTheDocument()
  })

  it('allows authenticated users to access protected routes', () => {
    renderWithAuth(null, {
      auth: { isAuthenticated: true },
      initialEntries: [routes.dashboard],
      routes: (
        <>
          <Route element={<ProtectedRoute />}>
            {pageRoute(routes.dashboard, <h1>Dashboard privado</h1>)}
          </Route>
          {pageRoute(routes.login, <h1>Login público</h1>)}
        </>
      ),
    })

    expect(screen.getByRole('heading', { name: /dashboard privado/i })).toBeInTheDocument()
  })

  it('allows guests to access guest routes', () => {
    renderWithAuth(null, {
      auth: { isAuthenticated: false },
      initialEntries: [routes.login],
      routes: (
        <>
          <Route element={<GuestGuard />}>
            {pageRoute(routes.login, <h1>Login público</h1>)}
          </Route>
          {pageRoute(routes.dashboard, <h1>Dashboard privado</h1>)}
        </>
      ),
    })

    expect(screen.getByRole('heading', { name: /login público/i })).toBeInTheDocument()
  })

  it('redirects authenticated users away from guest routes', () => {
    renderWithAuth(null, {
      auth: { isAuthenticated: true },
      initialEntries: [routes.login],
      routes: (
        <>
          <Route element={<GuestGuard />}>
            {pageRoute(routes.login, <h1>Login público</h1>)}
          </Route>
          {pageRoute(routes.dashboard, <h1>Dashboard privado</h1>)}
        </>
      ),
    })

    expect(screen.getByRole('heading', { name: /dashboard privado/i })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /login público/i })).not.toBeInTheDocument()
  })
})
