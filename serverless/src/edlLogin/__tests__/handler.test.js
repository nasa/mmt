import {
  describe,
  test,
  expect,
  vi,
  beforeEach
} from 'vitest'
import edlLogin from '../handler'
import { getApplicationConfig, getEdlConfig } from '../../../../sharedUtils/getConfig'

vi.mock('../../../../sharedUtils/getConfig')

describe('when logging in', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    process.env.EDL_CLIENT_ID = 'test-client-id'
  })

  test('should return a 307 redirect with correct location', async () => {
    getEdlConfig.mockResolvedValue({
      host: 'https://edl.example.com',
      redirectUriPath: '/callback'
    })

    getApplicationConfig.mockReturnValue({
      apiHost: 'https://api.example.com'
    })

    const event = { queryStringParameters: { target: '/dashboard' } }
    const result = await edlLogin(event)

    expect(result.statusCode).toBe(307)
    expect(result.headers.Location).toContain('https://edl.example.com/oauth/authorize')
    expect(result.headers.Location).toContain('client_id=test-client-id')
    expect(result.headers.Location).toContain('redirect_uri=https%3A%2F%2Fapi.example.com%2Fcallback')
    expect(result.headers.Location).toContain('state=')
    expect(result.headers.Location).toContain(encodeURIComponent('/dashboard'))
  })

  test('should use an empty object for queryStringParameters if not provided', async () => {
    getEdlConfig.mockResolvedValue({
      host: 'https://edl.example.com',
      redirectUriPath: '/callback'
    })

    getApplicationConfig.mockReturnValue({
      apiHost: 'https://api.example.com'
    })

    const event = {}
    const result = await edlLogin(event)

    expect(result.statusCode).toBe(307)
    expect(result.headers.Location).toContain('state=')
    expect(result.headers.Location).toContain(encodeURIComponent('{}'))
  })

  test('should throw an error if EDL_CLIENT_ID is not set', async () => {
    delete process.env.EDL_CLIENT_ID

    getEdlConfig.mockResolvedValue({
      host: 'https://edl.example.com',
      redirectUriPath: '/callback'
    })

    getApplicationConfig.mockReturnValue({
      apiHost: 'https://api.example.com'
    })

    await expect(edlLogin({})).rejects.toThrow('EDL client ID is not configured')
  })

  test('should correctly encode the state parameter', async () => {
    getEdlConfig.mockResolvedValue({
      host: 'https://edl.example.com',
      redirectUriPath: '/callback'
    })

    getApplicationConfig.mockReturnValue({
      apiHost: 'https://api.example.com'
    })

    const event = { queryStringParameters: { target: '/page with spaces' } }
    const result = await edlLogin(event)

    expect(result.headers.Location).toContain('state=')
    expect(result.headers.Location).toContain(encodeURIComponent(JSON.stringify({ target: '/page with spaces' })))
  })

  test('should use values from getEdlConfig and getApplicationConfig', async () => {
    getEdlConfig.mockResolvedValue({
      host: 'https://custom-edl.example.com',
      redirectUriPath: '/custom-callback'
    })

    getApplicationConfig.mockReturnValue({
      apiHost: 'https://custom-api.example.com'
    })

    const event = { queryStringParameters: { target: '/dashboard' } }
    const result = await edlLogin(event)

    expect(result.headers.Location).toContain('https://custom-edl.example.com/oauth/authorize')
    expect(result.headers.Location).toContain('redirect_uri=https%3A%2F%2Fcustom-api.example.com%2Fcustom-callback')
  })

  test('should handle missing target in queryStringParameters', async () => {
    getEdlConfig.mockResolvedValue({
      host: 'https://edl.example.com',
      redirectUriPath: '/callback'
    })

    getApplicationConfig.mockReturnValue({
      apiHost: 'https://api.example.com'
    })

    const event = { queryStringParameters: {} }
    const result = await edlLogin(event)

    expect(result.statusCode).toBe(307)
    expect(result.headers.Location).toContain('state=')
    expect(result.headers.Location).toContain(encodeURIComponent(JSON.stringify({ target: undefined })))
  })

  test('should include response_type=code in the redirect URL', async () => {
    getEdlConfig.mockResolvedValue({
      host: 'https://edl.example.com',
      redirectUriPath: '/callback'
    })

    getApplicationConfig.mockReturnValue({
      apiHost: 'https://api.example.com'
    })

    const event = { queryStringParameters: { target: '/dashboard' } }
    const result = await edlLogin(event)

    expect(result.headers.Location).toContain('response_type=code')
  })

  test('should handle special characters in the target URL', async () => {
    getEdlConfig.mockResolvedValue({
      host: 'https://edl.example.com',
      redirectUriPath: '/callback'
    })

    getApplicationConfig.mockReturnValue({
      apiHost: 'https://api.example.com'
    })

    const event = { queryStringParameters: { target: '/search?q=test&filter=active' } }
    const result = await edlLogin(event)

    expect(result.headers.Location).toContain('state=')
    expect(result.headers.Location).toContain(encodeURIComponent(JSON.stringify({ target: '/search?q=test&filter=active' })))
  })

  test('should call getEdlConfig and getApplicationConfig exactly once', async () => {
    getEdlConfig.mockResolvedValue({
      host: 'https://edl.example.com',
      redirectUriPath: '/callback'
    })

    getApplicationConfig.mockReturnValue({
      apiHost: 'https://api.example.com'
    })

    const event = { queryStringParameters: { target: '/dashboard' } }
    await edlLogin(event)

    expect(getEdlConfig).toHaveBeenCalledTimes(1)
    expect(getApplicationConfig).toHaveBeenCalledTimes(1)
  })
})
