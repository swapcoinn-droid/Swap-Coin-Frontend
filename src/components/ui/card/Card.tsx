import type { HTMLAttributes, ReactNode } from 'react'

import './card.css'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  title?: string
  subtitle?: string
  headerAction?: ReactNode
  footer?: ReactNode
}

export function Card({
  children,
  className = '',
  title,
  subtitle,
  headerAction,
  footer,
  ...props
}: CardProps) {
  return (
    <section className={['sc-card', className].filter(Boolean).join(' ')} {...props}>
      {title || subtitle || headerAction ? (
        <header className="sc-card__header">
          <div>
            {title ? <h2 className="sc-card__title">{title}</h2> : null}
            {subtitle ? <p className="sc-card__subtitle">{subtitle}</p> : null}
          </div>
          {headerAction ? <div className="sc-card__action">{headerAction}</div> : null}
        </header>
      ) : null}

      <div className="sc-card__body">{children}</div>

      {footer ? <footer className="sc-card__footer">{footer}</footer> : null}
    </section>
  )
}