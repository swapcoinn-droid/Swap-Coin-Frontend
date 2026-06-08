import { useState, type ChangeEvent, type CSSProperties, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { CheckboxField, TextField } from '../../components/forms'
import {
  ArrowRightIcon,
  EyeIcon,
  LockIcon,
  MailIcon,
  UserIcon,
} from '../../components/icons/AuthIcons'
import { BrandMark } from '../../components/icons/BrandMark'
import { PublicFooter } from '../../components/public-layout/PublicFooter'
import { PublicNavbar } from '../../components/public-layout/PublicNavbar'
import { Button } from '../../components/ui/button/Button'
import { useAuth } from '../../hooks/useAuth'
import { routes } from '../../router/routes'
import {
  getPasswordStrength,
  validateEmail,
  validateRegister,
  type RegisterErrors,
  type RegisterValues,
} from '../../utils/authValidation'
import './register-page.css'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  })
  const [values, setValues] = useState<RegisterValues>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  })
  const [errors, setErrors] = useState<RegisterErrors>({})
  const [formError, setFormError] = useState('')
  const passwordStrength = getPasswordStrength(values.password)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = event.target
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setFormError('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const validationErrors = validateRegister(values)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const result = await register(values)

    if (!result.ok) {
      setFormError(result.message ?? 'No fue posible crear la cuenta.')
      return
    }

    navigate(routes.login, { replace: true, state: { registered: true } })
  }

  const handleEmailBlur = () => {
    setErrors((current) => ({ ...current, email: validateEmail(values.email) }))
  }

  const passwordToggle = (field: keyof typeof passwordVisibility, label: string) => (
    <button
      type="button"
      aria-label={`${passwordVisibility[field] ? 'Ocultar' : 'Mostrar'} ${label}`}
      aria-pressed={passwordVisibility[field]}
      onClick={() => setPasswordVisibility((current) => ({ ...current, [field]: !current[field] }))}
    >
      <EyeIcon />
    </button>
  )

  return (
    <main className="register-page">
      <PublicNavbar />

      <section className="register-page__content" aria-labelledby="register-title">
        <header className="register-brand">
          <Link className="register-brand__mark" to={routes.home} aria-label="Ir al inicio de Swap-Coin">
            <BrandMark />
          </Link>
          <Link to={routes.home}>Swap-Coin</Link>
          <p>Tu puente financiero hacia el mundo.</p>
        </header>

        <div className="register-card">
          <header className="register-card__header">
            <h1 id="register-title">Crea tu cuenta</h1>
            <p>Únete a miles de viajeros modernos hoy mismo.</p>
          </header>

          <form className="register-form" onSubmit={handleSubmit} noValidate>
            <TextField
              id="full-name"
              label="Nombre completo"
              name="fullName"
              autoComplete="name"
              placeholder="Ej. Juan Pérez"
              leadingIcon={<UserIcon />}
              value={values.fullName}
              errorText={errors.fullName}
              onChange={handleChange}
              required
            />
            <TextField
              id="register-email"
              label="Correo electrónico"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="nombre@ejemplo.com"
              leadingIcon={<MailIcon />}
              value={values.email}
              errorText={errors.email}
              onChange={handleChange}
              onBlur={handleEmailBlur}
              required
            />
            <div className="register-password">
              <TextField
                id="register-password"
                label="Contraseña"
                name="password"
                type={passwordVisibility.password ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Crea una contraseña"
                leadingIcon={<LockIcon />}
                trailingIcon={passwordToggle('password', 'contraseña')}
                value={values.password}
                errorText={errors.password}
                onChange={handleChange}
                required
              />
              <div className="register-password__strength" aria-label={`Seguridad de contraseña: ${passwordStrength.label}`}>
                <span>Seguridad: {passwordStrength.label}</span>
                <span className="register-password__track" style={{ '--strength': `${passwordStrength.score * 20}%` } as CSSProperties} />
              </div>
            </div>
            <TextField
              id="confirm-password"
              label="Confirmar contraseña"
              name="confirmPassword"
              type={passwordVisibility.confirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Repite tu contraseña"
              leadingIcon={<LockIcon />}
              trailingIcon={passwordToggle('confirmPassword', 'confirmación de contraseña')}
              value={values.confirmPassword}
              errorText={errors.confirmPassword}
              onChange={handleChange}
              required
            />

            <CheckboxField
              id="accept-terms"
              className="register-form__terms"
              name="acceptTerms"
              checked={values.acceptTerms}
              helperText={errors.acceptTerms}
              onChange={handleChange}
              label={
                <span>
                  Acepto los <a href="#terms">Términos de Servicio</a> y la{' '}
                  <a href="#privacy">Política de Privacidad</a> de Swap-Coin.
                </span>
              }
            />

            {formError ? <p className="register-form__error" role="alert">{formError}</p> : null}

            <Button className="register-form__submit" type="submit" size="lg" trailingIcon={<ArrowRightIcon />}>
              Crear cuenta
            </Button>
          </form>

          <footer className="register-card__footer">
            <span>¿Ya tienes una cuenta?</span>
            <Link to={routes.login}>Inicia sesión</Link>
          </footer>
        </div>
      </section>

      <PublicFooter />
    </main>
  )
}
