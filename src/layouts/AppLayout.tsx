import { Outlet, useNavigate } from 'react-router-dom'

import { LogoutIcon, UserIcon } from '../components/icons/AuthIcons'
import { Navbar } from '../components/navbar/Navbar'
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
          { label: 'Dashboard', to: routes.dashboard },
          { label: 'Goals', to: routes.goals },
          { label: 'History', to: routes.history },
        ]}
        actions={[
          { label: 'Profile', to: routes.dashboard, variant: 'pill', icon: <UserIcon /> },
          { label: 'Logout', variant: 'icon', icon: <LogoutIcon />, onClick: handleLogout },
        ]}
        activeLinkLabel="Dashboard"
      />

      <main className="app-shell__content">
        <Outlet />
      </main>
    </div>
  )
}
