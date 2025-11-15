import {
  describe,
  test,
  expect,
  vi,
  beforeEach,
  afterEach
} from 'vitest'
import edlLogin from '../handler'
import * as getConfig from '../../../../sharedUtils/getConfig'

const mockEdlConfig = {
  host: 'https://edl.example.com',
  redirectUriPath: '/callback'
}

const mockApplicationConfig = {
  apiHost: 'https://api.example.com'
}

const buildEvent = (queryStringParameters) => ({ queryStringParameters })

describe('edlLogin', () => {
  let getEdlConfigMock
  let getApplicationConfigMock

  beforeEach(() => {
    vi.resetAllMocks()
    process.env.EDL_CLIENT_ID = 'test-client-id'
    getEdlConfigMock = vi.spyOn(getConfig, 'getEdlConfig').mockResolvedValue(mockEdlConfig)
    getApplicationConfigMock = vi.spyOn(getConfig, 'getApplicationConfig').mockReturnValue(mockApplicationConfig)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when a target is provided', () => {
    test('should return a 307 redirect with an authorization URL', async () => {
      const result = await edlLogin(buildEvent({ target: '/dashboard' }))

      expect(result.statusCode).toBe(307)
      expect(result.headers.Location).toContain(`${mockEdlConfig.host}/oauth/authorize`)
      expect(result.headers.Location).toContain('client_id=test-client-id')
      expect(result.headers.Location).toContain(`redirect_uri=${encodeURIComponent(`${mockApplicationConfig.apiHost}${mockEdlConfig.redirectUriPath}`)}`)
      expect(result.headers.Location).toContain(`state=${encodeURIComponent(JSON.stringify({ target: '/dashboard' }))}`)
    })

    test('should include a response_type parameter', async () => {
      const result = await edlLogin(buildEvent({ target: '/dashboard' }))
      expect(result.headers.Location).toContain('response_type=code')
    })

    test('should encode complex targets inside the state parameter', async () => {
      const complexTarget = '/search?q=test&filter=active'
      const result = await edlLogin(buildEvent({ target: complexTarget }))

      expect(result.headers.Location).toContain('state=')
      expect(result.headers.Location).toContain(
        encodeURIComponent(JSON.stringify({ target: complexTarget }))
      )
    })
  })

  describe('when the target is missing', () => {
    test('should default to using \'/\' when queryStringParameters is missing', async () => {
      const result = await edlLogin({})

      expect(result.statusCode).toBe(307)
      expect(result.headers.Location).toContain(encodeURIComponent(JSON.stringify({ target: '/' })))
    })

    test('should default state to \'/\' when target key exists but value is missing', async () => {
      const result = await edlLogin(buildEvent({}))

      expect(result.headers.Location).toContain(encodeURIComponent(JSON.stringify({ target: '/' })))
    })
  })

  describe('when logging in', () => {
    test('should use values returned by getEdlConfig and getApplicationConfig', async () => {
      getEdlConfigMock.mockResolvedValueOnce({
        host: 'https://custom-edl.example.com',
        redirectUriPath: '/custom-callback'
      })

      getApplicationConfigMock.mockReturnValueOnce({
        apiHost: 'https://custom-api.example.com'
      })

      const result = await edlLogin(buildEvent({ target: '/dashboard' }))

      expect(result.headers.Location).toContain('https://custom-edl.example.com/oauth/authorize')
      expect(result.headers.Location).toContain('redirect_uri=https%3A%2F%2Fcustom-api.example.com%2Fcustom-callback')

      expect(getEdlConfigMock).toHaveBeenCalledTimes(1)
      expect(getApplicationConfigMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('when the client id is not configured', () => {
    test('should throw an error if EDL_CLIENT_ID is missing', async () => {
      delete process.env.EDL_CLIENT_ID

      await expect(edlLogin(buildEvent({ target: '/dashboard' }))).rejects.toThrow('EDL client ID is not configured')
    })
  })
})
