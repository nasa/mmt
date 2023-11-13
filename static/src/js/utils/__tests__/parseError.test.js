import parseError from '../parseError'

describe('parseError', () => {
  describe('when the error is a graphql error', () => {
    test('returns the error messages joined', () => {
      const error = {
        graphQLErrors: [{
          message: 'Mock GraphQL Error 1'
        }, {
          message: 'Mock GraphQL Error 2'
        }]
      }

      expect(parseError(error)).toEqual(`Mock GraphQL Error 1
Mock GraphQL Error 2`)
    })
  })

  describe('when the error is a network error', () => {
    test('returns the path', () => {
      const error = {
        networkError: {
          message: 'Mock Network Error'
        }
      }

      expect(parseError(error)).toEqual('Mock Network Error')
    })
  })
})
