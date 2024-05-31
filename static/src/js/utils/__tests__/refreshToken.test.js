import refreshToken from '../refreshToken'

beforeEach(() => {
  delete window.location
  window.location = {}
})

describe('refreshToken in production mode', () => {
  describe('when the request is successfull', () => {
    test('does not call setToken or navigate', async () => {
      global.fetch.mockResolvedValue(Promise.resolve({
        ok: true,
        status: 200
      }))

      const setToken = vi.fn()
      const navigate = vi.fn()

      await refreshToken({
        jwt: 'mock_token',
        setToken,
        navigate
      })

      expect(setToken).toHaveBeenCalledTimes(0)

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:4001/dev/saml-refresh-token',
        {
          credentials: 'include',
          headers: {
            Authorization: 'mock_token'
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
      const navigate = vi.fn()

      await refreshToken({
        jwt: 'mock_token',
        setToken,
        navigate
      })

      expect(setToken).toHaveBeenCalledTimes(1)
      expect(setToken).toHaveBeenCalledWith(null)

      expect(window.location.href).toEqual('/')

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:4001/dev/saml-refresh-token',
        {
          credentials: 'include',
          headers: {
            Authorization: 'mock_token'
          },
          method: 'POST'
        }
      )
    })
  })
})
