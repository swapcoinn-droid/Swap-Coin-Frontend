import { Link } from 'react-router-dom'

import { BrandMark } from '../icons/BrandMark'
import { routes } from '../../router/routes'
import './public-layout.css'

export function PublicNavbar() {
  return (
    <header className="public-navbar">
      <Link className="public-navbar__brand" to={routes.home} aria-label="Swap-Coin inicio">
        <span className="public-navbar__mark">
          <BrandMark />
        </span>
        <span>Swap-Coin</span>
      </Link>

      <nav className="public-navbar__links" aria-label="Navegación pública">
        <a href="/#features">Funciones</a>
        <a href="/#audience">Quiénes somos</a>
        <Link to={routes.login}>Iniciar sesión</Link>
        <Link className="public-navbar__cta" to={routes.register}>
          Crear cuenta
        </Link>
      </nav>
    </header>
  )
}
