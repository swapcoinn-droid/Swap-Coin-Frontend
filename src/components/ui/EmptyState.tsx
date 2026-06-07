import type { ReactNode } from 'react'

import { Card } from './card/Card'

import './empty-state.css'

type EmptyStateProps = {
  title: string
  description: string
  illustration?: ReactNode
  actions?: ReactNode
}

export function EmptyState({ title, description, illustration, actions }: EmptyStateProps) {
  return (
    <Card className="sc-empty-state">
      <div className="sc-empty-state__content">
        {illustration ? <div className="sc-empty-state__illustration">{illustration}</div> : null}
        <h3 className="sc-empty-state__title">{title}</h3>
        <p className="sc-empty-state__description">{description}</p>
        {actions ? <div className="sc-empty-state__actions">{actions}</div> : null}
      </div>
    </Card>
  )
}