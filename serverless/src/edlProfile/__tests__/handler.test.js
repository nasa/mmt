import edlProfile from '../handler'
import fetchEdlProfile from '../../utils/fetchEdlProfile'

vi.mock('../../utils/fetchEdlProfile')

beforeEach(() => {
  vi.clearAllMocks()
})

describe('edlProfile when edl password is provided', () => {
  test('when first, last name is given returns a 200 status code with the full name', async () => {
    fetchEdlProfile.mockImplementation(() => ({
      email: 'test.user@localhost',
      first_name: 'Test',
      last_name: 'User',
      nams_auid: 'mock_user',
      uid: 'mock_user'
    }))

    const event = {
      headers: {
        Authorization: 'Bearer mock-token'
      }
    }

    const response = await edlProfile(event)
    const profile = await response.body

    expect(JSON.parse(profile)).toEqual({
      auid: 'mock_user',
      email: 'test.user@localhost',
      first_name: 'Test',
      last_name: 'User',
      name: 'Test User',
      nams_auid: 'mock_user',
      uid: 'mock_user'
    })

    expect(response.statusCode).toBe(200)
  })

  test('when only last name is given returns a 200 status code with auid as name', async () => {
    fetchEdlProfile.mockImplementation(() => ({
      email: 'test.user@localhost',
      last_name: 'User',
      nams_auid: 'mock_user',
      uid: 'mock_user'
    }))

    const event = {
      headers: {
        Authorization: 'Bearer mock-token'
      }
    }

    const response = await edlProfile(event)
    const profile = await response.body

    expect(JSON.parse(profile)).toEqual({
      auid: 'mock_user',
      email: 'test.user@localhost',
      last_name: 'User',
      name: 'mock_user',
      nams_auid: 'mock_user',
      uid: 'mock_user'
    })

    expect(response.statusCode).toBe(200)
  })

  test('responds correctly on error', async () => {
    const consoleMock = vi.spyOn(console, 'error').mockImplementation(() => vi.fn())

    fetchEdlProfile.mockImplementation(() => Promise.reject(new Error('URS is down')))

    const event = {
      headers: {
        Authorization: 'Bearer mock-token'
      }
    }

    const response = await edlProfile(event)
    const profile = await response.body

    expect(JSON.parse(profile)).toEqual({
      error: 'Error: URS is down'
    })

    expect(consoleMock).toBeCalledTimes(1)
    expect(consoleMock).toBeCalledWith('Error retrieving EDL profile, error=Error: URS is down')

    expect(response.statusCode).toBe(500)
  })
})
