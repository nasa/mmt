import { mockClient } from 'aws-sdk-client-mock'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

import createOrUpdateConcept from '../handler'

const s3ClientMock = mockClient(S3Client)

beforeEach(() => {
  vi.clearAllMocks()
  s3ClientMock.reset()
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('createOrUpdateConcept', () => {
  test('saves the concept to s3', async () => {
    s3ClientMock.on(PutObjectCommand).resolves({
      $metadata: {
        httpStatusCode: 200,
        requestId: undefined,
        extendedRequestId: undefined,
        cfId: undefined,
        attempts: 1,
        totalRetryDelay: 0
      },
      ETag: '"1a7e08244b933e4fea1f920da4988500"'
    })

    const event = {
      headers: {
        Authorization: 'Bearer ABC-1'
      },
      body: JSON.stringify({ mock: 'Concept Body' }),
      pathParameters: {
        conceptType: 'collections',
        nativeId: 'TestNativeId',
        providerId: 'MMT_1'
      }
    }

    const response = await createOrUpdateConcept(event)

    expect(response.statusCode).toBe(200)
  })

  describe('when the request body is missing', () => {
    test('returns a status code 400', async () => {
      const event = {
        headers: {
          Authorization: 'Bearer ABC-1'
        },
        body: undefined,
        pathParameters: {
          conceptType: 'collections',
          nativeId: 'TestNativeId',
          providerId: 'MMT_1'
        }
      }

      const response = await createOrUpdateConcept(event)

      expect(response.statusCode).toBe(400)
    })
  })

  describe('when the conceptType is invalid', () => {
    test('returns a status code 400', async () => {
      const event = {
        headers: {
          Authorization: 'Bearer ABC-1'
        },
        body: JSON.stringify({ mock: 'Concept Body' }),
        pathParameters: {
          conceptType: 'invalid-type',
          nativeId: 'TestNativeId',
          providerId: 'MMT_1'
        }
      }

      const response = await createOrUpdateConcept(event)

      expect(response.statusCode).toBe(400)
    })
  })

  describe('when you do not have authorization to create or update', () => {
    test('returns a status code 401', async () => {
      const event = {
        headers: {
          Authorization: 'Bearer ABC-1'
        },
        body: JSON.stringify({ mock: 'Concept Body' }),
        pathParameters: {
          conceptType: 'collections',
          nativeId: 'TestNativeId',
          providerId: 'MMT_3'
        }
      }

      const response = await createOrUpdateConcept(event)

      expect(response.statusCode).toBe(401)
    })
  })

  describe('when fetching providers throws an error', () => {
    test('returns a status code 500', async () => {
      const event = {
        headers: {
          Authorization: 'Bearer invalid_token'
        },
        body: JSON.stringify({ mock: 'Concept Body' }),
        pathParameters: {
          conceptType: 'collections',
          nativeId: 'TestNativeId',
          providerId: 'MMT_1'
        }
      }

      const response = await createOrUpdateConcept(event)

      expect(response.statusCode).toBe(500)
    })
  })

  describe('when saving to s3 throws an error', () => {
    test('returns a status code 404', async () => {
      s3ClientMock.on(PutObjectCommand).rejects(new Error('S3 error'))

      const event = {
        headers: {
          Authorization: 'Bearer ABC-1'
        },
        body: JSON.stringify({ mock: 'Concept Body' }),
        pathParameters: {
          conceptType: 'collections',
          nativeId: 'TestNativeId',
          providerId: 'MMT_1'
        }
      }

      const response = await createOrUpdateConcept(event)

      expect(response.statusCode).toBe(404)
    })
  })
})
