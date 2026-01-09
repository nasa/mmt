import refreshToken from '../refreshToken'

beforeEach(() => {
  global.fetch = vi.fn()
  delete window.location
  window.location = {}
})

describe('refreshToken in production mode', () => {
  describe('when the request is successful', () => {
    test('does not call setToken or navigate', async () => {
      global.fetch.mockResolvedValue(Promise.resolve({
        ok: true,
        status: 200
      }))

      const setToken = vi.fn()

      await refreshToken({
        jwt: 'mock_token',
        setToken
      })

      expect(setToken).toHaveBeenCalledTimes(0)

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
