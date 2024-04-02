import { mockClient } from 'aws-sdk-client-mock'
import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3'
import { s3ListObjects } from '../s3ListObjects'

const s3ClientMock = mockClient(S3Client)

describe('s3ListObjects', () => {
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
  })
})
