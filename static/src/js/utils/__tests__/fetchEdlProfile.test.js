import fetchEdlProfile from '../fetchEdlProfile'
import fetchEdlClientToken from '../fetchEdlClientToken'

vi.mock('../fetchEdlClientToken', () => ({ default: vi.fn() }))

beforeEach(() => {
  vi.clearAllMocks()

  fetchEdlClientToken.mockImplementation(() => ('mock_token'))
})

describe('Fetching EDL Profile', () => {
  test('returns the users profile', async () => {
    global.fetch = vi.fn(() => Promise.resolve({
      json: () => Promise.resolve({
        uid: 'user.name',
        first_name: 'User',
        last_name: 'Name'
      })
    }))

    const profile = await fetchEdlProfile('uname')
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith('https://sit.urs.earthdata.nasa.gov/api/users/user_by_nams_auid/uname', {
      headers: {
        Authorization: 'Bearer mock_token'
      },
      method: 'GET'
    })

    expect(profile).toEqual({
      uid: 'user.name',
      first_name: 'User',
      last_name: 'Name'
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
