import { Outlet } from 'react-router-dom'

import { Navbar } from '../components/navbar/Navbar'
import { routes } from '../router/routes'

export function AppLayout() {
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
          { label: 'Profile', to: routes.dashboard, variant: 'ghost' },
          { label: 'Logout', to: routes.home, variant: 'primary' },
        ]}
        activeLinkLabel="Dashboard"
      />

      <main className="app-shell__content">
        <Outlet />
      </main>
    </div>
  )
}
