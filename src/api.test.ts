import { ApiError, apiRequest } from './api'

function mockJsonResponse(body: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    json: vi.fn().mockResolvedValue(body),
  } as unknown as Response
}

describe('apiRequest', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('adds json headers and returns the response body', async () => {
    vi.mocked(fetch).mockResolvedValue(mockJsonResponse({ ok: true }))

    await expect(apiRequest('/api/health')).resolves.toEqual({ ok: true })

    expect(fetch).toHaveBeenCalledWith('/api/health', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  })

  it('preserves custom headers and request options', async () => {
    vi.mocked(fetch).mockResolvedValue(mockJsonResponse({ created: true }))

    await apiRequest('/api/test', {
      method: 'POST',
      headers: { Authorization: 'Bearer token' },
      body: JSON.stringify({ value: 1 }),
    })

    expect(fetch).toHaveBeenCalledWith('/api/test', {
      method: 'POST',
      body: JSON.stringify({ value: 1 }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token',
      },
    })
  })

  it('throws ApiError with backend message', async () => {
    vi.mocked(fetch).mockResolvedValue(mockJsonResponse({ message: 'No autorizado' }, false, 401))

    await expect(apiRequest('/api/private')).rejects.toMatchObject({
      name: 'ApiError',
      message: 'No autorizado',
      status: 401,
    } satisfies Partial<ApiError>)
  })
})
