import { mockClient } from 'aws-sdk-client-mock'
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'
import { Readable } from 'stream'
import { sdkStreamMixin } from '@smithy/util-stream'

import updateTemplate from '../handler'
import * as s3ListObjects from '../../utils/s3ListObjects'

const s3ClientMock = mockClient(S3Client)

beforeEach(() => {
  s3ClientMock.reset()
})

describe('updateTemplate', () => {
  describe('when the object is found', () => {
    test('updates the template in s3', async () => {
      const listObjectsMock = vi.spyOn(s3ListObjects, 's3ListObjects').mockResolvedValue([{
        Key: 'MMT-1/34a25a4d-da4e-4ffd-b374-beae7978f689/VGVzdCBUZW1wbGF0ZQ==',
        LastModified: '2024-04-01T19:18:11.000Z'
      }])

      const mockBody = new Readable()
      mockBody.push(JSON.stringify({ Mock: 'Template' }))
      mockBody.push(null)
      const sdkStream = sdkStreamMixin(mockBody)

      s3ClientMock.on(PutObjectCommand).resolves({
        $metadata: {
          httpStatusCode: 200,
          requestId: undefined,
          extendedRequestId: undefined,
          cfId: undefined,
          attempts: 1,
          totalRetryDelay: 0
        },
        Body: sdkStream
      })

      const event = {
        body: JSON.stringify({
          TemplateName: 'Test Template',
          mock: 'Template Body'
        }),
        pathParameters: {
          id: 'mock-id',
          providerId: 'MMT-1'
        }
      }

      const response = await updateTemplate(event)

      expect(response.statusCode).toBe(200)

      expect(listObjectsMock).toHaveBeenCalledTimes(1)
      expect(listObjectsMock).toHaveBeenCalledWith(expect.any(Object), 'MMT-1/mock-id')
    })
  })

  describe('when the template name is changed', () => {
    test('creates a new template and deletes the old template', async () => {
      const listObjectsMock = vi.spyOn(s3ListObjects, 's3ListObjects').mockResolvedValue([{
        Key: 'MMT-1/34a25a4d-da4e-4ffd-b374-beae7978f689/VGVzdCBUZW1wbGF0ZQ==',
        LastModified: '2024-04-01T19:18:11.000Z'
      }])

      const mockBody = new Readable()
      mockBody.push(JSON.stringify({ Mock: 'Template' }))
      mockBody.push(null)
      const sdkStream = sdkStreamMixin(mockBody)

      s3ClientMock.on(PutObjectCommand).resolves({
        $metadata: {
          httpStatusCode: 200,
          requestId: undefined,
          extendedRequestId: undefined,
          cfId: undefined,
          attempts: 1,
          totalRetryDelay: 0
        },
        Body: sdkStream
      })

      s3ClientMock.on(DeleteObjectCommand).resolves()

      const event = {
        body: JSON.stringify({
          TemplateName: 'Updated Test Template',
          mock: 'Template Body'
        }),
        pathParameters: {
          id: 'mock-id',
          providerId: 'MMT-1'
        }
      }

      const response = await updateTemplate(event)

      expect(response.statusCode).toBe(200)

      expect(listObjectsMock).toHaveBeenCalledTimes(1)
      expect(listObjectsMock).toHaveBeenCalledWith(expect.any(Object), 'MMT-1/mock-id')
    })
  })

  describe('when the object is not found', () => {
    test('returns a status code 404', async () => {
      const listObjectsMock = vi.spyOn(s3ListObjects, 's3ListObjects').mockResolvedValue([])
      const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => {})

      const event = {
        body: JSON.stringify({
          TemplateName: 'Test Template',
          mock: 'Template Body'
        }),
        pathParameters: {
          id: 'mock-id',
          providerId: 'MMT-1'
        }
      }

      const response = await updateTemplate(event)

      expect(response.statusCode).toBe(404)

      expect(listObjectsMock).toHaveBeenCalledTimes(1)
      expect(listObjectsMock).toHaveBeenCalledWith(expect.any(Object), 'MMT-1/mock-id')

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('updateTemplate Error:', expect.any(Object))
    })
  })
})
