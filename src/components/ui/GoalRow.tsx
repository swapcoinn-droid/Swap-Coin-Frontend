import type { ReactNode } from 'react'

import { ProgressBar } from './ProgressBar'

import './goal-row.css'

type GoalRowProps = {
  title: string
  amount: string
  progress: number
  subtitle: string
  icon: ReactNode
  progressTone?: 'brand' | 'accent' | 'success' | 'warning'
}

export function GoalRow({
  title,
  amount,
  progress,
  subtitle,
  icon,
  progressTone = 'brand',
}: GoalRowProps) {
  return (
    <article className="sc-goal-row">
      <div className="sc-goal-row__icon" aria-hidden="true">
        {icon}
      </div>

      <div className="sc-goal-row__content">
        <div className="sc-goal-row__heading">
          <div>
            <h3 className="sc-goal-row__title">{title}</h3>
            <p className="sc-goal-row__subtitle">{subtitle}</p>
          </div>
          <strong className="sc-goal-row__progress">{progress}%</strong>
        </div>
        <ProgressBar value={progress} tone={progressTone} />
      </div>

      <div className="sc-goal-row__amount">{amount}</div>
    </article>
  )
}