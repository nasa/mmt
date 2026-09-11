import { mockClient } from 'aws-sdk-client-mock'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'

import getStagedConcept from '../handler'

const s3ClientMock = mockClient(S3Client)

beforeEach(() => {
  vi.clearAllMocks()
  s3ClientMock.reset()
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('getStagedConcept', () => {
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
      pathParameters: {
        conceptType: 'collections',
        recordId: 'mock-uuid'
      }
    }

    const response = await getStagedConcept(event)

    expect(response.statusCode).toBe(200)

    expect(JSON.parse(response.body)).toEqual({
      concept: mockConcept,
      conceptType: 'collections',
      recordId: 'mock-uuid'
    })

    const getCalls = s3ClientMock.commandCalls(GetObjectCommand)
    expect(getCalls).toHaveLength(1)
    expect(getCalls[0].args[0].input.Key).toBe('collections/mock-uuid')
  })

  describe('when the conceptType is invalid', () => {
    test('returns a status code 400', async () => {
      const event = {
        pathParameters: {
          conceptType: 'invalid-type',
          recordId: 'mock-uuid'
        }
      }

      const response = await getStagedConcept(event)

      expect(response.statusCode).toBe(400)
    })
  })

  describe('when the object does not exist in s3', () => {
    test('returns a status code 404', async () => {
      s3ClientMock.on(GetObjectCommand).rejects(new Error('NoSuchKey'))

      const event = {
        pathParameters: {
          conceptType: 'collections',
          recordId: 'mock-uuid'
        }
      }

      const response = await getStagedConcept(event)

      expect(response.statusCode).toBe(404)
    })
  })
})
