import { getApplicationConfig } from '../../../../static/src/js/utils/getConfig'
import gkrResponse from '../__mocks__/gkrKeywordRecommendationsResponse'
import gkrKeywordRecommendations from '../handler'

describe('gkrKeywordRecommendations', () => {
  test('returns a gkr response given a query', async () => {
    const { defaultResponseHeaders } = getApplicationConfig()

    global.fetch = vi.fn(() => Promise.resolve({
      headers: defaultResponseHeaders,
      json: () => Promise.resolve(gkrResponse)
    }))

    const body = { description: 'cloud cover and the ozone' }
    const event = { body }
    const response = await gkrKeywordRecommendations(event)
    const json = JSON.parse(await response.body)

    const { statusCode } = response
    const {
      uuid, description, recommendations
    } = json
    expect(statusCode).toEqual(200)
    expect(uuid).toEqual('b0b399d7-abaf-4bd7-b2bf-5484605ffd97')
    expect(description).toEqual('cloud cover and the ozone')
    expect(recommendations.length).toEqual(8)
  })

  test('responds correctly on error', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('GKR is down')))

    const consoleMock = vi.spyOn(console, 'error').mockImplementation(() => vi.fn())

    const body = { description: 'cloud cover and the ozone' }
    const event = { body }
    const response = await gkrKeywordRecommendations(event)
    const {
      statusCode
    } = response
    expect(statusCode).toEqual(500)
    expect(JSON.parse(await response.body)).toEqual({
      error: 'Error: GKR is down'
    })

    expect(consoleMock).toBeCalledTimes(1)
    expect(consoleMock).toBeCalledWith('Error retrieving gkr recommended keywords, request={"description":"cloud cover and the ozone"} error=Error: GKR is down')

    expect(response.statusCode).toBe(500)
  })
})
