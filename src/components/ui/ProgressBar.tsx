import './progress-bar.css'

type ProgressBarProps = {
  value: number
  max?: number
  tone?: 'brand' | 'accent' | 'success' | 'warning'
  label?: string
}

export function ProgressBar({ value, max = 100, tone = 'brand', label }: ProgressBarProps) {
  const percent = Math.max(0, Math.min(100, (value / max) * 100))

  return (
    <div className="sc-progress">
      {label ? <div className="sc-progress__label">{label}</div> : null}
      <div className="sc-progress__track" aria-hidden="true">
        <div className={`sc-progress__fill sc-progress__fill--${tone}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}