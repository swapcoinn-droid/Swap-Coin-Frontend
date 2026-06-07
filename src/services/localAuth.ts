const USERS_KEY = 'swap-coin-users'
export const AUTH_TOKEN_KEY = 'swap-coin-access-token'

export type LocalUser = {
  id: string
  fullName: string
  email: string
  passwordHash: string
}

export type PublicUser = Omit<LocalUser, 'passwordHash'>

export type LocalSessionUser = {
  userId: string
  email: string
}

type AuthResult =
  | { ok: true; user: PublicUser }
  | { ok: false; message: string }

function readUsers(): LocalUser[] {
  try {
    const storedUsers = localStorage.getItem(USERS_KEY)
    return storedUsers ? (JSON.parse(storedUsers) as LocalUser[]) : []
  } catch {
    return []
  }
}

function writeUsers(users: LocalUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

async function hashPassword(password: string) {
  const data = new TextEncoder().encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)

  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

function toPublicUser(user: LocalUser): PublicUser {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
  }
}

export async function registerLocalUser(input: {
  fullName: string
  email: string
  password: string
}): Promise<AuthResult> {
  const users = readUsers()
  const email = input.email.trim().toLowerCase()

  if (users.some((user) => user.email === email)) {
    return { ok: false, message: 'Ya existe una cuenta con este correo electrónico.' }
  }

  const user: LocalUser = {
    id: crypto.randomUUID(),
    fullName: input.fullName.trim(),
    email,
    passwordHash: await hashPassword(input.password),
  }

  writeUsers([...users, user])

  return { ok: true, user: toPublicUser(user) }
}

export async function loginLocalUser(emailInput: string, password: string): Promise<AuthResult> {
  const email = emailInput.trim().toLowerCase()
  const passwordHash = await hashPassword(password)
  const user = readUsers().find(
    (candidate) => candidate.email === email && candidate.passwordHash === passwordHash,
  )

  return user
    ? { ok: true, user: toPublicUser(user) }
    : { ok: false, message: 'El correo o la contraseña son incorrectos.' }
}

export function createLocalSession(user: PublicUser, persistent: boolean) {
  const token = btoa(JSON.stringify({ userId: user.id, email: user.email }))
  const storage = persistent ? localStorage : sessionStorage

  localStorage.removeItem(AUTH_TOKEN_KEY)
  sessionStorage.removeItem(AUTH_TOKEN_KEY)
  storage.setItem(AUTH_TOKEN_KEY, token)
}

export function getLocalSessionUser(): LocalSessionUser | null {
  const token = localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY)

  if (!token) {
    return null
  }

  try {
    const decoded = JSON.parse(atob(token)) as LocalSessionUser

    return typeof decoded?.email === 'string' && typeof decoded?.userId === 'string'
      ? decoded
      : null
  } catch {
    return null
  }
}

export function hasLocalSession() {
  return Boolean(localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY))
}

export function clearLocalSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  sessionStorage.removeItem(AUTH_TOKEN_KEY)
}
