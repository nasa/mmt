import gkrResponse from '../../../../../serverless/src/gkrKeywordRecommendations/__mocks__/gkrKeywordRecommendationsResponse'
import { getApplicationConfig } from '../getConfig'
import getKeywordRecommendations from '../getKeywordRecommendations'

beforeEach(() => {
  vi.clearAllMocks()
})

global.fetch = vi.fn(() => Promise.resolve({
  text: () => Promise.resolve()
}))

describe('getKeywordRecommendation', () => {
  describe('when getKeywordRecommendations is called succesfully', () => {
    test('recommendations are returned', async () => {
      const { defaultResponseHeaders } = getApplicationConfig()
      global.fetch = vi.fn(() => Promise.resolve({
        headers: defaultResponseHeaders,
        json: () => Promise.resolve(gkrResponse)
      }))

      const response = await getKeywordRecommendations('cloud cover and the ozone')
      const {
        uuid, description, recommendations
      } = response
      expect(uuid).toEqual('b0b399d7-abaf-4bd7-b2bf-5484605ffd97')
      expect(description).toEqual('cloud cover and the ozone')
      expect(recommendations.length).toEqual(8)
      expect(fetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('when gkrKeywordRecommendations call fails', () => {
    test('return an Error', async () => {
      fetch.mockImplementationOnce(() => Promise.reject(new Error('GKR is down')))
      const response = await getKeywordRecommendations('cloud cover and the ozone')
      expect(response.message).toEqual('GKR is down')
      expect(fetch).toHaveBeenCalledTimes(1)
    })
  })
})
