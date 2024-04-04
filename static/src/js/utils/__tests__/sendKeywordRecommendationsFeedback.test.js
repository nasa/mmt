import gkrSendFeedbackResponse from '../../../../../serverless/src/gkrSendFeedback/__mocks__/gkrSendFeedbackResponse'
import { getApplicationConfig } from '../../../../../sharedUtils/getConfig'
import sendKeywordRecommendationsFeedback from '../sendKeywordRecommendationsFeedback'

beforeEach(() => {
  vi.clearAllMocks()
})

global.fetch = vi.fn(() => Promise.resolve({
  text: () => Promise.resolve()
}))

describe('sendKeywordRecommendations', () => {
  describe('when sendKeywordRecommendations is called succesfully', () => {
    test('feedback is updated', async () => {
      const { defaultResponseHeaders } = getApplicationConfig()
      global.fetch = vi.fn(() => Promise.resolve({
        headers: defaultResponseHeaders,
        json: () => Promise.resolve(gkrSendFeedbackResponse)
      }))

      const requestUuid = 'a7ee7703-0316-49cf-91fa-3726ca73fe41'
      const recommendations = {
        'fb391380-399f-47ac-9339-5e335346eeb4': true,
        'cbbd002d-7ab4-4180-8a3d-bee796abfbaa': true,
        '2c1f2bc2-0089-4a40-bfb8-410b5939e2ff': true,
        'b01e5dfb-653e-4656-9412-674374c45cf4': true,
        'b1eab93d-6848-4eb2-b526-f85e17eb3f72': false,
        'a60497d6-612a-4b44-8ec2-4ea3c74b3ce3': false,
        '1c06f843-6458-4384-90ef-43af2d8df772': false,
        '380470a1-0f6b-4185-ad2d-1918df10814c': false
      }
      const newKeywords = [
        'EARTH SCIENCE > ATMOSPHERE > AEROSOLS > AEROSOL OPTICAL DEPTH/THICKNESS > ANGSTROM EXPONENT',
        'EARTH SCIENCE > SOLID EARTH > ROCKS/MINERALS/CRYSTALS > SEDIMENTARY ROCKS > SEDIMENTARY ROCK PHYSICAL/OPTICAL PROPERTIES > LUMINESCENCE'
      ]

      const response = await sendKeywordRecommendationsFeedback(
        requestUuid,
        recommendations,
        newKeywords
      )

      const { updated, not_found: notFound, new_recommendations: newRecommendations } = response
      expect(updated.length).toEqual(8)
      expect(notFound.length).toEqual(0)
      expect(newRecommendations.length).toEqual(2)
      expect(fetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('when gkrSendKeywordRecommendations call fails', () => {
    test('return an Error', async () => {
      fetch.mockImplementationOnce(() => Promise.reject(new Error('GKR is down')))
      const requestUuid = 'a7ee7703-0316-49cf-91fa-3726ca73fe41'
      const recommendations = {
        'fb391380-399f-47ac-9339-5e335346eeb4': true
      }
      const newKeywords = [
        'EARTH SCIENCE > ATMOSPHERE > AEROSOLS > AEROSOL OPTICAL DEPTH/THICKNESS > ANGSTROM EXPONENT'
      ]

      const response = await sendKeywordRecommendationsFeedback(
        requestUuid,
        recommendations,
        newKeywords
      )

      expect(response.message).toEqual('GKR is down')
      expect(fetch).toHaveBeenCalledTimes(1)
    })
  })
})
