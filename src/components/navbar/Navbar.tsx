import type { ReactNode } from 'react'

import { NavLink } from 'react-router-dom'

import { BrandMark } from '../icons/BrandMark'

import './navbar.css'

type NavbarLink = {
  label: string
  to: string
}

type NavbarAction = {
  label: string
  to?: string
  onClick?: () => void
  icon?: ReactNode
  variant?: 'pill' | 'icon'
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
        {actions.map((action) =>
          action.to ? (
            <NavLink
              key={action.label}
              to={action.to}
              className={({ isActive }) =>
                [
                  'sc-navbar__action',
                  action.variant === 'icon' ? 'sc-navbar__action--icon' : 'sc-navbar__action--pill',
                  isActive ? 'is-active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')
              }
              aria-label={action.variant === 'icon' ? action.label : undefined}
            >
              {action.icon ? <span className="sc-navbar__action-icon">{action.icon}</span> : null}
              {action.variant !== 'icon' ? <span>{action.label}</span> : null}
            </NavLink>
          ) : (
            <button
              key={action.label}
              type="button"
              className={['sc-navbar__action', 'sc-navbar__action--pill'].join(' ')}
              onClick={action.onClick}
            >
              {action.icon ? <span className="sc-navbar__action-icon">{action.icon}</span> : null}
              <span>{action.label}</span>
            </button>
          ),
        )}
      </div>
    </header>
  )
}
