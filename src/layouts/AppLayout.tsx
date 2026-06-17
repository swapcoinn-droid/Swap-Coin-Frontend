import { useEffect, useState } from 'react'

import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { LogoutIcon } from '../components/icons/AuthIcons'
import { Navbar } from '../components/navbar/Navbar'
import { PublicFooter } from '../components/public-layout/PublicFooter'
import { Button } from '../components/ui/button/Button'
import { useAuth } from '../hooks/useAuth'
import { routes } from '../router/routes'

export function AppLayout() {
  const { endSession } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  useEffect(() => {
    if (!isLogoutModalOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLogoutModalOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isLogoutModalOpen])

  const confirmLogout = () => {
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
          { label: 'Cerrar Sesión', variant: 'pill', icon: <LogoutIcon />, onClick: () => setIsLogoutModalOpen(true) },
        ]}
      />

      <main className="app-shell__content">
        <Outlet />
      </main>

      <PublicFooter />

      {isLogoutModalOpen ? (
        <div
          className="app-logout-modal__backdrop"
          onClick={() => setIsLogoutModalOpen(false)}
        >
          <section
            className="app-logout-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-confirmation-title"
            aria-describedby="logout-confirmation-description"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="app-logout-modal__icon" aria-hidden="true">
              <LogoutIcon />
            </span>
            <div className="app-logout-modal__copy">
              <span>Confirmar salida</span>
              <h2 id="logout-confirmation-title">¿Deseas cerrar sesión?</h2>
              <p id="logout-confirmation-description">
                Tendrás que iniciar sesión nuevamente para volver a consultar tu wallet, metas y movimientos.
              </p>
            </div>
            <div className="app-logout-modal__actions">
              <Button variant="secondary" size="lg" onClick={() => setIsLogoutModalOpen(false)} autoFocus>
                Cancelar
              </Button>
              <Button size="lg" trailingIcon={<LogoutIcon />} onClick={confirmLogout}>
                Cerrar sesión
              </Button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  )
}
