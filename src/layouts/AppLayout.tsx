import { NavLink, Outlet } from 'react-router-dom'

import { routes } from '../router/routes'

export function AppLayout() {
  return (
    <>
      <header>
        <strong>Swap-Coin</strong>
        <nav aria-label="Navegación privada">
          <NavLink to={routes.dashboard}>Dashboard</NavLink>
          <NavLink to={routes.goals}>Metas</NavLink>
          <NavLink to={routes.history}>Historial</NavLink>
          <NavLink to={routes.buy}>Comprar</NavLink>
        </nav>
      </header>

      <Outlet />
    </>
  )
}
