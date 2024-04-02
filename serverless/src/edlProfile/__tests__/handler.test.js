import edlProfile from '../handler'

import fetchEdlProfile from '../../../../static/src/js/utils/fetchEdlProfile'

vi.mock('../../../../static/src/js/utils/fetchEdlProfile')

beforeEach(() => {
  vi.clearAllMocks()
})

describe('edlProfile when edl password is provided', () => {
  test('when first, last name is given returns a 200 status code with the full name', async () => {
    fetchEdlProfile.mockImplementation(() => ({
      email: 'test.user@localhost',
      first_name: 'Test',
      last_name: 'User',
      uid: 'mock_user'
    }))

    const event = {
      queryStringParameters: {
        auid: 'mock_user'
      }
    }

    const response = await edlProfile(event)
    const profile = await response.body
    expect(JSON.parse(profile)).toEqual({
      email: 'test.user@localhost',
      first_name: 'Test',
      last_name: 'User',
      auid: 'mock_user',
      name: 'Test User',
      uid: 'mock_user'
    })

    expect(response.statusCode).toBe(200)
  })

  test('when only last name is given returns a 200 status code with auid as name', async () => {
    fetchEdlProfile.mockImplementation(() => ({
      email: 'test.user@localhost',
      last_name: 'User',
      uid: 'mock_user'
    }))

    const event = {
      queryStringParameters: {
        auid: 'mock_user'
      }
    }

    const response = await edlProfile(event)
    const profile = await response.body
    expect(JSON.parse(profile)).toEqual({
      email: 'test.user@localhost',
      last_name: 'User',
      auid: 'mock_user',
      name: 'mock_user',
      uid: 'mock_user'
    })

    expect(response.statusCode).toBe(200)
  })

  test('responds correctly on error', async () => {
    const consoleMock = vi.spyOn(console, 'error').mockImplementation(() => vi.fn())

    fetchEdlProfile.mockImplementation(() => Promise.reject(new Error('URS is down')))

    const event = {
      queryStringParameters: {
        auid: 'mock_user'
      }
    }

    const response = await edlProfile(event)
    const profile = await response.body
    expect(JSON.parse(profile)).toEqual({
      error: 'Error: URS is down'
    })

    expect(consoleMock).toBeCalledTimes(1)
    expect(consoleMock).toBeCalledWith('Error retrieving edl profile for mock_user, error=Error: URS is down')

    expect(response.statusCode).toBe(500)
  })
})
