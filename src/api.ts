export const API_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL ?? '')

type ApiErrorBody = {
  error?: string
  message?: string
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const body = (await response.json().catch(() => ({}))) as T & ApiErrorBody

  if (!response.ok) {
    throw new ApiError(
      body.error ?? body.message ?? 'No fue posible conectar con la API.',
      response.status,
    )
  }

  return body
}
