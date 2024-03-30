import fetchEdlClientToken from '../fetchEdlClientToken'
import * as getConfig from '../getConfig'

beforeEach(() => {
  vi.clearAllMocks()
  vi.spyOn(getConfig, 'getEdlConfig').mockImplementation(() => ({
    host: 'https://localtest.urs.earthdata.nasa.gov',
    uid: 'mmt_test'
  }))

  process.env.EDL_PASSWORD = 'test'
})

global.fetch = vi.fn(() => Promise.resolve({
  json: () => Promise.resolve({
    access_token: 'mock_token',
    token_type: 'Bearer',
    expires_in: 1296000
  })
}))

describe('Retrieving EDL Client Token', () => {
  test('returns token', async () => {
    const token = await fetchEdlClientToken()

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith('https://localtest.urs.earthdata.nasa.gov/oauth/token', {
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: 'Basic bW10X3Rlc3Q6dGVzdA==',
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      method: 'POST'
    })

    expect(token).toEqual('mock_token')
  })

  test('returns undefined when the response from EDL is an error', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Error calling EDL')))

    const token = await fetchEdlClientToken()
      .catch((error) => {
        expect(error.message).toEqual('Error calling EDL')
      })
    expect(token).toEqual(undefined)
  })
})
