import type { ReactNode } from 'react'

import './transaction-item.css'

type TransactionItemProps = {
  title: string
  subtitle?: string
  amount: string
  amountTone?: 'positive' | 'negative' | 'neutral'
  icon?: ReactNode
  meta?: ReactNode
}

export function TransactionItem({
  title,
  subtitle,
  amount,
  amountTone = 'neutral',
  icon,
  meta,
}: TransactionItemProps) {
  return (
    <article className="sc-transaction-item">
      {icon ? <div className="sc-transaction-item__icon">{icon}</div> : null}
      <div className="sc-transaction-item__copy">
        <strong className="sc-transaction-item__title">{title}</strong>
        {subtitle ? <span className="sc-transaction-item__subtitle">{subtitle}</span> : null}
      </div>
      <div className="sc-transaction-item__aside">
        <strong className={`sc-transaction-item__amount sc-transaction-item__amount--${amountTone}`}>
          {amount}
        </strong>
        {meta ? <span className="sc-transaction-item__meta">{meta}</span> : null}
      </div>
    </article>
  )
}