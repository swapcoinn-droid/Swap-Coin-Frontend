import { apiRequest } from '../api'

export type ApiUser = {
  id: string
  username: string
  email: string
  created_at?: string
}

type LoginResponse = {
  token: string
  user: ApiUser
}

export function registerUser(input: { fullName: string; email: string; password: string }) {
  return apiRequest<ApiUser>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      username: input.fullName.trim(),
      email: input.email.trim().toLowerCase(),
      password: input.password,
    }),
  })
}

export function loginUser(email: string, password: string) {
  return apiRequest<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      password,
    }),
  })
}
