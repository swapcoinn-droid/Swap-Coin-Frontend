import { apiRequest } from '../api'
import { getAuthToken } from './authSession'

export type ChatRole = 'user' | 'model'

export type ChatHistoryItem = {
  role: ChatRole
  text: string
}

export type ChatResponse = {
  reply: string
  history: ChatHistoryItem[]
}

function getAuthHeaders() {
  const token = getAuthToken()

  if (!token) {
    throw new Error('Debes iniciar sesión para usar el asistente.')
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}

export function sendChatMessage(message: string, history: ChatHistoryItem[] = []) {
  return apiRequest<ChatResponse>('/api/chat', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ message, history }),
  })
}
