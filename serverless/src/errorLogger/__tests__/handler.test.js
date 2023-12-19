import errorLogger from '../handler'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('errorLogger', () => {
  test('returns a 200 status code', async () => {
    const consoleMock = jest.spyOn(console, 'error').mockImplementation(() => jest.fn())

    const event = {
      body: JSON.stringify({
        message: 'Mock error message',
        stack: 'Mock stack trace',
        location: 'Mock URL',
        action: 'Mock action'
      })
    }

    const response = await errorLogger(event)

    expect(response.statusCode).toBe(200)
    expect(consoleMock).toBeCalledTimes(1)
  })
})
