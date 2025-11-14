import {
  describe,
  test,
  expect,
  beforeEach,
  vi
} from 'vitest'
import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { s3BucketContents } from '../s3BucketContents'

describe('s3BucketContents', () => {
  let mockS3Client
  const bucketName = 'test-bucket'

  beforeEach(() => {
    mockS3Client = {
      send: vi.fn().mockResolvedValue({ Contents: [] })
    }
  })

  describe('When calling s3BucketContents', () => {
    test('should call ListObjectsV2Command with correct parameters', async () => {
      const prefix = 'test-prefix'
      await s3BucketContents({
        s3Client: mockS3Client,
        bucketName,
        prefix
      })

      expect(mockS3Client.send).toHaveBeenCalledWith(
        expect.any(ListObjectsV2Command)
      )

      const calledCommand = mockS3Client.send.mock.calls[0][0]
      expect(calledCommand.input).toEqual({
        Bucket: bucketName,
        Prefix: prefix
      })
    })

    test('should return Contents from S3 response', async () => {
      const mockContents = [{ Key: 'file1' }, { Key: 'file2' }]
      mockS3Client.send.mockResolvedValue({ Contents: mockContents })

      const result = await s3BucketContents({
        s3Client: mockS3Client,
        bucketName
      })

      expect(result).toEqual(mockContents)
    })

    test('should return empty array when Contents is undefined', async () => {
      mockS3Client.send.mockResolvedValue({})

      const result = await s3BucketContents({
        s3Client: mockS3Client,
        bucketName
      })

      expect(result).toEqual([])
    })

    test('should use empty string as default prefix', async () => {
      await s3BucketContents({
        s3Client: mockS3Client,
        bucketName
      })

      const calledCommand = mockS3Client.send.mock.calls[0][0]
      expect(calledCommand.input).toEqual({
        Bucket: bucketName,
        Prefix: ''
      })
    })
  })

  describe('When S3 client send fails', () => {
    test('should throw an error', async () => {
      const error = new Error('S3 error')
      mockS3Client.send.mockRejectedValue(error)

      await expect(s3BucketContents({
        s3Client: mockS3Client,
        bucketName
      }))
        .rejects.toThrow('S3 error')
    })
  })
})
