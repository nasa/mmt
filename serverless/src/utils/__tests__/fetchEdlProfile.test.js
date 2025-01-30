import fetchEdlProfile from '../fetchEdlProfile'
import fetchEdlClientToken from '../fetchEdlClientToken'

vi.mock('../fetchEdlClientToken', () => ({ default: vi.fn() }))

beforeEach(() => {
  vi.clearAllMocks()

  fetchEdlClientToken.mockImplementation(() => ('mock_token'))
})

describe('fetchEdlProfile', () => {
  describe('when the user exists', () => {
    test('returns the users profile', async () => {
      global.fetch = vi.fn(() => Promise.resolve({
        json: () => Promise.resolve({
          nams_auid: 'user.name',
          uid: 'user.name',
          first_name: 'User',
          last_name: 'Name'
        })
      }))

      const profile = await fetchEdlProfile('mock-token')

      expect(profile).toEqual({
        auid: 'user.name',
        uid: 'user.name',
        name: 'User Name'
      })

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith('https://sit.urs.earthdata.nasa.gov/api/nams/edl_user', {
        body: 'token=mock-token',
        headers: {
          Authorization: 'Bearer mock_token',
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        method: 'POST'
      })
    })
  })

  describe('when the user does not have name fields', () => {
    test('returns the users profile', async () => {
      global.fetch = vi.fn(() => Promise.resolve({
        json: () => Promise.resolve({
          nams_auid: 'user.name',
          uid: 'user.name',
          first_name: undefined,
          last_name: undefined
        })
      }))

      const profile = await fetchEdlProfile('mock-token')

      expect(profile).toEqual({
        auid: 'user.name',
        uid: 'user.name',
        name: 'user.name'
      })

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith('https://sit.urs.earthdata.nasa.gov/api/nams/edl_user', {
        body: 'token=mock-token',
        headers: {
          Authorization: 'Bearer mock_token',
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        method: 'POST'
      })
    })
  })

  describe('when the token is ABC-1', () => {
    test('returns the users profile', async () => {
      const profile = await fetchEdlProfile('ABC-1')

      expect(profile).toEqual({
        auid: 'admin',
        name: 'Admin User',
        uid: 'admin'
      })

      expect(fetch).toHaveBeenCalledTimes(0)
    })
  })

  describe('when the response from EDL is an error', () => {
    test('returns undefined', async () => {
      fetch.mockImplementationOnce(() => Promise.reject(new Error('Error calling EDL')))
      const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => {})

      const token = await fetchEdlProfile('mock-token')
        .catch((error) => {
          expect(error.message).toEqual('Error calling EDL')
        })

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('fetchEdlProfile Error: ', new Error('Error calling EDL'))

      expect(token).toEqual(undefined)
    })
  })
})
