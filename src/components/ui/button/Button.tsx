import type { ButtonHTMLAttributes, ReactNode } from 'react'

import './button.css'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
}

export function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  leadingIcon,
  trailingIcon,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={['sc-button', `sc-button--${variant}`, `sc-button--${size}`, className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {leadingIcon ? <span className="sc-button__icon">{leadingIcon}</span> : null}
      <span className="sc-button__label">{children}</span>
      {trailingIcon ? <span className="sc-button__icon">{trailingIcon}</span> : null}
    </button>
  )
}