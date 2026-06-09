import type { ReactNode } from 'react'

import { Card } from './card/Card'

import './metric-card.css'

type MetricCardProps = {
  title: string
  value: string
  label?: string
  tone?: 'brand' | 'secondary'
  icon?: ReactNode
  footerNote?: string
}

export function MetricCard({
  title,
  value,
  label,
  tone = 'brand',
  icon,
  footerNote,
}: MetricCardProps) {
  return (
    <Card className={['sc-metric-card', `sc-metric-card--${tone}`].join(' ')}>
      <div className="sc-metric-card__content">
        <div className="sc-metric-card__header">
          <span className="sc-metric-card__title">{title}</span>
          {icon ? <div className="sc-metric-card__icon">{icon}</div> : null}
        </div>

        <div className="sc-metric-card__balance">
          <strong className="sc-metric-card__value">{value}</strong>
          {label ? <span className="sc-metric-card__label">Saldo en {label}</span> : null}
        </div>

        {footerNote ? <span className="sc-metric-card__footer-note">{footerNote}</span> : null}
      </div>
    </Card>
  )
}
