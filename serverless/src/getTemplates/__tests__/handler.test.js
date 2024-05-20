import { mockClient } from 'aws-sdk-client-mock'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { sdkStreamMixin } from '@smithy/util-stream'

import getTemplates from '../handler'
import * as s3ListObjects from '../../utils/s3ListObjects'

const s3ClientMock = mockClient(S3Client)

beforeEach(() => {
  s3ClientMock.reset()
})

describe('getTemplates', () => {
  describe('when the objects are found', () => {
    test('returns the template names from s3', async () => {
      const listObjectsMock = vi.spyOn(s3ListObjects, 's3ListObjects').mockResolvedValue([{
        Key: 'MMT-1/34a25a4d-da4e-4ffd-b374-beae7978f689/VGVzdCBUZW1wbGF0ZSAy',
        LastModified: '2024-04-01T19:18:11.000Z'
      }, {
        Key: 'MMT-1/460bfd33-cad3-46f8-9eee-47664f98038c/VGVzdCBUZW1wbGF0ZSAx',
        LastModified: '2024-04-02T19:18:11.000Z'
      }])

      const mockBody = new Blob([JSON.stringify({ Mock: 'Template' })])
      const body = sdkStreamMixin(mockBody)

      s3ClientMock.on(GetObjectCommand).resolves({
        $metadata: {
          httpStatusCode: 200,
          requestId: undefined,
          extendedRequestId: undefined,
          cfId: undefined,
          attempts: 1,
          totalRetryDelay: 0
        },
        Body: body
      })

      const event = {
        pathParameters: {
          id: 'mock-id',
          providerId: 'MMT-1'
        }
      }

      const response = await getTemplates(event)

      expect(response.statusCode).toBe(200)

      expect(JSON.parse(response.body)[0]).toEqual(expect.objectContaining({
        id: '460bfd33-cad3-46f8-9eee-47664f98038c',
        name: 'Test Template 1',
        lastModified: '2024-04-02T19:18:11.000Z',
        providerId: 'MMT-1'
      }))

      expect(JSON.parse(response.body)[1]).toEqual(expect.objectContaining({
        id: '34a25a4d-da4e-4ffd-b374-beae7978f689',
        name: 'Test Template 2',
        lastModified: '2024-04-01T19:18:11.000Z',
        providerId: 'MMT-1'
      }))

      expect(listObjectsMock).toHaveBeenCalledTimes(1)
      expect(listObjectsMock).toHaveBeenCalledWith(expect.any(Object))
    })
  })

  describe('when the objects are not found', () => {
    test('does not return an item', async () => {
      const listObjectsMock = vi.spyOn(s3ListObjects, 's3ListObjects').mockResolvedValue([])

      const event = {
        pathParameters: {
          providerId: 'MMT-1'
        }
      }

      const response = await getTemplates(event)

      expect(response.statusCode).toBe(200)
      expect(response.body).toBe(JSON.stringify([]))

      expect(listObjectsMock).toHaveBeenCalledTimes(1)
      expect(listObjectsMock).toHaveBeenCalledWith(expect.any(Object))
    })
  })
})
