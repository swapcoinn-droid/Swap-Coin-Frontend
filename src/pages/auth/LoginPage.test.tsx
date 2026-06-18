import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { routes } from '../../router/routes'
import { pageRoute, renderWithAuth } from '../../test/renderWithAuth'
import { LoginPage } from './LoginPage'

function renderLogin(auth = {}) {
  return renderWithAuth(<LoginPage />, {
    auth,
    initialEntries: [routes.login],
    routes: (
      <>
        {pageRoute(routes.login, <LoginPage />)}
        {pageRoute(routes.dashboard, <h1>Dashboard listo</h1>)}
      </>
    ),
  })
}

describe('LoginPage', () => {
  it('shows an inline email error and avoids submit with invalid email', async () => {
    const user = userEvent.setup()
    const login = vi.fn().mockResolvedValue({ ok: true })

    renderLogin({ login })

    await user.type(screen.getByLabelText(/correo/i), 'correo-invalido')
    await user.type(screen.getByLabelText(/contraseña/i, { selector: 'input' }), 'Andres234.')
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    expect(screen.getByText('Ingresa un correo electrónico válido.')).toBeInTheDocument()
    expect(login).not.toHaveBeenCalled()
  })

  it('toggles password visibility', async () => {
    const user = userEvent.setup()

    renderLogin()

    const passwordInput = screen.getByLabelText(/contraseña/i, { selector: 'input' })

    expect(passwordInput).toHaveAttribute('type', 'password')

    await user.click(screen.getByRole('button', { name: /mostrar contraseña/i }))

    expect(passwordInput).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: /ocultar contraseña/i })).toBeInTheDocument()
  })

  it('submits credentials and navigates to dashboard on success', async () => {
    const user = userEvent.setup()
    const login = vi.fn().mockResolvedValue({ ok: true })

    renderLogin({ login })

    await user.type(screen.getByLabelText(/correo/i), 'Andres@Example.COM')
    await user.type(screen.getByLabelText(/contraseña/i, { selector: 'input' }), 'Andres234.')
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    expect(login).toHaveBeenCalledWith('Andres@Example.COM', 'Andres234.', false)
    expect(await screen.findByRole('heading', { name: /dashboard listo/i })).toBeInTheDocument()
  })

  it('shows API errors returned by auth context', async () => {
    const user = userEvent.setup()
    const login = vi.fn().mockResolvedValue({ ok: false, message: 'Credenciales inválidas' })

    renderLogin({ login })

    await user.type(screen.getByLabelText(/correo/i), 'andres@example.com')
    await user.type(screen.getByLabelText(/contraseña/i, { selector: 'input' }), 'Andres234.')
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Credenciales inválidas')
  })
})
