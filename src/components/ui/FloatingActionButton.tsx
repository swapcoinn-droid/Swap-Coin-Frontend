import type { ButtonHTMLAttributes, ReactNode } from 'react'

import './floating-action-button.css'

type FloatingActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode
  label: string
}

export function FloatingActionButton({ icon, label, className = '', ...props }: FloatingActionButtonProps) {
  return (
    <button
      type="button"
      className={['sc-fab', className].filter(Boolean).join(' ')}
      aria-label={label}
      {...props}
    >
      {icon ? <span className="sc-fab__icon">{icon}</span> : null}
      <span className="sc-fab__label">{label}</span>
    </button>
  )
}
