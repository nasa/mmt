import { mockClient } from 'aws-sdk-client-mock'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { sdkStreamMixin } from '@smithy/util-stream'

import getTemplate from '../handler'
import * as s3ListObjects from '../../utils/s3ListObjects'

const s3ClientMock = mockClient(S3Client)

beforeEach(() => {
  s3ClientMock.reset()
})

describe('getTemplate', () => {
  describe('when the object is found', () => {
    test('returns the template from s3', async () => {
      const listObjectsMock = vi.spyOn(s3ListObjects, 's3ListObjects').mockResolvedValue([{
        Key: 'MMT-1/mock-id'
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
          id: 'mock-id'
        }
      }

      const response = await getTemplate(event)
      const result = JSON.parse(response.body)

      expect(response.statusCode).toBe(200)

      expect(result.template).toEqual(expect.objectContaining({
        Mock: 'Template'
      }))

      expect(result.providerId).toEqual('MMT-1')

      expect(listObjectsMock).toHaveBeenCalledTimes(1)
      expect(listObjectsMock).toHaveBeenCalledWith(expect.any(Object))
    })
  })

  describe('when the object is not found', () => {
    test('returns a status code 404', async () => {
      const listObjectsMock = vi.spyOn(s3ListObjects, 's3ListObjects').mockResolvedValue([])
      const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => {})

      const event = {
        pathParameters: {
          id: 'mock-id'
        }
      }

      const response = await getTemplate(event)

      expect(response.statusCode).toBe(404)

      expect(listObjectsMock).toHaveBeenCalledTimes(1)
      expect(listObjectsMock).toHaveBeenCalledWith(expect.any(Object))

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('getTemplate Error:', expect.any(Object))
    })
  })
})
