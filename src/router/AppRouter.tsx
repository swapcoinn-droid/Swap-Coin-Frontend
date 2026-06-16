import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { AppLayout } from '../layouts/AppLayout'
import { DashboardPage } from '../pages/dashboard/DashboardPage'
import { GoalsPage } from '../pages/goals/GoalsPage'
import { LandingPage } from '../pages/landing/LandingPage'
import { TransactionsPage } from '../pages/transactions/TransactionsPage'
import { AddBalancePage } from '../pages/wallet/AddBalancePage'
import { CurrencyExchangePage } from '../pages/wallet/CurrencyExchangePage'
import { WithdrawBalancePage } from '../pages/wallet/WithdrawBalancePage'
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
            element={<LandingPage />}
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
                path="cambiar-divisa"
                element={<CurrencyExchangePage />}
              />
              <Route
                path="retirar"
                element={<WithdrawBalancePage />}
              />
              <Route
                path="agregar-saldo"
                element={<AddBalancePage />}
              />
              <Route
                path="metas"
                element={<GoalsPage />}
              />
              <Route
                path="historial"
                element={<TransactionsPage />}
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
