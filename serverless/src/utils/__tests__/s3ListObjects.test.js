import { mockClient } from 'aws-sdk-client-mock'
import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3'
import { s3ListObjects } from '../s3ListObjects'

const s3ClientMock = mockClient(S3Client)

describe('s3ListObjects', () => {
  beforeEach(() => {
    s3ClientMock.reset()
  })

  test('returns an s3 list command contents', async () => {
    s3ClientMock.on(ListObjectsV2Command).resolves({
      $metadata: {
        httpStatusCode: 200,
        requestId: undefined,
        extendedRequestId: undefined,
        cfId: undefined,
        attempts: 1,
        totalRetryDelay: 0
      },
      Contents: [
        {
          Key: 'MMT-1/34a25a4d-da4e-4ffd-b374-beae7978f689/VGVzdCBUZW1wbGF0ZSAy',
          LastModified: '2024-04-01T19:18:11.000Z',
          ETag: '"bca9ffe2aca1b1c1d580f3e85a08805b"',
          Size: 70,
          StorageClass: 'STANDARD'
        },
        {
          Key: 'MMT-1/460bfd33-cad3-46f8-9eee-47664f98038c/VGVzdCBUZW1wbGF0ZSAx',
          LastModified: '2024-04-02T19:18:11.000Z',
          ETag: '"6748580967229939f63a9638071439c9"',
          Size: 70,
          StorageClass: 'STANDARD'
        }
      ],
      IsTruncated: false,
      KeyCount: 5,
      MaxKeys: 1000,
      Name: 'mmt-dev-collection-templates',
      Prefix: 'MMT-1/'
    })

    const result = await s3ListObjects(s3ClientMock, 'MMT-1/')

    expect(result).toEqual([
      {
        Key: 'MMT-1/34a25a4d-da4e-4ffd-b374-beae7978f689/VGVzdCBUZW1wbGF0ZSAy',
        LastModified: '2024-04-01T19:18:11.000Z',
        ETag: '"bca9ffe2aca1b1c1d580f3e85a08805b"',
        Size: 70,
        StorageClass: 'STANDARD'
      },
      {
        Key: 'MMT-1/460bfd33-cad3-46f8-9eee-47664f98038c/VGVzdCBUZW1wbGF0ZSAx',
        LastModified: '2024-04-02T19:18:11.000Z',
        ETag: '"6748580967229939f63a9638071439c9"',
        Size: 70,
        StorageClass: 'STANDARD'
      }
    ])

    expect(s3ClientMock.calls()).toHaveLength(1)
    const [call] = s3ClientMock.calls()
    expect(call.args[0].input).toEqual({
      Bucket: process.env.COLLECTION_TEMPLATES_BUCKET_NAME,
      Prefix: 'MMT-1/'
    })
  })

  test('returns an s3 list command contents with specified bucket', async () => {
    const customBucketName = 'custom-bucket'

    s3ClientMock.on(ListObjectsV2Command).resolves({
      Contents: [
        {
          Key: 'custom-prefix/file1',
          LastModified: '2024-04-03T10:00:00.000Z',
          ETag: '"abc123"',
          Size: 100,
          StorageClass: 'STANDARD'
        }
      ]
    })

    const result = await s3ListObjects(s3ClientMock, 'custom-prefix/', customBucketName)

    expect(result).toEqual([
      {
        Key: 'custom-prefix/file1',
        LastModified: '2024-04-03T10:00:00.000Z',
        ETag: '"abc123"',
        Size: 100,
        StorageClass: 'STANDARD'
      }
    ])

    expect(s3ClientMock.calls()).toHaveLength(1)
    const [call] = s3ClientMock.calls()
    expect(call.args[0].input).toEqual({
      Bucket: customBucketName,
      Prefix: 'custom-prefix/'
    })
  })

  test('returns an s3 list command contents when no prefix is passed', async () => {
    s3ClientMock.on(ListObjectsV2Command).resolves({
      Contents: [
        {
          Key: 'file1',
          LastModified: '2024-04-04T12:00:00.000Z',
          ETag: '"def456"',
          Size: 200,
          StorageClass: 'STANDARD'
        },
        {
          Key: 'folder/file2',
          LastModified: '2024-04-04T13:00:00.000Z',
          ETag: '"ghi789"',
          Size: 300,
          StorageClass: 'STANDARD'
        }
      ]
    })

    const result = await s3ListObjects(s3ClientMock)

    expect(result).toEqual([
      {
        Key: 'file1',
        LastModified: '2024-04-04T12:00:00.000Z',
        ETag: '"def456"',
        Size: 200,
        StorageClass: 'STANDARD'
      },
      {
        Key: 'folder/file2',
        LastModified: '2024-04-04T13:00:00.000Z',
        ETag: '"ghi789"',
        Size: 300,
        StorageClass: 'STANDARD'
      }
    ])

    expect(s3ClientMock.calls()).toHaveLength(1)
    const [call] = s3ClientMock.calls()
    expect(call.args[0].input).toEqual({
      Bucket: process.env.COLLECTION_TEMPLATES_BUCKET_NAME,
      Prefix: ''
    })
  })

  test('handles empty response from S3', async () => {
    s3ClientMock.on(ListObjectsV2Command).resolves({
      Contents: undefined
    })

    const result = await s3ListObjects(s3ClientMock, 'empty-prefix/')

    expect(result).toEqual([])

    expect(s3ClientMock.calls()).toHaveLength(1)
    const [call] = s3ClientMock.calls()
    expect(call.args[0].input).toEqual({
      Bucket: process.env.COLLECTION_TEMPLATES_BUCKET_NAME,
      Prefix: 'empty-prefix/'
    })
  })
})
