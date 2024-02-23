import fetchEdlClientToken from '../fetchEdlClientToken'

beforeEach(() => {
  jest.clearAllMocks()
  process.env.EDL_PASSWORD = ''
})

global.fetch = jest.fn(() => Promise.resolve({
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
    expect(fetch).toHaveBeenCalledWith('https://sit.urs.earthdata.nasa.gov/oauth/token', {
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: 'Basic bW10X3Rlc3Q6',
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
