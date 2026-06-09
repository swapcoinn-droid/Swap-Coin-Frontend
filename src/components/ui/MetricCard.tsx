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
    <Card
      className={[
        'sc-metric-card',
        `sc-metric-card--${tone}`,
        label ? `sc-metric-card--${label.toLowerCase()}` : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="sc-metric-card__content">
        <div className="sc-metric-card__header">
          {icon ? <div className="sc-metric-card__icon">{icon}</div> : null}
          <div className="sc-metric-card__heading">
            <span className="sc-metric-card__title">{title}</span>
            {label ? <span className="sc-metric-card__label">{label}</span> : null}
          </div>
        </div>

        <div className="sc-metric-card__balance">
          <span className="sc-metric-card__kicker">Saldo disponible</span>
          <strong className="sc-metric-card__value">{value}</strong>
        </div>

        {footerNote ? (
          <div className="sc-metric-card__footer">
            <span>{footerNote}</span>
            {label ? <strong>{label}</strong> : null}
          </div>
        ) : null}
      </div>
    </Card>
  )
}
