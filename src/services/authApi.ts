import { apiRequest } from '../api'

export type ApiUser = {
  id: string
  name: string | null
  email: string
  created_at?: string
}

type ApiUserResponse = Omit<ApiUser, 'name'> & {
  name?: string
  username?: string
}

type LoginResponse = {
  token: string
  user: ApiUserResponse
}

function normalizeUser(user: ApiUserResponse): ApiUser {
  return {
    id: user.id,
    name: user.name ?? user.username ?? null,
    email: user.email,
    created_at: user.created_at,
  }
}

export async function registerUser(input: { fullName: string; email: string; password: string }) {
  const name = input.fullName.trim()
  const user = await apiRequest<ApiUserResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name,
      username: name,
      email: input.email.trim().toLowerCase(),
      password: input.password,
    }),
  })

  return normalizeUser(user)
}

export async function loginUser(email: string, password: string) {
  const result = await apiRequest<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      password,
    }),
  })

  return {
    token: result.token,
    user: normalizeUser(result.user),
  }
}
