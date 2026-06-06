import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '../../auth/useAuth'
import { routes } from '../routes'

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={routes.login} replace state={{ from: location }} />
  )
}
