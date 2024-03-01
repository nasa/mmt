import edlProfile from '../handler'

import fetchEdlProfile from '../../../../static/src/js/utils/fetchEdlProfile'

jest.mock('../../../../static/src/js/utils/fetchEdlProfile')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('edlProfile when edl password is provided', () => {
  test('when first, last name is given returns a 200 status code with the full name', async () => {
    fetchEdlProfile.mockImplementation(() => ({
      email: 'christopher.d.gokey@nasa.gov',
      first_name: 'Christopher',
      last_name: 'Gokey',
      uid: 'cgokey'
    }))

    const event = {
      queryStringParameters: {
        auid: 'cgokey'
      }
    }

    const response = await edlProfile(event)
    const profile = await response.body
    expect(JSON.parse(profile)).toEqual({
      email: 'christopher.d.gokey@nasa.gov',
      first_name: 'Christopher',
      last_name: 'Gokey',
      auid: 'cgokey',
      name: 'Christopher Gokey',
      uid: 'cgokey'
    })

    expect(response.statusCode).toBe(200)
  })

  test('when only last name is given returns a 200 status code with auid as name', async () => {
    fetchEdlProfile.mockImplementation(() => ({
      email: 'christopher.d.gokey@nasa.gov',
      last_name: 'Gokey',
      uid: 'cgokey'
    }))

    const event = {
      queryStringParameters: {
        auid: 'cgokey'
      }
    }

    const response = await edlProfile(event)
    const profile = await response.body
    expect(JSON.parse(profile)).toEqual({
      email: 'christopher.d.gokey@nasa.gov',
      last_name: 'Gokey',
      auid: 'cgokey',
      name: 'cgokey',
      uid: 'cgokey'
    })

    expect(response.statusCode).toBe(200)
  })
})
