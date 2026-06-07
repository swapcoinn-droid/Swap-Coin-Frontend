import type { HTMLAttributes, ReactNode } from 'react'

import './icon-bubble.css'

type IconBubbleProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode
  tone?: 'blue' | 'gold' | 'light' | 'navy'
  size?: 'sm' | 'md' | 'lg'
}

export function IconBubble({ children, className = '', tone = 'blue', size = 'md', ...props }: IconBubbleProps) {
  return (
    <span
      className={['sc-icon-bubble', `sc-icon-bubble--${tone}`, `sc-icon-bubble--${size}`, className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </span>
  )
}