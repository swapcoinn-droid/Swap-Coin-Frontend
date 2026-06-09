import { ApiError, apiRequest } from '../api'

export type ApiUser = {
  id: string
  name: string
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
  const name = user.name ?? user.username

  if (!name) {
    throw new ApiError('La API no devolvió el nombre del usuario.', 502)
  }

  return {
    id: user.id,
    name,
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
