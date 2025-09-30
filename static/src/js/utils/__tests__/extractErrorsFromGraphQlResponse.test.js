import {
  describe,
  test,
  expect
} from 'vitest'
import extractErrorsFromGraphQlResponse from '../extractErrorsFromGraphQlResponse'

describe('when parsing a graphql error response', () => {
  test('should extracts error messages', () => {
    const fullError = {
      graphQLErrors: [
        {
          message: '#/catalog_item_identity/collection_identifier/temporal: required key [mask] not found',
          locations: [{
            line: 2,
            column: 3
          }],
          path: ['updateAcl'],
          extensions: {
            code: 'CMR_ERROR',
            stacktrace: [
              'GraphQLError: #/catalog_item_identity/collection_identifier/temporal: required key [mask] not found',
              '    at _n (/var/task/index.js:4906:9816)',
              '    at Du.parseIngest (/var/task/index.js:4906:17929)',
              '    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)',
              '    at async Object.Q0e [as aclSourceUpdate] (/var/task/index.js:4906:20204)',
              '    at async r (/var/task/index.js:5010:39250)'
            ]
          }
        }
      ]
    }

    const result = extractErrorsFromGraphQlResponse(fullError)

    expect(result).toEqual([
      {
        message: '#/catalog_item_identity/collection_identifier/temporal: required key [mask] not found',
        locations: [{
          line: 2,
          column: 3
        }],
        path: ['updateAcl'],
        extensions: {
          code: 'CMR_ERROR',
          stacktrace: expect.any(Array)
        }
      }
    ])
  })

  test('should handle network errors', () => {
    const fullError = {
      networkError: {
        name: 'ServerError',
        response: {},
        statusCode: 500,
        result: {
          errors: [
            {
              message: 'Context creation failed: Request failed with status code 400',
              extensions: {
                code: 'INTERNAL_SERVER_ERROR',
                stacktrace: [
                  'AxiosError: Request failed with status code 400',
                  '    at Bs (/var/task/index.js:4902:1046)',
                  '    at IncomingMessage.<anonymous> (/var/task/index.js:4903:9885)',
                  '    at IncomingMessage.emit (node:events:530:35)',
                  '    at endReadableNT (node:internal/streams/readable:1698:12)',
                  '    at process.processTicksAndRejections (node:internal/process/task_queues:90:21)',
                  '    at r1.request (/var/task/index.js:4905:2043)',
                  '    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)',
                  '    at async Dxt (/var/task/index.js:5010:45051)',
                  '    at async context (/var/task/index.js:5010:46003)',
                  '    at async e.executeHTTPGraphQLRequest (/var/task/index.js:611:21419)',
                  '    at async Runtime.handler (/var/task/index.js:317:604)'
                ]
              }
            }
          ]
        }
      },
      message: 'Response not successful: Received status code 500'
    }

    const result = extractErrorsFromGraphQlResponse(fullError)

    expect(result).toEqual([
      {
        message: 'Context creation failed: Request failed with status code 400',
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          stacktrace: expect.any(Array)
        }
      }
    ])
  })

  test('should return default error when no specific error structure is found', () => {
    const fullError = {
      message: 'An unexpected error occurred'
    }

    const result = extractErrorsFromGraphQlResponse(fullError)

    expect(result).toEqual([
      {
        message: 'An unexpected error occurred',
        extensions: {
          code: 'UNKNOWN_ERROR'
        }
      }
    ])
  })

  test('should handle network error with status code', () => {
    const fullError = {
      networkError: {
        statusCode: 404
      },
      message: 'Not Found'
    }

    const result = extractErrorsFromGraphQlResponse(fullError)

    expect(result).toEqual([
      {
        message: 'Not Found',
        extensions: {
          code: 'HTTP_404'
        }
      }
    ])
  })

  test('should handle empty list of errors', () => {
    const fullError = {
      graphQLErrors: [],
      message: 'Empty GraphQL Errors'
    }

    const result = extractErrorsFromGraphQlResponse(fullError)

    expect(result).toEqual([
      {
        message: 'Empty GraphQL Errors',
        extensions: {
          code: 'UNKNOWN_ERROR'
        }
      }
    ])
  })

  test('should handles multiple graphQLErrors', () => {
    const fullError = {
      graphQLErrors: [
        {
          message: 'Error 1',
          locations: [{
            line: 1,
            column: 1
          }],
          path: ['field1'],
          extensions: { code: 'ERROR_1' }
        },
        {
          message: 'Error 2',
          locations: [{
            line: 2,
            column: 2
          }],
          path: ['field2'],
          extensions: { code: 'ERROR_2' }
        }
      ]
    }

    const result = extractErrorsFromGraphQlResponse(fullError)

    expect(result).toEqual([
      {
        message: 'Error 1',
        locations: [{
          line: 1,
          column: 1
        }],
        path: ['field1'],
        extensions: { code: 'ERROR_1' }
      },
      {
        message: 'Error 2',
        locations: [{
          line: 2,
          column: 2
        }],
        path: ['field2'],
        extensions: { code: 'ERROR_2' }
      }
    ])
  })

  test('should handle networkError when result.errors is not present', () => {
    const fullError = {
      networkError: {
        result: {} // Result.errors is undefined
      },
      message: 'Network error without result.errors'
    }

    const result = extractErrorsFromGraphQlResponse(fullError)

    expect(result).toEqual([
      {
        message: 'Network error without result.errors',
        extensions: {
          code: 'UNKNOWN_ERROR'
        }
      }
    ])
  })
})
