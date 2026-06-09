import { Outlet, useNavigate } from 'react-router-dom'

import { LogoutIcon } from '../components/icons/AuthIcons'
import { Navbar } from '../components/navbar/Navbar'
import { PublicFooter } from '../components/public-layout/PublicFooter'
import { useAuth } from '../hooks/useAuth'
import { routes } from '../router/routes'

export function AppLayout() {
  const { endSession } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    endSession()
    navigate(routes.home)
  }

  return (
    <div className="app-shell">
      <Navbar
        brand="Swap-Coin"
        brandTo={routes.dashboard}
        links={[
          { label: 'Inicio', to: routes.dashboard },
          { label: 'Metas de ahorro', to: routes.goals },
          { label: 'Historial de Transacciones', to: routes.history },
        ]}
        actions={[
          { label: 'Cerrar Sesión', variant: 'pill', icon: <LogoutIcon />, onClick: handleLogout },
        ]}
      />

      <main className="app-shell__content">
        <Outlet />
      </main>

      <PublicFooter />
    </div>
  )
}
