import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { CheckboxField, TextField } from '../../components/forms'
import {
  ArrowRightIcon,
  EyeIcon,
  LockIcon,
  MailIcon,
  MessageIcon,
  UserIcon,
} from '../../components/icons/AuthIcons'
import { BrandMark } from '../../components/icons/BrandMark'
import { Button } from '../../components/ui/button/Button'
import { routes } from '../../router/routes'
import './register-page.css'

type PasswordField = 'password' | 'confirmPassword'

export function RegisterPage() {
  const [visiblePassword, setVisiblePassword] = useState<PasswordField | null>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  const passwordToggle = (field: PasswordField, label: string) => (
    <button
      type="button"
      aria-label={`${visiblePassword === field ? 'Ocultar' : 'Mostrar'} ${label}`}
      aria-pressed={visiblePassword === field}
      onClick={() => setVisiblePassword((current) => (current === field ? null : field))}
    >
      <EyeIcon />
    </button>
  )

  return (
    <main className="register-page">
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

          <form className="register-form" onSubmit={handleSubmit}>
            <TextField
              id="full-name"
              label="Nombre completo"
              name="fullName"
              autoComplete="name"
              placeholder="Ej. Juan Pérez"
              leadingIcon={<UserIcon />}
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
              required
            />
            <div className="register-password">
              <TextField
                id="register-password"
                label="Contraseña"
                name="password"
                type={visiblePassword === 'password' ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Crea una contraseña"
                leadingIcon={<LockIcon />}
                trailingIcon={passwordToggle('password', 'contraseña')}
                required
              />
              <div className="register-password__strength" aria-label="Seguridad de contraseña pendiente">
                <span>Seguridad: Esperando...</span>
                <span className="register-password__track" />
              </div>
            </div>
            <TextField
              id="confirm-password"
              label="Confirmar contraseña"
              name="confirmPassword"
              type={visiblePassword === 'confirmPassword' ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Repite tu contraseña"
              leadingIcon={<LockIcon />}
              trailingIcon={passwordToggle('confirmPassword', 'confirmación de contraseña')}
              required
            />

            <CheckboxField
              id="accept-terms"
              className="register-form__terms"
              name="acceptTerms"
              label={
                <span>
                  Acepto los <a href="#terms">Términos de Servicio</a> y la{' '}
                  <a href="#privacy">Política de Privacidad</a> de Swap-Coin.
                </span>
              }
              required
            />

            <Button className="register-form__submit" type="submit" size="lg" trailingIcon={<ArrowRightIcon />}>
              Crear cuenta
            </Button>
          </form>

          <div className="register-divider">
            <span>O REGISTRARSE CON</span>
          </div>

          <Button className="register-google" variant="secondary" size="lg" leadingIcon={<span>G</span>}>
            Google
          </Button>

          <footer className="register-card__footer">
            <span>¿Ya tienes una cuenta?</span>
            <Link to={routes.login}>Inicia sesión</Link>
          </footer>
        </div>
      </section>

      <button className="register-chat" type="button" aria-label="Abrir chat de ayuda">
        <MessageIcon />
      </button>
    </main>
  )
}
