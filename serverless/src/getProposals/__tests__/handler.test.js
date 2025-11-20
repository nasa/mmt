import { mockClient } from 'aws-sdk-client-mock'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { sdkStreamMixin } from '@smithy/util-stream'

import getProposals from '../handler'
import * as s3ListObjects from '../../utils/s3ListObjects'

const s3ClientMock = mockClient(S3Client)

beforeEach(() => {
  s3ClientMock.reset()
  process.env.COLLECTION_PROPOSALS_BUCKET_NAME = 'test-bucket'
})

beforeAll(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {})
})

afterAll(() => {
  vi.restoreAllMocks()
})

describe('getProposals', () => {
  describe('when the proposals are found', () => {
    test('returns the proposals from s3', async () => {
      const bucketContentsMock = vi.spyOn(s3ListObjects, 's3ListObjects').mockResolvedValue([
        {
          Key: 'proposals/123',
          LastModified: '2023-01-01T00:00:00.000Z'
        },
        {
          Key: 'proposals/456',
          LastModified: '2023-01-02T00:00:00.000Z'
        }
      ])

      s3ClientMock
        .on(GetObjectCommand, { Key: 'proposals/123' })
        .resolves({
          Body: sdkStreamMixin(new Blob([JSON.stringify({
            providerId: 'MMT-1',
            shortName: 'Proposal 1',
            entryTitle: 'Entry 1',
            proposalStatus: 'SUBMITTED'
          })]))
        })
        .on(GetObjectCommand, { Key: 'proposals/456' })
        .resolves({
          Body: sdkStreamMixin(new Blob([JSON.stringify({
            providerId: 'MMT-2',
            shortName: 'Proposal 2',
            entryTitle: 'Entry 2',
            proposalStatus: 'APPROVED'
          })]))
        })

      const event = { queryStringParameters: {} }
      const response = await getProposals(event)

      expect(response.statusCode).toBe(200)

      const parsedBody = JSON.parse(response.body)
      expect(parsedBody).toHaveLength(2)
      expect(parsedBody[0]).toEqual(expect.objectContaining({
        id: '123',
        providerId: 'MMT-1',
        shortName: 'Proposal 1',
        entryTitle: 'Entry 1',
        proposalStatus: 'SUBMITTED'
      }))

      expect(parsedBody[1]).toEqual(expect.objectContaining({
        id: '456',
        providerId: 'MMT-2',
        shortName: 'Proposal 2',
        entryTitle: 'Entry 2',
        proposalStatus: 'APPROVED'
      }))

      expect(bucketContentsMock).toHaveBeenCalledTimes(1)
      expect(bucketContentsMock).toHaveBeenCalledWith(
        expect.any(S3Client), // S3Client
        'proposals/', // Prefix
        'test-bucket' // BucketName
      )
    })

    test('returns proposals without the draft attribute', async () => {
      vi.spyOn(s3ListObjects, 's3ListObjects').mockResolvedValue([
        {
          Key: 'proposals/123',
          LastModified: '2023-01-01T00:00:00.000Z'
        }
      ])

      s3ClientMock
        .on(GetObjectCommand, { Key: 'proposals/123' })
        .resolves({
          Body: sdkStreamMixin(new Blob([JSON.stringify({
            providerId: 'MMT-1',
            shortName: 'Proposal 1',
            entryTitle: 'Entry 1',
            proposalStatus: 'SUBMITTED',
            draft: true,
            additionalField: 'Some value'
          })]))
        })

      const event = { queryStringParameters: {} }
      const response = await getProposals(event)

      expect(response.statusCode).toBe(200)

      const parsedBody = JSON.parse(response.body)
      expect(parsedBody).toHaveLength(1)
      expect(parsedBody[0]).toEqual({
        id: '123',
        providerId: 'MMT-1',
        shortName: 'Proposal 1',
        entryTitle: 'Entry 1',
        proposalStatus: 'SUBMITTED',
        additionalField: 'Some value'
      })

      expect(parsedBody[0]).not.toHaveProperty('draft')
    })

    test('filters proposals by providerId when specified', async () => {
      vi.spyOn(s3ListObjects, 's3ListObjects').mockResolvedValue([
        {
          Key: 'proposals/123',
          LastModified: '2023-01-01T00:00:00.000Z'
        },
        {
          Key: 'proposals/456',
          LastModified: '2023-01-02T00:00:00.000Z'
        }
      ])

      s3ClientMock
        .on(GetObjectCommand, { Key: 'proposals/123' })
        .resolves({
          Body: sdkStreamMixin(new Blob([JSON.stringify({
            providerId: 'MMT-1',
            shortName: 'Proposal 1',
            entryTitle: 'Entry 1',
            proposalStatus: 'SUBMITTED'
          })]))
        })
        .on(GetObjectCommand, { Key: 'proposals/456' })
        .resolves({
          Body: sdkStreamMixin(new Blob([JSON.stringify({
            providerId: 'MMT-2',
            shortName: 'Proposal 2',
            entryTitle: 'Entry 2',
            proposalStatus: 'APPROVED'
          })]))
        })

      const event = { queryStringParameters: { providerId: 'MMT-1' } }
      const response = await getProposals(event)

      expect(response.statusCode).toBe(200)

      const parsedBody = JSON.parse(response.body)
      expect(parsedBody).toHaveLength(1)
      expect(parsedBody[0]).toEqual(expect.objectContaining({
        id: '123',
        providerId: 'MMT-1',
        shortName: 'Proposal 1',
        entryTitle: 'Entry 1',
        proposalStatus: 'SUBMITTED'
      }))
    })
  })

  describe('when no proposals are found', () => {
    test('returns an empty array', async () => {
      const bucketContentsMock = vi.spyOn(s3ListObjects, 's3ListObjects').mockResolvedValue([])

      const event = { queryStringParameters: {} }
      const response = await getProposals(event)

      expect(response.statusCode).toBe(200)
      expect(response.body).toBe('[]')

      expect(bucketContentsMock).toHaveBeenCalledTimes(1)
      expect(bucketContentsMock).toHaveBeenCalledWith(
        expect.anything(), // S3Client
        'proposals/', // Prefix
        'test-bucket' // BucketName
      )
    })
  })

  describe('when an error occurs', () => {
    test('returns a 500 status code and error message', async () => {
      vi.spyOn(s3ListObjects, 's3ListObjects').mockRejectedValue(new Error('Test error'))

      const event = { queryStringParameters: {} }
      const response = await getProposals(event)

      expect(response.statusCode).toBe(500)
      expect(JSON.parse(response.body)).toEqual({ message: 'Test error' })
    })

    test('returns a 500 status code and default error message when error has no message', async () => {
    // Create an error without a message
      const errorWithoutMessage = new Error()
      errorWithoutMessage.message = undefined
      vi.spyOn(s3ListObjects, 's3ListObjects').mockRejectedValue(errorWithoutMessage)

      const event = { queryStringParameters: {} }
      const response = await getProposals(event)

      expect(response.statusCode).toBe(500)
      expect(JSON.parse(response.body)).toEqual({ message: 'Internal server error' })
    })

    test('uses error.$metadata.httpStatusCode when available', async () => {
      const errorWithMetadata = new Error('Custom error')
      errorWithMetadata.$metadata = { httpStatusCode: 403 }
      vi.spyOn(s3ListObjects, 's3ListObjects').mockRejectedValue(errorWithMetadata)

      const event = { queryStringParameters: {} }
      const response = await getProposals(event)

      expect(response.statusCode).toBe(403)
      expect(JSON.parse(response.body)).toEqual({ message: 'Custom error' })
    })
  })

  describe('when event does not contain queryStringParameters', () => {
    test('handles the request without error', async () => {
      vi.spyOn(s3ListObjects, 's3ListObjects').mockResolvedValue([
        {
          Key: 'proposals/123',
          LastModified: '2023-01-01T00:00:00.000Z'
        }
      ])

      s3ClientMock
        .on(GetObjectCommand, { Key: 'proposals/123' })
        .resolves({
          Body: sdkStreamMixin(new Blob([JSON.stringify({
            providerId: 'MMT-1',
            shortName: 'Proposal 1',
            entryTitle: 'Entry 1',
            proposalStatus: 'SUBMITTED'
          })]))
        })

      const event = {} // Event without queryStringParameters
      const response = await getProposals(event)

      expect(response.statusCode).toBe(200)
      const parsedBody = JSON.parse(response.body)
      expect(parsedBody).toHaveLength(1)
      expect(parsedBody[0]).toEqual(expect.objectContaining({
        id: '123',
        providerId: 'MMT-1',
        shortName: 'Proposal 1',
        entryTitle: 'Entry 1',
        proposalStatus: 'SUBMITTED'
      }))
    })
  })
})
