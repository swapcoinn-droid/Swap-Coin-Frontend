import { render, screen } from '@testing-library/react'

import { TextField } from './TextField'

describe('TextField', () => {
  it('connects helper text to the input description', () => {
    render(<TextField label="Correo electrónico" helperText="Usa un correo válido." />)

    expect(screen.getByLabelText(/correo/i)).toHaveAccessibleDescription('Usa un correo válido.')
  })

  it('marks the input as invalid when an error is present', () => {
    render(<TextField label="Correo electrónico" errorText="El formato del correo no es válido." />)

    const input = screen.getByLabelText(/correo/i)

    expect(input).toBeInvalid()
    expect(input).toHaveAccessibleDescription('El formato del correo no es válido.')
  })
})
