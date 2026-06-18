import { apiRequest } from '../api'
import { sendChatMessage } from './chatApi'
import { clearAuthSession, saveAuthSession } from './authSession'

vi.mock('../api', () => ({
  apiRequest: vi.fn(),
}))

describe('chat API service', () => {
  beforeEach(() => {
    clearAuthSession()
    vi.clearAllMocks()
  })

  it('requires an auth token', () => {
    expect(() => sendChatMessage('Hola')).toThrow('Debes iniciar sesión para usar el asistente.')
    expect(apiRequest).not.toHaveBeenCalled()
  })

  it('sends chat messages with history and auth header', () => {
    saveAuthSession('chat-token', {
      id: 'user-1',
      name: 'Andres Arias',
      email: 'andres@example.com',
    }, true)

    sendChatMessage('Hola', [{ role: 'user', text: 'Mensaje previo' }])

    expect(apiRequest).toHaveBeenCalledWith('/api/chat', {
      method: 'POST',
      headers: { Authorization: 'Bearer chat-token' },
      body: JSON.stringify({
        message: 'Hola',
        history: [{ role: 'user', text: 'Mensaje previo' }],
      }),
    })
  })
})
