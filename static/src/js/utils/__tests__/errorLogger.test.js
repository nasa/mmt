import errorLogger from '../errorLogger'

beforeEach(() => {
  jest.clearAllMocks()
})

global.fetch = jest.fn(() => Promise.resolve({
  text: () => Promise.resolve()
}))

describe('errorLogger', () => {
  test('testing when error-logger endpoint is successful', async () => {
    const error = {
      message: 'Mock error',
      stack: 'Mock stack'
    }
    const action = 'Error Logger test'

    await errorLogger(error, action)

    expect(fetch).toHaveBeenCalledTimes(1)
  })

  test('testing when error-logger endpoint fails', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('error')))
    const error = {
      message: 'Mock error',
      stack: 'Mock stack'
    }
    const action = 'Error Logger test'

    const response = await errorLogger(error, action)
    expect(response).toEqual(undefined)
    expect(fetch).toHaveBeenCalledTimes(1)
  })
})
