import { mockClient } from 'aws-sdk-client-mock'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { sdkStreamMixin } from '@smithy/util-stream'

import getProposal from '../handler'

const s3ClientMock = mockClient(S3Client)

beforeEach(() => {
  s3ClientMock.reset()
})

describe('getProposal', () => {
  describe('When the proposal is found', () => {
    test('should return the proposal from S3', async () => {
      const mockBody = new Blob([JSON.stringify({ Mock: 'Proposal' })])
      const body = sdkStreamMixin(mockBody)

      s3ClientMock.on(GetObjectCommand).resolves({
        $metadata: {
          httpStatusCode: 200
        },
        Body: body
      })

      const event = {
        pathParameters: {
          id: 'mock-id'
        }
      }

      const response = await getProposal(event)
      const result = JSON.parse(response.body)

      expect(response.statusCode).toBe(200)
      expect(result.proposal).toEqual(expect.objectContaining({
        Mock: 'Proposal'
      }))
    })
  })

  describe('When the proposal is not found', () => {
    test('should return a 404 status code with appropriate message', async () => {
      s3ClientMock.on(GetObjectCommand).rejects({
        $metadata: {
          httpStatusCode: 404
        }
      })

      const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => {})

      const event = {
        pathParameters: {
          id: 'non-existent-id'
        }
      }

      const response = await getProposal(event)
      const result = JSON.parse(response.body)

      expect(response.statusCode).toBe(404)
      expect(result.message).toBe('Proposal with id non-existent-id not found')
      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('getProposal Error:', expect.any(Object))
    })
  })

  describe('When an unexpected error occurs', () => {
    test('should return a 500 status code with AWS error message', async () => {
      const awsErrorMessage = 'AWS specific error message'
      s3ClientMock.on(GetObjectCommand).rejects({
        $metadata: {
          httpStatusCode: 500
        },
        message: awsErrorMessage
      })

      const event = {
        pathParameters: {
          id: 'error-id'
        }
      }

      const response = await getProposal(event)
      const result = JSON.parse(response.body)

      expect(response.statusCode).toBe(500)
      expect(result.message).toBe(awsErrorMessage)
    })

    test('should return a 500 status code with generic message when AWS error message is not available', async () => {
      s3ClientMock.on(GetObjectCommand).rejects({
        $metadata: {
          httpStatusCode: 500
        }
      })

      const event = {
        pathParameters: {
          id: 'error-id'
        }
      }

      const response = await getProposal(event)
      const result = JSON.parse(response.body)

      expect(response.statusCode).toBe(500)
      expect(result.message).toBe('Internal server error')
    })

    test('should return a 500 status code when $metadata.httpStatusCode is not available', async () => {
      s3ClientMock.on(GetObjectCommand).rejects({
        message: 'Some error without status code'
      })

      const event = {
        pathParameters: {
          id: 'error-id'
        }
      }

      const response = await getProposal(event)
      const result = JSON.parse(response.body)

      expect(response.statusCode).toBe(500)
      expect(result.message).toBe('Some error without status code')
    })
  })
})
