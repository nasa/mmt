import fetchProviders from '../fetchProviders'
import fetchEdlProfile from '../fetchEdlProfile'
import createJwt from '../createJwt'
import * as getConfig from '../../../../sharedUtils/getConfig'

beforeEach(() => {
  vi.clearAllMocks()
  vi.mock('../../utils/fetchEdlProfile')
  vi.spyOn(getConfig, 'getEdlConfig').mockImplementation(() => ({
    host: 'https://localtest.urs.earthdata.nasa.gov'
  }))

  process.env.JWT_SECRET = 'test-secret'
})

global.fetch = vi.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({
    user_groups: [{ tag: 'MMT_3' }, { tag: 'MMT_4' }]
  })
}))

afterEach(() => {
  delete process.env.JWT_SECRET
  delete process.env.IS_OFFLINE
})

describe('Retrieving Providers', () => {
  fetchEdlProfile.mockImplementation(() => ({
    email: 'test.user@localhost',
    first_name: 'Test',
    last_name: 'User',
    uid: 'mock_user'
  }))

  const expiresAt = '2034-01-02T00:00:00Z'

  test('returns the providers', async () => {
    const token = createJwt(
      'mock-access-token',
      'mock-refresh-token',
      expiresAt,
      { uid: 'mock_user' }
    )
    const event = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const providerIds = await fetchProviders(event)

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith('https://localtest.urs.earthdata.nasa.gov/api/user_groups/groups_for_user/mock_user', {
      headers: {
        Authorization: 'Bearer mock-access-token',
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      method: 'GET'
    })

    expect(providerIds).toEqual(['MMT_3', 'MMT_4'])
  })

  test('returns the providers when offline', async () => {
    process.env.IS_OFFLINE = true
    const token = createJwt(
      'mock-access-token',
      'mock-refresh-token',
      expiresAt,
      { uid: 'mock_user' }
    )
    const event = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const providerIds = await fetchProviders(event)

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith('https://localtest.urs.earthdata.nasa.gov/api/user_groups/groups_for_user/mock_user', {
      headers: {
        Authorization: 'Bearer mock-access-token',
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      method: 'GET'
    })

    expect(providerIds).toEqual(['MMT_3', 'MMT_4'])
  })

  test('returns the correct providers when the test token is passed', async () => {
    process.env.IS_OFFLINE = true
    const event = {
      headers: {
        Authorization: 'Bearer ABC-1'
      }
    }
    const providerIds = await fetchProviders(event)

    expect(fetch).toHaveBeenCalledTimes(0)
    expect(providerIds).toEqual(['MMT_1', 'MMT_2'])
  })

  test('returns undefined when the response from EDL is an error', async () => {
    const token = createJwt(
      'mock-access-token',
      'mock-refresh-token',
      expiresAt,
      { uid: 'mock_user' }
    )
    const event = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Error calling EDL')))

    const providerIds = await fetchProviders(event)
      .catch((error) => {
        expect(error.message).toEqual('Error calling EDL')
      })

    expect(providerIds).toEqual(undefined)
  })

  test('returns HTTP error when response is not ok', async () => {
    const token = createJwt(
      'mock-access-token',
      'mock-refresh-token',
      expiresAt,
      { uid: 'mock_user' }
    )
    const event = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    fetch.mockImplementationOnce(() => Promise.resolve({
      ok: false,
      status: 401,

      json: () => Promise.resolve({
        message: 'Unauthorized'
      })
    }))

    const providerIds = await fetchProviders(event)
      .catch((error) => {
        expect(error.message).toEqual('HTTP error! status: 401, body: {"message":"Unauthorized"}')
      })

    expect(providerIds).toEqual(undefined)
  })

  test('returns an error when no headers are passed in', async () => {
    process.env.IS_OFFLINE = true
    const event = {}
    const providerIds = await fetchProviders(event)
      .catch((error) => {
        expect(error.message).toContain('Cannot destructure property \'edlToken\'')
        expect(error.message).toContain('as it is null.')
      })

    expect(providerIds).toEqual(undefined)
  })
})
