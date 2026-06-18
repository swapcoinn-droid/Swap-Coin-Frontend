import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { routes } from '../../router/routes'
import { pageRoute, renderWithAuth } from '../../test/renderWithAuth'
import { RegisterPage } from './RegisterPage'

function renderRegister(auth = {}) {
  return renderWithAuth(<RegisterPage />, {
    auth,
    initialEntries: [routes.register],
    routes: (
      <>
        {pageRoute(routes.register, <RegisterPage />)}
        {pageRoute(routes.login, <h1>Login listo</h1>)}
      </>
    ),
  })
}

describe('RegisterPage', () => {
  it('shows validation errors and avoids submit with invalid values', async () => {
    const user = userEvent.setup()
    const register = vi.fn().mockResolvedValue({ ok: true })

    renderRegister({ register })

    await user.type(screen.getByLabelText(/nombre completo/i), 'An')
    await user.type(screen.getByLabelText(/correo/i), 'correo')
    await user.type(screen.getByLabelText(/^contraseña$/i), 'weak')
    await user.type(screen.getByLabelText(/confirmar contraseña/i), 'different')
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }))

    expect(screen.getByText('El nombre debe tener al menos 3 caracteres.')).toBeInTheDocument()
    expect(screen.getByText('Ingresa un correo electrónico válido.')).toBeInTheDocument()
    expect(screen.getByText('La contraseña debe tener al menos 8 caracteres.')).toBeInTheDocument()
    expect(screen.getByText('Las contraseñas no coinciden.')).toBeInTheDocument()
    expect(screen.getByText('Debes aceptar los términos y la política de privacidad.')).toBeInTheDocument()
    expect(register).not.toHaveBeenCalled()
  })

  it('toggles both password inputs independently', async () => {
    const user = userEvent.setup()

    renderRegister()

    const passwordInput = screen.getByLabelText(/^contraseña$/i)
    const confirmInput = screen.getByLabelText(/confirmar contraseña/i)

    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(confirmInput).toHaveAttribute('type', 'password')

    await user.click(screen.getByRole('button', { name: /mostrar contraseña/i }))
    expect(passwordInput).toHaveAttribute('type', 'text')
    expect(confirmInput).toHaveAttribute('type', 'password')

    await user.click(screen.getByRole('button', { name: /mostrar confirmación de contraseña/i }))
    expect(passwordInput).toHaveAttribute('type', 'text')
    expect(confirmInput).toHaveAttribute('type', 'text')
  })

  it('submits valid values and navigates to login', async () => {
    const user = userEvent.setup()
    const register = vi.fn().mockResolvedValue({ ok: true })

    renderRegister({ register })

    await user.type(screen.getByLabelText(/nombre completo/i), 'Andres Arias')
    await user.type(screen.getByLabelText(/correo/i), 'andres@example.com')
    await user.type(screen.getByLabelText(/^contraseña$/i), 'Andres234.')
    await user.type(screen.getByLabelText(/confirmar contraseña/i), 'Andres234.')
    await user.click(screen.getByLabelText(/acepto/i))
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }))

    expect(register).toHaveBeenCalledWith({
      fullName: 'Andres Arias',
      email: 'andres@example.com',
      password: 'Andres234.',
      confirmPassword: 'Andres234.',
      acceptTerms: true,
    })
    expect(await screen.findByRole('heading', { name: /login listo/i })).toBeInTheDocument()
  })

  it('shows API errors returned by auth context', async () => {
    const user = userEvent.setup()
    const register = vi.fn().mockResolvedValue({ ok: false, message: 'El correo ya existe' })

    renderRegister({ register })

    await user.type(screen.getByLabelText(/nombre completo/i), 'Andres Arias')
    await user.type(screen.getByLabelText(/correo/i), 'andres@example.com')
    await user.type(screen.getByLabelText(/^contraseña$/i), 'Andres234.')
    await user.type(screen.getByLabelText(/confirmar contraseña/i), 'Andres234.')
    await user.click(screen.getByLabelText(/acepto/i))
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('El correo ya existe')
  })
})
