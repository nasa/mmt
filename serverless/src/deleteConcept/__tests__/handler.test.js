import { mockClient } from 'aws-sdk-client-mock'
import {
  DeleteObjectCommand,
  HeadObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'

import deleteConcept from '../handler'

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

describe('deleteConcept', () => {
  test('deletes the concept from s3', async () => {
    s3ClientMock.on(HeadObjectCommand).resolves({
      $metadata: {
        httpStatusCode: 200
      }
    })

    s3ClientMock.on(DeleteObjectCommand).resolves({
      $metadata: {
        httpStatusCode: 204,
        requestId: undefined,
        extendedRequestId: undefined,
        cfId: undefined,
        attempts: 1,
        totalRetryDelay: 0
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

    const response = await deleteConcept(event)

    expect(response.statusCode).toBe(204)
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

      const response = await deleteConcept(event)

      expect(response.statusCode).toBe(401)
      expect(s3ClientMock.commandCalls(HeadObjectCommand)).toHaveLength(0)
      expect(s3ClientMock.commandCalls(DeleteObjectCommand)).toHaveLength(0)
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

      const response = await deleteConcept(event)

      expect(response.statusCode).toBe(401)
      expect(s3ClientMock.commandCalls(HeadObjectCommand)).toHaveLength(0)
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

      const response = await deleteConcept(event)

      expect(response.statusCode).toBe(401)
      expect(s3ClientMock.commandCalls(HeadObjectCommand)).toHaveLength(0)
    })
  })

  describe('when the Staging-Api-Key header has different casing', () => {
    test('is still accepted (case-insensitive lookup)', async () => {
      s3ClientMock.on(HeadObjectCommand).resolves({
        $metadata: {
          httpStatusCode: 200
        }
      })

      s3ClientMock.on(DeleteObjectCommand).resolves({
        $metadata: {
          httpStatusCode: 204,
          requestId: undefined,
          extendedRequestId: undefined,
          cfId: undefined,
          attempts: 1,
          totalRetryDelay: 0
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

      const response = await deleteConcept(event)

      expect(response.statusCode).toBe(204)
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

      const response = await deleteConcept(event)

      expect(response.statusCode).toBe(400)
    })
  })

  describe('when you do not have authorization to delete', () => {
    test('returns a status code 401', async () => {
      const event = {
        headers: validStagingHeaders,
        pathParameters: {
          conceptType: 'collections',
          nativeId: 'TestNativeId',
          providerId: 'MMT_3'
        }
      }

      const response = await deleteConcept(event)

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

      const response = await deleteConcept(event)

      expect(response.statusCode).toBe(404)
    })
  })

  describe('when the concept does not exist in s3', () => {
    test('returns a status code 404 and does not attempt to delete', async () => {
      s3ClientMock.on(HeadObjectCommand).rejects(new Error('NotFound'))

      const event = {
        headers: validStagingHeaders,
        pathParameters: {
          conceptType: 'collections',
          nativeId: 'TestNativeId',
          providerId: 'MMT_1'
        }
      }

      const response = await deleteConcept(event)

      expect(response.statusCode).toBe(404)
      expect(s3ClientMock.commandCalls(DeleteObjectCommand)).toHaveLength(0)
    })
  })

  describe('when deleting the object in s3 throws an error', () => {
    test('returns a status code 404', async () => {
      s3ClientMock.on(HeadObjectCommand).resolves({
        $metadata: {
          httpStatusCode: 200
        }
      })

      s3ClientMock.on(DeleteObjectCommand).rejects(new Error('S3 error'))

      const event = {
        headers: validStagingHeaders,
        pathParameters: {
          conceptType: 'collections',
          nativeId: 'TestNativeId',
          providerId: 'MMT_1'
        }
      }

      const response = await deleteConcept(event)

      expect(response.statusCode).toBe(404)
    })
  })
})
