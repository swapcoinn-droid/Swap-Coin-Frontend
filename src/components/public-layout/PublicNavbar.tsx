import { useState } from 'react'
import { Link } from 'react-router-dom'

import { BrandMark } from '../icons/BrandMark'
import { routes } from '../../router/routes'
import './public-layout.css'

export function PublicNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="public-navbar">
      <Link
        className="public-navbar__brand"
        to={routes.home}
        aria-label="Swap-Coin inicio"
        onClick={closeMenu}
      >
        <span className="public-navbar__mark">
          <BrandMark />
        </span>
        <span>Swap-Coin</span>
      </Link>

      <button
        className="public-navbar__toggle"
        type="button"
        aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={isMenuOpen}
        aria-controls="public-navigation"
        onClick={() => setIsMenuOpen((current) => !current)}
      >
        <span />
        <span />
        <span />
      </button>

      <nav
        id="public-navigation"
        className={`public-navbar__links${isMenuOpen ? ' is-open' : ''}`}
        aria-label="Navegación pública"
      >
        <a href="/#features" onClick={closeMenu}>Funciones</a>
        <a href="/#audience" onClick={closeMenu}>Quiénes somos</a>
        <Link to={routes.login} onClick={closeMenu}>Iniciar sesión</Link>
        <Link className="public-navbar__cta" to={routes.register} onClick={closeMenu}>
          Crear cuenta
        </Link>
      </nav>
    </header>
  )
}
