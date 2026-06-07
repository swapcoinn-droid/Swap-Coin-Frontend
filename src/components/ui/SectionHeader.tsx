import type { ReactNode } from 'react'

import './section-header.css'

type SectionHeaderProps = {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
}

export function SectionHeader({ eyebrow, title, description, action }: SectionHeaderProps) {
  return (
    <div className="sc-section-header">
      <div className="sc-section-header__copy">
        {eyebrow ? <span className="sc-section-header__eyebrow">{eyebrow}</span> : null}
        <h2 className="sc-section-header__title">{title}</h2>
        {description ? <p className="sc-section-header__description">{description}</p> : null}
      </div>
      {action ? <div className="sc-section-header__action">{action}</div> : null}
    </div>
  )
}