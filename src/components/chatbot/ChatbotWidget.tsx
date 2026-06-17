import { useEffect, useRef, useState, type FormEvent } from 'react'

import { ArrowRightIcon, ChatIcon } from '../icons/AuthIcons'
import { Button } from '../ui/button/Button'
import { sendChatMessage, type ChatHistoryItem } from '../../services/chatApi'
import './chatbot-widget.css'

type ChatMessage = ChatHistoryItem & {
  id: string
  status?: 'sending' | 'sent' | 'error'
}

const MESSAGE_LIMIT = 300

const suggestedMessages = [
  '¿Cómo cambio divisas?',
  '¿Cómo agrego saldo?',
  '¿Dónde veo mis transacciones?',
]

function createMessage(role: ChatHistoryItem['role'], text: string, status: ChatMessage['status'] = 'sent') {
  return {
    id: crypto.randomUUID(),
    role,
    text,
    status,
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'No fue posible enviar tu mensaje.'
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage(
      'model',
      'Hola, soy SwapBot. Puedo ayudarte con saldos, cambios de divisa, metas y movimientos.',
    ),
  ])
  const [history, setHistory] = useState<ChatHistoryItem[]>([])
  const [isSending, setIsSending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [isOpen, messages])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const sendMessage = async (text: string) => {
    const trimmedMessage = text.trim()

    if (!trimmedMessage || isSending) return

    const userMessage = createMessage('user', trimmedMessage, 'sending')

    setErrorMessage('')
    setMessage('')
    setIsSending(true)
    setMessages((currentMessages) => [...currentMessages, userMessage])

    try {
      const response = await sendChatMessage(trimmedMessage, history)
      const assistantMessage = createMessage('model', response.reply)

      setHistory(response.history)
      setMessages((currentMessages) => [
        ...currentMessages.map((currentMessage) =>
          currentMessage.id === userMessage.id
            ? { ...currentMessage, status: 'sent' as const }
            : currentMessage,
        ),
        assistantMessage,
      ])
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
      setMessages((currentMessages) =>
        currentMessages.map((currentMessage) =>
          currentMessage.id === userMessage.id
            ? { ...currentMessage, status: 'error' as const }
            : currentMessage,
        ),
      )
    } finally {
      setIsSending(false)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void sendMessage(message)
  }

  return (
    <div className="chatbot-widget">
      {isOpen ? (
        <section
          className="chatbot-widget__panel"
          aria-label="Chat de ayuda SwapBot"
        >
          <header className="chatbot-widget__header">
            <div>
              <span>Asistente virtual</span>
              <h2>SwapBot</h2>
            </div>
            <button
              className="chatbot-widget__close"
              type="button"
              aria-label="Cerrar chat"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </header>

          <div className="chatbot-widget__messages" aria-live="polite">
            {messages.map((chatMessage) => (
              <article
                className={[
                  'chatbot-widget__message',
                  `chatbot-widget__message--${chatMessage.role}`,
                  chatMessage.status === 'error' ? 'is-error' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                key={chatMessage.id}
              >
                <p>{chatMessage.text}</p>
                {chatMessage.status === 'sending' ? <span>Enviando...</span> : null}
                {chatMessage.status === 'error' ? <span>No se pudo enviar</span> : null}
              </article>
            ))}
            {isSending ? (
              <div className="chatbot-widget__typing" aria-label="SwapBot está respondiendo">
                <span />
                <span />
                <span />
              </div>
            ) : null}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-widget__suggestions" aria-label="Preguntas sugeridas">
            {suggestedMessages.map((suggestedMessage) => (
              <button
                key={suggestedMessage}
                type="button"
                onClick={() => void sendMessage(suggestedMessage)}
                disabled={isSending}
              >
                {suggestedMessage}
              </button>
            ))}
          </div>

          {errorMessage ? (
            <p className="chatbot-widget__error" role="alert">
              {errorMessage}
            </p>
          ) : null}

          <form className="chatbot-widget__form" onSubmit={handleSubmit}>
            <label htmlFor="swapbot-message">Mensaje para SwapBot</label>
            <div className="chatbot-widget__composer">
              <textarea
                id="swapbot-message"
                maxLength={MESSAGE_LIMIT}
                placeholder="Escribe tu pregunta..."
                rows={2}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    void sendMessage(message)
                  }
                }}
                disabled={isSending}
              />
              <Button
                className="chatbot-widget__send"
                type="submit"
                size="sm"
                aria-label="Enviar mensaje"
                disabled={!message.trim() || isSending}
              >
                <ArrowRightIcon />
              </Button>
            </div>
            <span>{message.length}/{MESSAGE_LIMIT}</span>
          </form>
        </section>
      ) : null}

      <button
        className="chatbot-widget__trigger"
        type="button"
        aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        <ChatIcon />
        <span>{isOpen ? 'Cerrar chat' : 'Abrir chat'}</span>
      </button>
    </div>
  )
}
