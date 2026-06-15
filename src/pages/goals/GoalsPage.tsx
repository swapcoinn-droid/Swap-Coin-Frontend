import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { SelectField, TextField } from '../../components/forms'
import {
  ArrowLeftIcon,
  BankIcon,
  LogoutIcon,
  PlaneIcon,
  PlusIcon,
} from '../../components/icons/AuthIcons'
import { Badge, Button, Card, ProgressBar } from '../../components/ui'
import { routes } from '../../router/routes'
import {
  createGoal,
  contributeToGoal,
  deleteGoal,
  getGoals,
  withdrawFromGoal,
  type GoalStatus,
  type SavingsGoal,
} from '../../services/goalsApi'
import type { CurrencyCode } from '../../services/walletApi'
import './goals-page.css'

const statusLabels: Record<GoalStatus, string> = {
  active: 'Activa',
  completed: 'Completada',
  cancelled: 'Cancelada',
}

function formatMoney(amount: number, currency: CurrencyCode) {
  if (!Number.isFinite(amount) || !currency) return 'Monto no disponible'

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

function isSavingsGoal(goal: SavingsGoal) {
  return Boolean(
    goal
    && Number.isFinite(goal.id)
    && goal.name
    && goal.currency
    && Number.isFinite(goal.targetAmount)
    && Number.isFinite(goal.currentAmount)
    && Number.isFinite(goal.progress),
  )
}

type GoalAction = 'contribute' | 'withdraw' | 'delete'

export function GoalsPage() {
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [name, setName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [currency, setCurrency] = useState<CurrencyCode>('COP')
  const [targetDate, setTargetDate] = useState('')
  const [formError, setFormError] = useState('')
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null)
  const [goalAction, setGoalAction] = useState<GoalAction | null>(null)
  const [actionAmount, setActionAmount] = useState('')
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    let isActive = true

    getGoals()
      .then((response) => {
        if (isActive) setGoals(response.data.filter(isSavingsGoal))
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

  const resetCreateForm = () => {
    setName('')
    setTargetAmount('')
    setCurrency('COP')
    setTargetDate('')
    setFormError('')
  }

  const closeCreateModal = () => {
    if (isSubmitting) return
    setIsCreateOpen(false)
    resetCreateForm()
  }

  const handleCreateGoal = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const numericTarget = Number(targetAmount)

    setFormError('')
    setPageError('')
    setSuccessMessage('')

    if (!name.trim()) {
      setFormError('Escribe un nombre para la meta.')
      return
    }

    if (!Number.isFinite(numericTarget) || numericTarget <= 0) {
      setFormError('El objetivo debe ser un monto mayor a cero.')
      return
    }

    if (!/^\d+(\.\d{1,2})?$/.test(targetAmount)) {
      setFormError('El objetivo puede tener máximo dos decimales.')
      return
    }

    setIsSubmitting(true)

    try {
      await createGoal({
        name: name.trim(),
        targetAmount: numericTarget,
        currency,
        targetDate: targetDate || null,
      })
      const goalsResponse = await getGoals()
      setGoals(goalsResponse.data.filter(isSavingsGoal))
      setSuccessMessage(`La meta “${name.trim()}” fue creada correctamente.`)
      setIsCreateOpen(false)
      resetCreateForm()
    } catch (error) {
      setFormError(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const openGoalAction = (goal: SavingsGoal, action: GoalAction) => {
    setSelectedGoal(goal)
    setGoalAction(action)
    setActionAmount('')
    setActionError('')
    setSuccessMessage('')
  }

  const closeGoalAction = () => {
    if (isSubmitting) return
    setSelectedGoal(null)
    setGoalAction(null)
    setActionAmount('')
    setActionError('')
  }

  const handleGoalAction = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedGoal || !goalAction) return

    setActionError('')
    setPageError('')
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      if (goalAction === 'delete') {
        const response = await deleteGoal(selectedGoal.id)
        setGoals((currentGoals) => currentGoals.filter((goal) => goal.id !== selectedGoal.id))
        setSuccessMessage(response.message)
      } else {
        const numericAmount = Number(actionAmount)

        if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
          setActionError('Ingresa un monto mayor a cero.')
          return
        }

        if (!/^\d+(\.\d{1,2})?$/.test(actionAmount)) {
          setActionError('El monto puede tener máximo dos decimales.')
          return
        }

        const response = goalAction === 'contribute'
          ? await contributeToGoal(selectedGoal.id, numericAmount)
          : await withdrawFromGoal(selectedGoal.id, numericAmount)

        setGoals((currentGoals) =>
          currentGoals.map((goal) =>
            goal.id === selectedGoal.id
              ? {
                  ...goal,
                  currentAmount: response.currentAmount,
                  progress: response.progress,
                  status: response.status,
                }
              : goal,
          ),
        )
        setSuccessMessage(
          goalAction === 'contribute'
            ? `Aportaste ${formatMoney(numericAmount, selectedGoal.currency)} a “${selectedGoal.name}”.`
            : `Retiraste ${formatMoney(numericAmount, selectedGoal.currency)} de “${selectedGoal.name}”.`,
        )
      }

      setSelectedGoal(null)
      setGoalAction(null)
      setActionAmount('')
      setActionError('')
    } catch (error) {
      setActionError(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

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
          <Button size="lg" trailingIcon={<PlusIcon />} onClick={() => setIsCreateOpen(true)}>
            Nueva meta
          </Button>
        </div>
      </header>

      {pageError ? <p className="goals-page__message is-error" role="alert">{pageError}</p> : null}
      {successMessage ? <p className="goals-page__message is-success" role="status">{successMessage}</p> : null}

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

              <div className="goals-card__actions">
                <Button
                  size="sm"
                  trailingIcon={<PlusIcon />}
                  onClick={() => openGoalAction(goal, 'contribute')}
                  disabled={goal.status === 'completed'}
                >
                  Aportar
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  trailingIcon={<LogoutIcon />}
                  onClick={() => openGoalAction(goal, 'withdraw')}
                  disabled={goal.currentAmount <= 0}
                >
                  Retirar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openGoalAction(goal, 'delete')}
                >
                  Eliminar
                </Button>
              </div>
            </Card>
          ))}
        </section>
      ) : null}

      {isCreateOpen ? (
        <div className="goals-modal__backdrop" onClick={closeCreateModal}>
          <section
            className="goals-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-goal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="goals-modal__heading">
              <span className="goals-page__state-icon" aria-hidden="true"><PlusIcon /></span>
              <div>
                <span>Nueva meta de ahorro</span>
                <h2 id="create-goal-title">Define tu próximo objetivo</h2>
              </div>
            </div>

            <form className="goals-modal__form" onSubmit={handleCreateGoal} noValidate>
              <TextField
                label="Nombre de la meta"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ej. Viaje a Europa"
                maxLength={80}
                required
              />
              <TextField
                label="Monto objetivo"
                value={targetAmount}
                onChange={(event) => setTargetAmount(event.target.value)}
                type="number"
                min="0.01"
                step="0.01"
                inputMode="decimal"
                placeholder="Ej. 3000"
                required
              />
              <SelectField
                label="Moneda"
                value={currency}
                onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
              >
                <option value="COP">COP - Peso colombiano</option>
                <option value="USD">USD - Dólar americano</option>
                <option value="EUR">EUR - Euro</option>
              </SelectField>
              <TextField
                label="Fecha límite"
                helperText="Opcional"
                value={targetDate}
                onChange={(event) => setTargetDate(event.target.value)}
                type="date"
              />

              {formError ? <p className="goals-page__message is-error" role="alert">{formError}</p> : null}

              <div className="goals-modal__actions">
                <Button variant="secondary" size="lg" onClick={closeCreateModal} disabled={isSubmitting}>
                  Cancelar
                </Button>
                <Button type="submit" size="lg" trailingIcon={<PlusIcon />} disabled={isSubmitting}>
                  {isSubmitting ? 'Creando meta...' : 'Crear meta'}
                </Button>
              </div>
            </form>
          </section>
        </div>
      ) : null}

      {selectedGoal && goalAction ? (
        <div className="goals-modal__backdrop" onClick={closeGoalAction}>
          <section
            className="goals-modal goals-modal--action"
            role="dialog"
            aria-modal="true"
            aria-labelledby="goal-action-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="goals-modal__heading">
              <span className="goals-page__state-icon" aria-hidden="true">
                {goalAction === 'contribute' ? <PlusIcon /> : <BankIcon />}
              </span>
              <div>
                <span>{goalAction === 'delete' ? 'Eliminar meta' : 'Actualizar progreso'}</span>
                <h2 id="goal-action-title">
                  {goalAction === 'contribute'
                    ? `Aportar a “${selectedGoal.name}”`
                    : goalAction === 'withdraw'
                      ? `Retirar de “${selectedGoal.name}”`
                      : `¿Eliminar “${selectedGoal.name}”?`}
                </h2>
              </div>
            </div>

            <form className="goals-modal__form" onSubmit={handleGoalAction} noValidate>
              {goalAction === 'delete' ? (
                <p>
                  Se eliminará permanentemente la meta y
                  {' '}
                  <strong>{formatMoney(selectedGoal.currentAmount, selectedGoal.currency)}</strong>
                  {' '}
                  volverán al saldo disponible de tu wallet.
                </p>
              ) : (
                <>
                  <div className="goals-modal__summary">
                    <span>Ahorro actual</span>
                    <strong>{formatMoney(selectedGoal.currentAmount, selectedGoal.currency)}</strong>
                    <span>Objetivo: {formatMoney(selectedGoal.targetAmount, selectedGoal.currency)}</span>
                  </div>
                  <TextField
                    label={goalAction === 'contribute' ? 'Monto a aportar' : 'Monto a retirar'}
                    value={actionAmount}
                    onChange={(event) => setActionAmount(event.target.value)}
                    type="number"
                    min="0.01"
                    step="0.01"
                    inputMode="decimal"
                    placeholder="Ej. 250"
                    required
                  />
                </>
              )}

              {actionError ? <p className="goals-page__message is-error" role="alert">{actionError}</p> : null}

              <div className="goals-modal__actions">
                <Button variant="secondary" size="lg" onClick={closeGoalAction} disabled={isSubmitting}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  trailingIcon={goalAction === 'contribute' ? <PlusIcon /> : undefined}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? 'Procesando...'
                    : goalAction === 'contribute'
                      ? 'Confirmar aporte'
                      : goalAction === 'withdraw'
                        ? 'Confirmar retiro'
                        : 'Eliminar meta'}
                </Button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </div>
  )
}
