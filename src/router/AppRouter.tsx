import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { AppLayout } from '../layouts/AppLayout'
import { DashboardPage } from '../pages/dashboard/DashboardPage'
import { RoutePlaceholder } from '../pages/RoutePlaceholder'
import { LoginPage } from '../pages/auth/LoginPage'
import { RegisterPage } from '../pages/auth/RegisterPage'
import { AuthProvider } from '../providers/AuthProvider'
import { GuestGuard } from './guards/GuestGuard'
import { ProtectedRoute } from './guards/ProtectedRoute'
import { routes } from './routes'

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path={routes.home}
            element={<RoutePlaceholder title="Landing" />}
          />

          <Route element={<GuestGuard />}>
            <Route path={routes.login} element={<LoginPage />} />
            <Route path={routes.register} element={<RegisterPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path={routes.app} element={<AppLayout />}>
              <Route index element={<Navigate to={routes.dashboard} replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route
                path="metas"
                element={<RoutePlaceholder title="Metas" />}
              />
              <Route
                path="historial"
                element={<RoutePlaceholder title="Historial" />}
              />
              <Route
                path="comprar"
                element={<RoutePlaceholder title="Comprar divisa" />}
              />
            </Route>
          </Route>

          <Route
            path="*"
            element={<RoutePlaceholder title="Página no encontrada" />}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
