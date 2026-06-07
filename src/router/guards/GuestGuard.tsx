import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '../../hooks/useAuth'
import { routes } from '../routes'

export function GuestGuard() {
  const { isAuthenticated } = useAuth()

  return isAuthenticated ? <Navigate to={routes.dashboard} replace /> : <Outlet />
}
