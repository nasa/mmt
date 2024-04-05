import errorLogger from '../handler'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('errorLogger', () => {
  test('returns a 200 status code', async () => {
    const consoleMock = vi.spyOn(console, 'error').mockImplementation(() => vi.fn())

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
