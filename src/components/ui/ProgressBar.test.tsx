import { render, screen } from '@testing-library/react'

import { ProgressBar } from './ProgressBar'

function getFill() {
  const fill = document.querySelector('.sc-progress__fill')

  if (!fill) {
    throw new Error('Progress fill was not rendered')
  }

  return fill as HTMLElement
}

describe('ProgressBar', () => {
  it('renders the optional label and clamps progress to the maximum', () => {
    render(<ProgressBar value={150} max={100} tone="success" label="Progreso de meta" />)

    expect(screen.getByText('Progreso de meta')).toBeInTheDocument()
    expect(getFill()).toHaveStyle({ width: '100%' })
    expect(getFill()).toHaveClass('sc-progress__fill--success')
  })

  it('clamps negative progress to zero', () => {
    render(<ProgressBar value={-10} />)

    expect(getFill()).toHaveStyle({ width: '0%' })
  })
})
