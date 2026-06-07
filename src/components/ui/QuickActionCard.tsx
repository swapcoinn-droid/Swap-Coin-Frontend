import type { ButtonHTMLAttributes, ReactNode } from 'react'

import './quick-action-card.css'

type QuickActionCardProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string
  icon: ReactNode
  tone?: 'highlight' | 'neutral'
}

export function QuickActionCard({
  label,
  icon,
  tone = 'neutral',
  className = '',
  type = 'button',
  ...props
}: QuickActionCardProps) {
  return (
    <button
      type={type}
      className={['sc-quick-action-card', `sc-quick-action-card--${tone}`, className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      <span className="sc-quick-action-card__icon" aria-hidden="true">
        {icon}
      </span>
      <span className="sc-quick-action-card__label">{label}</span>
    </button>
  )
}