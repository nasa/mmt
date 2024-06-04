import fetchEdlClientToken from '../../utils/fetchEdlClientToken'
import * as getConfig from '../../../../sharedUtils/getConfig'
import getEdlGroups from '../handler'

vi.mock('../../utils/fetchEdlClientToken')

describe('getEdlGroups', () => {
  describe('when the request is successful', () => {
    test('returns the value', async () => {
      fetchEdlClientToken.mockImplementation(() => 'mock-token')
      vi.spyOn(getConfig, 'getEdlConfig').mockReturnValue({ host: 'https://example.com' })
      vi.spyOn(getConfig, 'getApplicationConfig').mockReturnValue({ defaultResponseHeaders: {} })

      global.fetch = vi.fn(() => Promise.resolve({
        json: () => Promise.resolve([
          {
            group_id: '1234-abcd-5678-efgh',
            name: 'Test Group',
            tag: 'TEST PROV'
          }
        ])
      }))

      const event = {
        queryStringParameters: {
          query: 'test',
          tags: 'provider'
        }
      }

      const response = await getEdlGroups(event)

      expect(response.body).toBe(JSON.stringify([{
        id: '1234-abcd-5678-efgh',
        name: 'Test Group',
        tag: 'TEST PROV'
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
          query: 'test',
          tags: 'provider'
        }
      }

      const response = await getEdlGroups(event)

      expect(response.statusCode).toBe(404)

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('getEdlGroups Error:', expect.any(Object))
    })
  })
})
