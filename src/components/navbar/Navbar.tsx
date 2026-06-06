import { NavLink } from 'react-router-dom'

import { Button } from '../ui/button/Button'
import { BrandMark } from '../icons/BrandMark'

import './navbar.css'

type NavbarLink = {
  label: string
  to: string
}

type NavbarAction = {
  label: string
  to: string
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
}

type NavbarProps = {
  brand: string
  brandTo: string
  links: NavbarLink[]
  actions?: NavbarAction[]
  activeLinkLabel?: string
}

export function Navbar({ brand, brandTo, links, actions = [], activeLinkLabel }: NavbarProps) {
  return (
    <header className="sc-navbar">
      <NavLink to={brandTo} className="sc-navbar__brand" aria-label={brand}>
        <span className="sc-navbar__brand-mark" aria-hidden="true">
          <BrandMark />
        </span>
        <span className="sc-navbar__brand-text">{brand}</span>
      </NavLink>

      <nav className="sc-navbar__links" aria-label="Navegación principal">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              ['sc-navbar__link', isActive || activeLinkLabel === link.label ? 'is-active' : '']
                .filter(Boolean)
                .join(' ')
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="sc-navbar__actions">
        {actions.map((action) => (
          <NavLink key={action.to} to={action.to} className="sc-navbar__action-link">
            <Button variant={action.variant ?? 'ghost'} size="sm">
              {action.label}
            </Button>
          </NavLink>
        ))}
      </div>
    </header>
  )
}