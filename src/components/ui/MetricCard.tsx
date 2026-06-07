import type { ReactNode } from 'react'

import { Card } from './card/Card'
import { Badge } from './Badge'

import './metric-card.css'

type MetricCardProps = {
  title: string
  value: string
  label?: string
  tone?: 'brand' | 'secondary'
  icon?: ReactNode
  footerLabel?: string
}

export function MetricCard({
  title,
  value,
  label,
  tone = 'brand',
  icon,
  footerLabel,
}: MetricCardProps) {
  return (
    <Card className={['sc-metric-card', `sc-metric-card--${tone}`].join(' ')}>
      <div className="sc-metric-card__top">
        <div className="sc-metric-card__copy">
          <span className="sc-metric-card__title">{title}</span>
          <strong className="sc-metric-card__value">{value}</strong>
          {label ? <span className="sc-metric-card__label">{label}</span> : null}
        </div>
        {icon ? <div className="sc-metric-card__icon">{icon}</div> : null}
      </div>
      {footerLabel ? (
        <div className="sc-metric-card__footer">
          <Badge tone={tone === 'brand' ? 'brand' : 'neutral'}>{footerLabel}</Badge>
        </div>
      ) : null}
    </Card>
  )
}