import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ScrollToTopButton } from './ScrollToTopButton'

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    value,
  })
}

describe('ScrollToTopButton', () => {
  beforeEach(() => {
    setScrollY(0)
    vi.stubGlobal('scrollTo', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('becomes visible after the user scrolls down', () => {
    render(<ScrollToTopButton />)

    const button = screen.getByRole('button', { name: /volver arriba/i })

    expect(button).not.toHaveClass('is-visible')

    setScrollY(400)
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })

    expect(button).toHaveClass('is-visible')
  })

  it('scrolls smoothly to the top when clicked', async () => {
    const user = userEvent.setup()

    render(<ScrollToTopButton />)

    setScrollY(400)
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })

    await user.click(screen.getByRole('button', { name: /volver arriba/i }))

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'smooth' })
  })
})
