import { mockClient } from 'aws-sdk-client-mock'
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'

import deleteTemplate from '../handler'
import * as s3ListObjects from '../../utils/s3ListObjects'

const s3ClientMock = mockClient(S3Client)

beforeEach(() => {
  s3ClientMock.reset()
})

describe('deleteTemplate', () => {
  describe('when the object is found', () => {
    test('deletes the template from s3', async () => {
      const listObjectsMock = vi.spyOn(s3ListObjects, 's3ListObjects').mockResolvedValue([{
        key: 'mock-key'
      }])

      s3ClientMock.on(DeleteObjectCommand).resolves({
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
        pathParameters: {
          id: 'mock-id',
          providerId: 'MMT-1'
        }
      }

      const response = await deleteTemplate(event)

      expect(response.statusCode).toBe(200)

      expect(listObjectsMock).toHaveBeenCalledTimes(1)
      expect(listObjectsMock).toHaveBeenCalledWith(expect.any(Object), 'MMT-1/mock-id')
    })
  })

  describe('when the object is not found', () => {
    test('returns a status code 404', async () => {
      const listObjectsMock = vi.spyOn(s3ListObjects, 's3ListObjects').mockResolvedValue([])

      const event = {
        pathParameters: {
          id: 'mock-id',
          providerId: 'MMT-1'
        }
      }

      const response = await deleteTemplate(event)

      expect(response.statusCode).toBe(404)

      expect(listObjectsMock).toHaveBeenCalledTimes(1)
      expect(listObjectsMock).toHaveBeenCalledWith(expect.any(Object), 'MMT-1/mock-id')
    })
  })
})
