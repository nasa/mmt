import { mockClient } from 'aws-sdk-client-mock'
import {
  DeleteObjectCommand,
  HeadObjectCommand,
  S3Client,
  S3ServiceException
} from '@aws-sdk/client-s3'

import deleteProposal from '../handler'
import * as getConfigModule from '../../../../sharedUtils/getConfig'
import * as getS3ClientModule from '../../utils/getS3Client'

const s3ClientMock = mockClient(S3Client)

let consoleErrorSpy

beforeEach(() => {
  vi.clearAllMocks()
  s3ClientMock.reset()
  consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(getConfigModule, 'getApplicationConfig').mockReturnValue({ defaultResponseHeaders: {} })
  vi.spyOn(getS3ClientModule, 'getS3Client').mockReturnValue(s3ClientMock)
})

afterEach(() => {
  consoleErrorSpy.mockRestore()
})

describe('deleteProposal', () => {
  test('When given a valid proposal ID, should delete it from S3 and return success', async () => {
    s3ClientMock.on(HeadObjectCommand).resolves({})
    s3ClientMock.on(DeleteObjectCommand).resolves({
      $metadata: { httpStatusCode: 204 }
    })

    const event = {
      pathParameters: { id: 'test-id' }
    }

    const response = await deleteProposal(event)

    expect(response.statusCode).toBe(204)
    expect(JSON.parse(response.body)).toEqual({ message: 'Proposal deleted successfully' })
  })

  test('When proposal does not exist, should return 404', async () => {
    s3ClientMock.on(HeadObjectCommand).rejects(new S3ServiceException({ name: 'NotFound' }))

    const event = {
      pathParameters: { id: 'non-existent-id' }
    }

    const response = await deleteProposal(event)

    expect(response.statusCode).toBe(404)
    expect(JSON.parse(response.body)).toEqual({ message: 'Proposal with id non-existent-id not found' })
  })

  test('When S3 delete operation fails, should return 500', async () => {
    s3ClientMock.on(HeadObjectCommand).resolves({})
    s3ClientMock.on(DeleteObjectCommand).rejects(new Error('S3 operation failed'))

    const event = {
      pathParameters: { id: 'test-id' }
    }

    const response = await deleteProposal(event)

    expect(response.statusCode).toBe(500)
    expect(JSON.parse(response.body)).toEqual({ message: 'Internal server error' })
  })

  test('When deleting a proposal, should use correct S3 bucket and key', async () => {
    s3ClientMock.on(HeadObjectCommand).resolves({})
    s3ClientMock.on(DeleteObjectCommand).resolves({
      $metadata: { httpStatusCode: 204 }
    })

    const event = {
      pathParameters: { id: 'test-id' }
    }

    process.env.COLLECTION_PROPOSALS_BUCKET_NAME = 'test-bucket'

    await deleteProposal(event)

    const headCall = s3ClientMock.calls()[0]
    const deleteCall = s3ClientMock.calls()[1]
    expect(headCall.args[0].input).toEqual({
      Bucket: 'test-bucket',
      Key: 'proposals/test-id'
    })

    expect(deleteCall.args[0].input).toEqual({
      Bucket: 'test-bucket',
      Key: 'proposals/test-id'
    })
  })

  test('When S3 head operation fails with non-NotFound error, should return 500', async () => {
    s3ClientMock.on(HeadObjectCommand).rejects(new S3ServiceException({ name: 'InternalServerError' }))

    const event = {
      pathParameters: { id: 'test-id' }
    }

    const response = await deleteProposal(event)

    expect(response.statusCode).toBe(500)
    expect(JSON.parse(response.body)).toEqual({ message: 'Internal server error' })
  })

  test('When S3 delete operation returns a non-204 status code, should return that status code', async () => {
    s3ClientMock.on(HeadObjectCommand).resolves({})
    s3ClientMock.on(DeleteObjectCommand).resolves({
      $metadata: { httpStatusCode: 403 }
    })

    const event = {
      pathParameters: { id: 'test-id' }
    }

    const response = await deleteProposal(event)

    expect(response.statusCode).toBe(403)
    expect(JSON.parse(response.body)).toEqual({ message: 'Proposal deleted successfully' })
  })

  test('When an unexpected error occurs, should return 500 with generic message', async () => {
    s3ClientMock.on(HeadObjectCommand).rejects(new Error('Unexpected error'))

    const event = {
      pathParameters: { id: 'test-id' }
    }

    const response = await deleteProposal(event)

    expect(response.statusCode).toBe(500)
    expect(JSON.parse(response.body)).toEqual({ message: 'Internal server error' })
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error deleting proposal:', expect.any(Error))
  })

  test('When S3 head operation fails with 404 status code, should return 404', async () => {
    s3ClientMock.on(HeadObjectCommand).rejects(
      new S3ServiceException({ $metadata: { httpStatusCode: 404 } })
    )

    const event = {
      pathParameters: { id: 'test-id' }
    }

    const response = await deleteProposal(event)

    expect(response.statusCode).toBe(404)
    expect(JSON.parse(response.body)).toEqual({ message: 'Proposal with id test-id not found' })
  })

  test('When S3 operation fails with non-500 status code and error message, should return that status code and message', async () => {
    const customError = new S3ServiceException({
      name: 'CustomError',
      $metadata: { httpStatusCode: 403 }
    })
    customError.message = 'Access Denied'

    s3ClientMock.on(HeadObjectCommand).rejects(customError)

    const event = {
      pathParameters: { id: 'test-id' }
    }

    const response = await deleteProposal(event)

    expect(response.statusCode).toBe(403)
    expect(JSON.parse(response.body)).toEqual({ message: 'Access Denied' })
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error deleting proposal:', customError)
  })
})
