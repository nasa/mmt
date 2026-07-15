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
        Key: 'MMT_1/mock-id'
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
        headers: {
          Authorization: 'Bearer ABC-1'
        },
        pathParameters: {
          id: 'mock-id',
          providerId: 'MMT_1'
        }
      }

      const response = await getTemplate(event)

      expect(response.statusCode).toBe(200)

      const result = JSON.parse(response.body)

      expect(result.template).toEqual(expect.objectContaining({
        Mock: 'Template'
      }))

      expect(result.providerId).toEqual('MMT_1')

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

  describe('when you do not have authorization to get', () => {
    test('returns a status code 401', async () => {
      const listObjectsMock = vi.spyOn(s3ListObjects, 's3ListObjects').mockResolvedValue([{
        Key: 'MMT_3/mock-id'
      }])

      const event = {
        headers: {
          Authorization: 'Bearer ABC-1'
        },
        pathParameters: {
          id: 'mock-id'
        }
      }

      const response = await getTemplate(event)

      expect(response.statusCode).toBe(401)

      expect(listObjectsMock).toHaveBeenCalledTimes(1)
    })
  })
})
