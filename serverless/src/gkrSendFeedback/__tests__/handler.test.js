import { getApplicationConfig } from '../../../../static/src/js/utils/getConfig'
import gkrSendFeedbackResponse from '../__mocks__/gkrSendFeedbackResponse'
import gkrSendFeedback from '../handler'

describe('gkrSendFeedback', () => {
  test('returns a successful gkr response for issuing a feedback request', async () => {
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

    const payload = {
      recommendations,
      keywords: newKeywords
    }
    const event = {
      body: payload,
      queryStringParameters: { uuid: requestUuid }
    }
    const response = await gkrSendFeedback(event)
    const json = JSON.parse(await response.body)
    const { updated, not_found: notFound, new_recommendations: newRecommendations } = json
    const { statusCode } = response
    expect(updated.length).toEqual(8)
    expect(notFound.length).toEqual(0)
    expect(newRecommendations.length).toEqual(2)
    expect(statusCode).toEqual(200)
  })

  test('responds correctly on error', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('GKR is down')))

    const consoleMock = vi.spyOn(console, 'error').mockImplementation(() => vi.fn())

    const requestUuid = 'a7ee7703-0316-49cf-91fa-3726ca73fe41'
    const recommendations = {
      'fb391380-399f-47ac-9339-5e335346eeb4': true
    }
    const newKeywords = [
      'EARTH SCIENCE > ATMOSPHERE > AEROSOLS > AEROSOL OPTICAL DEPTH/THICKNESS > ANGSTROM EXPONENT'
    ]

    const payload = {
      recommendations,
      keywords: newKeywords
    }
    const event = {
      body: payload,
      queryStringParameters: { uuid: requestUuid }
    }
    const response = await gkrSendFeedback(event)
    const {
      statusCode
    } = response
    expect(statusCode).toEqual(500)
    expect(JSON.parse(await response.body)).toEqual({
      error: 'Error: GKR is down'
    })

    expect(consoleMock).toBeCalledTimes(1)
    expect(consoleMock).toBeCalledWith('Error sending gkr feedback, request={"recommendations":{"fb391380-399f-47ac-9339-5e335346eeb4":true},"keywords":["EARTH SCIENCE > ATMOSPHERE > AEROSOLS > AEROSOL OPTICAL DEPTH/THICKNESS > ANGSTROM EXPONENT"]} error=Error: GKR is down')
    expect(response.statusCode).toBe(500)
  })
})
