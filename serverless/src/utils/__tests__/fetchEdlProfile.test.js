import fetchEdlProfile from '../fetchEdlProfile'
import fetchEdlClientToken from '../fetchEdlClientToken'

vi.mock('../fetchEdlClientToken', () => ({ default: vi.fn() }))

beforeEach(() => {
  vi.clearAllMocks()

  fetchEdlClientToken.mockImplementation(() => ('mock_token'))
})

describe('fetchEdlProfile', () => {
  test('returns the users profile', async () => {
    global.fetch = vi.fn(() => Promise.resolve({
      json: () => Promise.resolve({
        uid: 'user.name',
        first_name: 'User',
        last_name: 'Name'
      })
    }))

    const profile = await fetchEdlProfile('mock-token')

    expect(profile).toEqual({
      uid: 'user.name',
      first_name: 'User',
      last_name: 'Name'
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

  test('returns undefined when the response from EDL is an error', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Error calling EDL')))

    const token = await fetchEdlProfile()
      .catch((error) => {
        expect(error.message).toEqual('Error calling EDL')
      })

    expect(token).toEqual(undefined)
  })
})
