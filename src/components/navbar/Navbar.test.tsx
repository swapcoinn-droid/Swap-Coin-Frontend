import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import { Navbar } from './Navbar'

function renderNavbar(onLogout = vi.fn()) {
  render(
    <MemoryRouter initialEntries={['/app/metas']}>
      <Navbar
        brand="Swap-Coin"
        brandTo="/app/dashboard"
        links={[
          { label: 'Inicio', to: '/app/dashboard' },
          { label: 'Metas de ahorro', to: '/app/metas' },
        ]}
        actions={[{ label: 'Cerrar Sesión', onClick: onLogout }]}
      />
    </MemoryRouter>,
  )

  return { onLogout }
}

describe('Navbar', () => {
  it('opens and closes the responsive navigation menu', async () => {
    const user = userEvent.setup()

    renderNavbar()

    const toggle = screen.getByRole('button', { name: /abrir/i })
    const menu = document.getElementById('app-navigation')

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(menu).not.toHaveClass('is-open')

    await user.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(menu).toHaveClass('is-open')

    await user.click(screen.getByRole('link', { name: 'Inicio' }))

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(menu).not.toHaveClass('is-open')
  })

  it('runs action callbacks from the menu', async () => {
    const user = userEvent.setup()
    const onLogout = vi.fn()

    renderNavbar(onLogout)

    await user.click(screen.getByRole('button', { name: /abrir/i }))
    await user.click(screen.getByRole('button', { name: /cerrar sesi/i }))

    expect(onLogout).toHaveBeenCalledTimes(1)
  })
})
