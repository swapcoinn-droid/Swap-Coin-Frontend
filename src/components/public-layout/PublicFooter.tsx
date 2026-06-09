import { Link } from 'react-router-dom'

import { BrandMark } from '../icons/BrandMark'
import { routes } from '../../router/routes'
import './public-layout.css'

export function PublicFooter() {
  return (
    <footer className="public-footer">
      <Link className="public-footer__brand" to={routes.home} aria-label="Swap-Coin inicio">
        <span className="public-footer__mark">
          <BrandMark />
        </span>
        <span>Swap-Coin</span>
      </Link>

      <p>Finanzas simples para personas que se mueven entre monedas, metas y destinos.</p>
    </footer>
  )
}
