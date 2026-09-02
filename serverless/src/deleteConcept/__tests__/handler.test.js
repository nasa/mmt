import { mockClient } from 'aws-sdk-client-mock'
import {
  DeleteObjectCommand,
  HeadObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'

import deleteConcept from '../handler'

const s3ClientMock = mockClient(S3Client)

beforeEach(() => {
  vi.clearAllMocks()
  s3ClientMock.reset()
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
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

    expect(response.statusCode).toBe(204)
  })

  describe('when the conceptType is invalid', () => {
    test('returns a status code 400', async () => {
      const event = {
        headers: {
          Authorization: 'Bearer ABC-1'
        },
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
        headers: {
          Authorization: 'Bearer ABC-1'
        },
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

      expect(response.statusCode).toBe(404)
    })
  })
})
