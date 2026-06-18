import { getPasswordStrength, validateEmail, validateRegister } from './authValidation'

const validRegisterValues = {
  fullName: 'Andres Arias',
  email: 'andres@example.com',
  password: 'Andres234.',
  confirmPassword: 'Andres234.',
  acceptTerms: true,
}

describe('auth validation', () => {
  it('accepts a valid email address', () => {
    expect(validateEmail(' user@example.com ')).toBeUndefined()
  })

  it('rejects an invalid email address', () => {
    expect(validateEmail('invalid-email')).toBe('Ingresa un correo electrónico válido.')
  })

  it('returns no register errors for valid values', () => {
    expect(validateRegister(validRegisterValues)).toEqual({})
  })

  it('validates required register rules', () => {
    expect(validateRegister({
      fullName: 'An',
      email: 'andres',
      password: 'weak',
      confirmPassword: 'different',
      acceptTerms: false,
    })).toEqual({
      fullName: 'El nombre debe tener al menos 3 caracteres.',
      email: 'Ingresa un correo electrónico válido.',
      password: 'La contraseña debe tener al menos 8 caracteres.',
      confirmPassword: 'Las contraseñas no coinciden.',
      acceptTerms: 'Debes aceptar los términos y la política de privacidad.',
    })
  })

  it('calculates password strength labels', () => {
    expect(getPasswordStrength('')).toEqual({ label: 'Esperando...', score: 0 })
    expect(getPasswordStrength('abcdef12')).toEqual({ label: 'Media', score: 3 })
    expect(getPasswordStrength('Andres234.')).toEqual({ label: 'Fuerte', score: 5 })
  })
})
