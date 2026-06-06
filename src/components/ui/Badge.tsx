import type { HTMLAttributes } from 'react'

import './badge.css'

type BadgeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'soft'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone
}

export function Badge({ children, className = '', tone = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={['sc-badge', `sc-badge--${tone}`, className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </span>
  )
}