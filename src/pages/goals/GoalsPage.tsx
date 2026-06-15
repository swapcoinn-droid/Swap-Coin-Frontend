import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { ArrowLeftIcon, PlaneIcon, PlusIcon } from '../../components/icons/AuthIcons'
import { Badge, Button, Card, ProgressBar } from '../../components/ui'
import { routes } from '../../router/routes'
import { getGoals, type GoalStatus, type SavingsGoal } from '../../services/goalsApi'
import type { CurrencyCode } from '../../services/walletApi'
import './goals-page.css'

const statusLabels: Record<GoalStatus, string> = {
  active: 'Activa',
  completed: 'Completada',
  cancelled: 'Cancelada',
}

function formatMoney(amount: number, currency: CurrencyCode) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'COP' ? 0 : 2,
  }).format(amount)
}

function formatTargetDate(date: string | null) {
  if (!date) return 'Sin fecha límite'

  return new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' }).format(
    new Date(`${date}T00:00:00`),
  )
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'No fue posible consultar tus metas.'
}

export function GoalsPage() {
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pageError, setPageError] = useState('')

  useEffect(() => {
    let isActive = true

    getGoals()
      .then((response) => {
        if (isActive) setGoals(response.data)
      })
      .catch((error: unknown) => {
        if (isActive) setPageError(getErrorMessage(error))
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [])

  return (
    <div className="goals-page">
      <header className="goals-page__hero">
        <div>
          <span className="goals-page__eyebrow">Ahorro con propósito</span>
          <h1>Mis metas</h1>
          <p>Organiza tus objetivos y sigue el avance de cada ahorro desde un solo lugar.</p>
        </div>

        <div className="goals-page__hero-actions">
          <Link className="goals-page__back-link" to={routes.dashboard}>
            <ArrowLeftIcon />
            <span>Volver al inicio</span>
          </Link>
          <Button size="lg" trailingIcon={<PlusIcon />} disabled>
            Nueva meta
          </Button>
        </div>
      </header>

      {pageError ? <p className="goals-page__message is-error" role="alert">{pageError}</p> : null}

      {isLoading ? (
        <Card className="goals-page__state">
          <p>Consultando tus metas...</p>
        </Card>
      ) : null}

      {!isLoading && !pageError && goals.length === 0 ? (
        <Card className="goals-page__state">
          <span className="goals-page__state-icon" aria-hidden="true"><PlaneIcon /></span>
          <h2>Aún no tienes metas</h2>
          <p>Crea tu primera meta para comenzar a separar saldo y medir tu progreso.</p>
        </Card>
      ) : null}

      {goals.length > 0 ? (
        <section className="goals-page__grid" aria-label="Metas de ahorro">
          {goals.map((goal) => (
            <Card className="goals-card" key={goal.id}>
              <div className="goals-card__heading">
                <div>
                  <span>{goal.currency}</span>
                  <h2>{goal.name}</h2>
                </div>
                <Badge tone="soft">{statusLabels[goal.status]}</Badge>
              </div>

              <div className="goals-card__progress-heading">
                <span>Progreso</span>
                <strong>{Math.min(100, goal.progress).toFixed(0)}%</strong>
              </div>
              <ProgressBar
                value={goal.progress}
                tone={goal.status === 'completed' ? 'success' : 'brand'}
              />

              <div className="goals-card__amounts">
                <div>
                  <span>Ahorrado</span>
                  <strong>{formatMoney(goal.currentAmount, goal.currency)}</strong>
                </div>
                <div>
                  <span>Objetivo</span>
                  <strong>{formatMoney(goal.targetAmount, goal.currency)}</strong>
                </div>
              </div>

              <div className="goals-card__footer">
                <span>Fecha límite</span>
                <strong>{formatTargetDate(goal.targetDate)}</strong>
              </div>
            </Card>
          ))}
        </section>
      ) : null}
    </div>
  )
}
