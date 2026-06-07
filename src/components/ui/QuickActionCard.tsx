import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { Link } from 'react-router-dom'

import './quick-action-card.css'

type QuickActionCardProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string
  icon: ReactNode
  tone?: 'highlight' | 'neutral'
  to?: string
}

export function QuickActionCard({
  label,
  icon,
  tone = 'neutral',
  className = '',
  type = 'button',
  to,
  ...props
}: QuickActionCardProps) {
  const content = (
    <>
      <span className="sc-quick-action-card__icon" aria-hidden="true">
        {icon}
      </span>
      <span className="sc-quick-action-card__label">{label}</span>
    </>
  )

  if (to) {
    return (
      <Link
        to={to}
        className={['sc-quick-action-card', `sc-quick-action-card--${tone}`, className]
          .filter(Boolean)
          .join(' ')}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      type={type}
      className={['sc-quick-action-card', `sc-quick-action-card--${tone}`, className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {content}
    </button>
  )
}