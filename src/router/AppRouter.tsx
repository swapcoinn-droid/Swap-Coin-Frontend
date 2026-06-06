import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { AuthProvider } from '../providers/AuthProvider'
import { AppLayout } from '../layouts/AppLayout'
import { RoutePlaceholder } from '../pages/RoutePlaceholder'
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
            <Route
              path={routes.login}
              element={<RoutePlaceholder title="Iniciar sesión" />}
            />
            <Route
              path={routes.register}
              element={<RoutePlaceholder title="Crear cuenta" />}
            />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path={routes.app} element={<AppLayout />}>
              <Route index element={<Navigate to={routes.dashboard} replace />} />
              <Route
                path="dashboard"
                element={<RoutePlaceholder title="Dashboard" />}
              />
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
