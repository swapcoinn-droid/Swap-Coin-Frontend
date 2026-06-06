import { Card } from './card/Card'
import { Badge } from './Badge'
import { ProgressBar } from './ProgressBar'

import './goal-card.css'

type GoalCardProps = {
  title: string
  progress: number
  goalAmount: string
  deadline: string
  badgeLabel?: string
}

export function GoalCard({ title, progress, goalAmount, deadline, badgeLabel = 'Activo' }: GoalCardProps) {
  return (
    <Card className="sc-goal-card">
      <div className="sc-goal-card__header">
        <div className="sc-goal-card__title-group">
          <h3 className="sc-goal-card__title">{title}</h3>
          <Badge tone="soft">{badgeLabel}</Badge>
        </div>
        <strong className="sc-goal-card__progress-text">{progress}%</strong>
      </div>

      <ProgressBar value={progress} tone={progress >= 80 ? 'accent' : 'brand'} />

      <div className="sc-goal-card__meta">
        <div>
          <span className="sc-goal-card__meta-label">Objetivo</span>
          <strong className="sc-goal-card__meta-value">{goalAmount}</strong>
        </div>
        <div className="sc-goal-card__meta--end">
          <span className="sc-goal-card__meta-label">Fecha límite</span>
          <strong className="sc-goal-card__meta-value">{deadline}</strong>
        </div>
      </div>
    </Card>
  )
}