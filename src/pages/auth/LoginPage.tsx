import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { CheckboxField, TextField } from '../../components/forms'
import {
  ArrowRightIcon,
  EyeIcon,
  LockIcon,
  MailIcon,
  MessageIcon,
} from '../../components/icons/AuthIcons'
import { BrandMark } from '../../components/icons/BrandMark'
import { Button } from '../../components/ui/button/Button'
import { routes } from '../../router/routes'
import './login-page.css'

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <main className="login-page">
      <section className="login-page__content" aria-labelledby="login-title">
        <Link className="login-brand" to={routes.home} aria-label="Ir al inicio de Swap-Coin">
          <span className="login-brand__mark">
            <BrandMark />
          </span>
          <span>Swap-Coin</span>
        </Link>

        <div className="login-card">
          <header className="login-card__header">
            <h1 id="login-title">Bienvenido de nuevo</h1>
            <p>Accede a tu billetera global del nomadismo digital.</p>
          </header>

          <form className="login-form" onSubmit={handleSubmit}>
            <TextField
              id="email"
              label="Correo electrónico"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="nombre@ejemplo.com"
              leadingIcon={<MailIcon />}
              required
            />

            <div className="login-form__password">
              <Link to={routes.login}>¿Olvidaste tu contraseña?</Link>
              <TextField
                id="password"
                label="Contraseña"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Ingresa tu contraseña"
                leadingIcon={<LockIcon />}
                trailingIcon={
                  <button
                    type="button"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((isVisible) => !isVisible)}
                  >
                    <EyeIcon />
                  </button>
                }
                required
              />
            </div>

            <CheckboxField label="Mantener sesión iniciada" name="remember" />

            <Button className="login-form__submit" type="submit" size="lg" trailingIcon={<ArrowRightIcon />}>
              Iniciar sesión
            </Button>
          </form>

          <footer className="login-card__footer">
            <span>¿No tienes cuenta?</span>
            <Link to={routes.register}>Crear cuenta</Link>
          </footer>
        </div>
      </section>

      <aside className="login-visual" aria-hidden="true">
        <div className="login-visual__orbit login-visual__orbit--outer" />
        <div className="login-visual__orbit login-visual__orbit--inner" />
        <div className="login-visual__platform login-visual__platform--back" />
        <div className="login-visual__platform login-visual__platform--front" />
        <div className="login-visual__coin">
          <BrandMark />
        </div>
      </aside>

      <button className="login-chat" type="button" aria-label="Abrir chat de ayuda">
        <MessageIcon />
      </button>
    </main>
  )
}
