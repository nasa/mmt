import { mockClient } from 'aws-sdk-client-mock'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

import createStagedConcept from '../handler'

const s3ClientMock = mockClient(S3Client)

// `uuid` is globally mocked to return 'mock-uuid' (see test-setup.js)
const mockRecordId = 'mock-uuid'

beforeEach(() => {
  vi.clearAllMocks()
  s3ClientMock.reset()
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('createStagedConcept', () => {
  test('saves the concept to s3 under a generated recordId', async () => {
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
      body: JSON.stringify({ mock: 'Concept Body' }),
      pathParameters: {
        conceptType: 'collections'
      }
    }

    const response = await createStagedConcept(event)

    expect(response.statusCode).toBe(200)

    expect(JSON.parse(response.body)).toEqual({
      recordId: mockRecordId
    })

    const putCalls = s3ClientMock.commandCalls(PutObjectCommand)
    expect(putCalls).toHaveLength(1)
    expect(putCalls[0].args[0].input.Key).toBe(`collections/${mockRecordId}`)
  })

  describe('when the request body is missing', () => {
    test('returns a status code 400', async () => {
      const event = {
        body: undefined,
        pathParameters: {
          conceptType: 'collections'
        }
      }

      const response = await createStagedConcept(event)

      expect(response.statusCode).toBe(400)
    })
  })

  describe('when the conceptType is invalid', () => {
    test('returns a status code 400', async () => {
      const event = {
        body: JSON.stringify({ mock: 'Concept Body' }),
        pathParameters: {
          conceptType: 'invalid-type'
        }
      }

      const response = await createStagedConcept(event)

      expect(response.statusCode).toBe(400)
    })
  })

  describe('when saving to s3 throws an error', () => {
    test('returns a status code 404', async () => {
      s3ClientMock.on(PutObjectCommand).rejects(new Error('S3 error'))

      const event = {
        body: JSON.stringify({ mock: 'Concept Body' }),
        pathParameters: {
          conceptType: 'collections'
        }
      }

      const response = await createStagedConcept(event)

      expect(response.statusCode).toBe(404)
    })
  })
})
