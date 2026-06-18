import { apiRequest } from '../api'
import { loginUser, registerUser } from './authApi'

vi.mock('../api', () => ({
  apiRequest: vi.fn(),
}))

describe('auth API service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('registers users with trimmed name and normalized email', async () => {
    vi.mocked(apiRequest).mockResolvedValue({
      id: 'user-1',
      name: 'Andres Arias',
      email: 'andres@example.com',
    })

    await expect(registerUser({
      fullName: '  Andres Arias  ',
      email: ' Andres@Example.COM ',
      password: 'Andres234.',
    })).resolves.toEqual({
      id: 'user-1',
      name: 'Andres Arias',
      email: 'andres@example.com',
      created_at: undefined,
    })

    expect(apiRequest).toHaveBeenCalledWith('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Andres Arias',
        username: 'Andres Arias',
        email: 'andres@example.com',
        password: 'Andres234.',
      }),
    })
  })

  it('logs in users and normalizes legacy username responses', async () => {
    vi.mocked(apiRequest).mockResolvedValue({
      token: 'token-123',
      user: {
        id: 'user-2',
        username: 'Legacy Name',
        email: 'legacy@example.com',
      },
    })

    await expect(loginUser(' Legacy@Example.COM ', 'Secret123.')).resolves.toEqual({
      token: 'token-123',
      user: {
        id: 'user-2',
        name: 'Legacy Name',
        email: 'legacy@example.com',
        created_at: undefined,
      },
    })

    expect(apiRequest).toHaveBeenCalledWith('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'legacy@example.com',
        password: 'Secret123.',
      }),
    })
  })
})
