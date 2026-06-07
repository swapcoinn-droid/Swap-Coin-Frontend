export type RegisterValues = {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

export type RegisterErrors = Partial<Record<keyof RegisterValues, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: string) {
  return EMAIL_PATTERN.test(email.trim()) ? undefined : 'Ingresa un correo electrónico válido.'
}

export function validateRegister(values: RegisterValues): RegisterErrors {
  const errors: RegisterErrors = {}

  if (values.fullName.trim().length < 3) {
    errors.fullName = 'El nombre debe tener al menos 3 caracteres.'
  }

  errors.email = validateEmail(values.email)

  if (values.password.length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres.'
  } else if (!/[a-z]/.test(values.password)) {
    errors.password = 'Incluye al menos una letra minúscula.'
  } else if (!/[A-Z]/.test(values.password)) {
    errors.password = 'Incluye al menos una letra mayúscula.'
  } else if (!/\d/.test(values.password)) {
    errors.password = 'Incluye al menos un número.'
  } else if (!/[^A-Za-z0-9]/.test(values.password)) {
    errors.password = 'Incluye al menos un símbolo.'
  }

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Las contraseñas no coinciden.'
  }

  if (!values.acceptTerms) {
    errors.acceptTerms = 'Debes aceptar los términos y la política de privacidad.'
  }

  return Object.fromEntries(
    Object.entries(errors).filter(([, message]) => Boolean(message)),
  ) as RegisterErrors
}

export function getPasswordStrength(password: string) {
  if (!password) {
    return { label: 'Esperando...', score: 0 }
  }

  const score = [
    password.length >= 8,
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length

  if (score <= 2) return { label: 'Débil', score }
  if (score <= 4) return { label: 'Media', score }
  return { label: 'Fuerte', score }
}
