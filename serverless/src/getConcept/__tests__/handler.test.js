import { mockClient } from 'aws-sdk-client-mock'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'

import getConcept from '../handler'

const s3ClientMock = mockClient(S3Client)

const validStagingHeaders = {
  Authorization: 'Bearer ABC-1',
  'Staging-Api-Key': 'test-staging-key'
}

beforeEach(() => {
  vi.clearAllMocks()
  s3ClientMock.reset()
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})

  process.env.STAGING_API_KEY = 'test-staging-key'
})

describe('getConcept', () => {
  test('retrieves the concept from s3', async () => {
    const mockConcept = { mock: 'Concept Body' }

    s3ClientMock.on(GetObjectCommand).resolves({
      $metadata: {
        httpStatusCode: 200,
        requestId: undefined,
        extendedRequestId: undefined,
        cfId: undefined,
        attempts: 1,
        totalRetryDelay: 0
      },
      Body: {
        transformToString: vi.fn().mockResolvedValue(JSON.stringify(mockConcept))
      }
    })

    const event = {
      headers: validStagingHeaders,
      pathParameters: {
        conceptType: 'collections',
        nativeId: 'TestNativeId',
        providerId: 'MMT_1'
      }
    }

    const response = await getConcept(event)

    expect(response.statusCode).toBe(200)

    expect(JSON.parse(response.body)).toEqual({
      concept: mockConcept,
      conceptType: 'collections',
      nativeId: 'TestNativeId',
      providerId: 'MMT_1'
    })
  })

  describe('when STAGING_API_KEY is not configured in the environment', () => {
    test('returns a status code 401 even when no header is sent', async () => {
      delete process.env.STAGING_API_KEY

      const event = {
        headers: {
          Authorization: 'Bearer ABC-1'
        // No Staging-Api-Key header sent at all
        },
        pathParameters: {
          conceptType: 'collections',
          nativeId: 'TestNativeId',
          providerId: 'MMT_1'
        }
      }

      const response = await getConcept(event)

      expect(response.statusCode).toBe(401)
    })
  })

  describe('when the Staging-Api-Key header is missing', () => {
    test('returns a status code 401', async () => {
      const event = {
        headers: {
          Authorization: 'Bearer ABC-1'
        },
        pathParameters: {
          conceptType: 'collections',
          nativeId: 'TestNativeId',
          providerId: 'MMT_1'
        }
      }

      const response = await getConcept(event)

      expect(response.statusCode).toBe(401)
    })
  })

  describe('when the Staging-Api-Key header does not match', () => {
    test('returns a status code 401', async () => {
      const event = {
        headers: {
          Authorization: 'Bearer ABC-1',
          'Staging-Api-Key': 'wrong-key'
        },
        pathParameters: {
          conceptType: 'collections',
          nativeId: 'TestNativeId',
          providerId: 'MMT_1'
        }
      }

      const response = await getConcept(event)

      expect(response.statusCode).toBe(401)
    })
  })

  describe('when the Staging-Api-Key header has different casing', () => {
    test('is still accepted (case-insensitive lookup)', async () => {
      const mockConcept = { mock: 'Concept Body' }

      s3ClientMock.on(GetObjectCommand).resolves({
        $metadata: {
          httpStatusCode: 200,
          requestId: undefined,
          extendedRequestId: undefined,
          cfId: undefined,
          attempts: 1,
          totalRetryDelay: 0
        },
        Body: {
          transformToString: vi.fn().mockResolvedValue(JSON.stringify(mockConcept))
        }
      })

      const event = {
        headers: {
          Authorization: 'Bearer ABC-1',
          'staging-api-key': 'test-staging-key'
        },
        pathParameters: {
          conceptType: 'collections',
          nativeId: 'TestNativeId',
          providerId: 'MMT_1'
        }
      }

      const response = await getConcept(event)

      expect(response.statusCode).toBe(200)
    })
  })

  describe('when the conceptType is invalid', () => {
    test('returns a status code 400', async () => {
      const event = {
        headers: validStagingHeaders,
        pathParameters: {
          conceptType: 'invalid-type',
          nativeId: 'TestNativeId',
          providerId: 'MMT_1'
        }
      }

      const response = await getConcept(event)

      expect(response.statusCode).toBe(400)
    })
  })

  describe('when you do not have authorization to retrieve', () => {
    test('returns a status code 401', async () => {
      const event = {
        headers: validStagingHeaders,
        pathParameters: {
          conceptType: 'collections',
          nativeId: 'TestNativeId',
          providerId: 'MMT_3'
        }
      }

      const response = await getConcept(event)

      expect(response.statusCode).toBe(401)
    })
  })

  describe('when fetching providers throws an error', () => {
    test('returns a status code 404', async () => {
      const event = {
        headers: {
          ...validStagingHeaders,
          Authorization: 'Bearer invalid_token'
        },
        pathParameters: {
          conceptType: 'collections',
          nativeId: 'TestNativeId',
          providerId: 'MMT_1'
        }
      }

      const response = await getConcept(event)

      expect(response.statusCode).toBe(404)
    })
  })

  describe('when the object does not exist in s3', () => {
    test('returns a status code 404', async () => {
      s3ClientMock.on(GetObjectCommand).rejects(new Error('NoSuchKey'))

      const event = {
        headers: validStagingHeaders,
        pathParameters: {
          conceptType: 'collections',
          nativeId: 'TestNativeId',
          providerId: 'MMT_1'
        }
      }

      const response = await getConcept(event)

      expect(response.statusCode).toBe(404)
    })
  })
})
