import errorLogger from '../errorLogger'

beforeEach(() => {
  jest.clearAllMocks()
})

global.fetch = jest.fn(() => Promise.resolve({
  text: () => Promise.resolve()
}))

describe('errorLogger', () => {
  describe('when errorLogger is call successfully', () => {
    test('a error message is logged', async () => {
      const error = {
        message: 'Mock error',
        stack: 'Mock stack'
      }
      const action = 'Error Logger test'

      await errorLogger(error, action)

      expect(fetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('when errorLogger call fails', () => {
    test('return undefined response', async () => {
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
})
