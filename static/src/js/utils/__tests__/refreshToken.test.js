import refreshToken from '../refreshToken'

beforeEach(() => {
  global.fetch = vi.fn()
  delete window.location
  window.location = {}
})

vi.mock('../overrideStatic.config.json', () => ({}))

describe('refreshToken in production mode', () => {
  describe('when the request is successful', () => {
    test('calls setToken with refreshed token', async () => {
      global.fetch.mockResolvedValue(Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({ token: 'refreshed_token' })
      }))

      const setToken = vi.fn()

      await refreshToken({
        jwt: 'mock_token',
        setToken
      })

      expect(setToken).toHaveBeenCalledTimes(1)
      expect(setToken).toHaveBeenCalledWith('refreshed_token')

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:4001/dev/edl-refresh-token',
        {
          credentials: 'include',
          headers: {
            Authorization: 'Bearer mock_token'
          },
          method: 'POST'
        }
      )
    })
  })

  describe('when the response is missing a token', () => {
    test('treats it as a failed refresh and logs the user out', async () => {
      global.fetch.mockRejectedValue(Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({})
      }))

      const setToken = vi.fn()

      await refreshToken({
        jwt: 'mock_token',
        setToken
      })

      expect(setToken).toHaveBeenCalledTimes(1)
      expect(setToken).toHaveBeenCalledWith(null)

      expect(window.location.href).toEqual('/')
    })
  })

  describe('when the request errors', () => {
    test('calls setToken and navigate to log out the user', async () => {
      global.fetch.mockResolvedValue(Promise.resolve({
        ok: false,
        status: 500
      }))

      const setToken = vi.fn()

      await refreshToken({
        jwt: 'mock_token',
        setToken
      })

      expect(setToken).toHaveBeenCalledTimes(1)
      expect(setToken).toHaveBeenCalledWith(null)

      expect(window.location.href).toEqual('/')

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:4001/dev/edl-refresh-token',
        {
          credentials: 'include',
          headers: {
            Authorization: 'Bearer mock_token'
          },
          method: 'POST'
        }
      )
    })
  })

  describe('when the request throws an error', () => {
    test('calls setToken and navigate to log out the user', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'))

      const setToken = vi.fn()

      await refreshToken({
        jwt: 'mock_token',
        setToken
      })

      expect(setToken).toHaveBeenCalledTimes(1)
      expect(setToken).toHaveBeenCalledWith(null)

      expect(window.location.href).toEqual('/')

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:4001/dev/edl-refresh-token',
        {
          credentials: 'include',
          headers: {
            Authorization: 'Bearer mock_token'
          },
          method: 'POST'
        }
      )
    })
  })
})
