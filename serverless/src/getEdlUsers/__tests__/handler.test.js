import getEdlUsers from '../handler'
import fetchEdlClientToken from '../../utils/fetchEdlClientToken'
import * as getConfig from '../../../../sharedUtils/getConfig'

vi.mock('../../utils/fetchEdlClientToken')

describe('getEdlUsers', () => {
  describe('when the request is successful', () => {
    test('returns the values', async () => {
      fetchEdlClientToken.mockImplementation(() => 'mock-token')
      vi.spyOn(getConfig, 'getEdlConfig').mockReturnValue({ host: 'https://example.com' })
      vi.spyOn(getConfig, 'getApplicationConfig').mockReturnValue({ defaultResponseHeaders: {} })

      global.fetch = vi.fn(() => Promise.resolve({
        json: () => Promise.resolve({
          users: [{
            uid: 'test.user',
            first_name: 'Test',
            last_name: 'User'
          }]
        })
      }))

      const event = {
        queryStringParameters: {
          query: 'test'
        }
      }

      const response = await getEdlUsers(event)

      expect(response.body).toBe(JSON.stringify([{
        id: 'test.user',
        label: 'Test User'
      }]))
    })
  })

  describe('when the object is not found', () => {
    test('returns a status code 404', async () => {
      fetchEdlClientToken.mockImplementation(() => 'mock-token')
      vi.spyOn(getConfig, 'getEdlConfig').mockReturnValue({ host: 'https://example.com' })
      vi.spyOn(getConfig, 'getApplicationConfig').mockReturnValue({ defaultResponseHeaders: {} })

      fetch.mockImplementationOnce(() => Promise.reject(new Error('Error calling EDL')))

      const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => {})

      const event = {
        queryStringParameters: {
          query: 'test'
        }
      }

      const response = await getEdlUsers(event)

      expect(response.statusCode).toBe(404)

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('getEdlUsers Error:', expect.any(Object))
    })
  })
})
