import { mockClient } from 'aws-sdk-client-mock'
import {
  PutObjectCommand,
  HeadObjectCommand,
  S3Client,
  S3ServiceException
} from '@aws-sdk/client-s3'

import updateProposal from '../handler'
import * as getConfigModule from '../../../../sharedUtils/getConfig'

const s3ClientMock = mockClient(S3Client)

let consoleErrorSpy

beforeEach(() => {
  vi.clearAllMocks()
  s3ClientMock.reset()
  consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(getConfigModule, 'getApplicationConfig').mockReturnValue({
    defaultResponseHeaders: { 'Content-Type': 'application/json' }
  })
})

afterEach(() => {
  consoleErrorSpy.mockRestore()
})

describe('updateProposal', () => {
  const validProposal = {
    id: 'test-proposal-id',
    providerId: 'test-provider-id',
    shortName: 'Test Proposal',
    entryTitle: 'Test Proposal Title',
    proposalStatus: 'DRAFT',
    requestType: 'CREATE',
    submitterId: 'test-submitter-id',
    updatedAt: '2023-05-20T12:00:00Z',
    draft: {
      lastUpdated: '2023-05-20T12:00:00Z',
      comment: 'Initial draft'
    }
  }
  test('When given a valid proposal and it exists, should update it in S3 and return success', async () => {
    s3ClientMock.on(HeadObjectCommand).resolves({})
    s3ClientMock.on(PutObjectCommand).resolves({
      $metadata: { httpStatusCode: 200 }
    })

    const event = {
      body: JSON.stringify(validProposal),
      pathParameters: { id: 'test-id' }
    }

    const response = await updateProposal(event)

    expect(response.statusCode).toBe(200)
    expect(response.headers).toEqual({ 'Content-Type': 'application/json' })
    expect(JSON.parse(response.body).message).toBe('Proposal updated successfully')
  })

  test('When proposal does not exist, should return 404', async () => {
    const notFoundError = new S3ServiceException({ name: 'NotFound' })
    notFoundError.$metadata = { httpStatusCode: 404 }
    s3ClientMock.on(HeadObjectCommand).rejects(notFoundError)

    const event = {
      body: JSON.stringify(validProposal),
      pathParameters: { id: 'test-id' }
    }

    const response = await updateProposal(event)

    expect(response.statusCode).toBe(404)
    expect(JSON.parse(response.body).message).toBe('Proposal with id test-id not found')
  })

  test('When S3 operation fails with unknown error, should return 500', async () => {
    s3ClientMock.on(HeadObjectCommand).rejects(new Error('Unknown S3 error'))

    const event = {
      body: JSON.stringify(validProposal),
      pathParameters: { id: 'test-id' }
    }

    const response = await updateProposal(event)

    expect(response.statusCode).toBe(500)
    expect(JSON.parse(response.body).message).toBe('Internal server error')
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error updating proposal:', expect.any(Error))
  })

  test('When updating a proposal, should use correct S3 bucket and key', async () => {
    s3ClientMock.on(HeadObjectCommand).resolves({})
    s3ClientMock.on(PutObjectCommand).resolves({
      $metadata: { httpStatusCode: 200 }
    })

    const event = {
      body: JSON.stringify(validProposal),
      pathParameters: { id: 'test-id' }
    }

    process.env.COLLECTION_PROPOSALS_BUCKET_NAME = 'test-bucket'

    await updateProposal(event)

    const headCall = s3ClientMock.calls()[0]
    const putCall = s3ClientMock.calls()[1]
    expect(headCall.args[0].input.Bucket).toBe('test-bucket')
    expect(headCall.args[0].input.Key).toBe('proposals/test-id')
    expect(putCall.args[0].input.Bucket).toBe('test-bucket')
    expect(putCall.args[0].input.Key).toBe('proposals/test-id')
    expect(putCall.args[0].input.Body).toBe(JSON.stringify(validProposal))
  })

  test('When S3 returns a non-200 status code, should return that status code', async () => {
    s3ClientMock.on(HeadObjectCommand).resolves({})
    s3ClientMock.on(PutObjectCommand).resolves({
      $metadata: { httpStatusCode: 403 }
    })

    const event = {
      body: JSON.stringify(validProposal),
      pathParameters: { id: 'test-id' }
    }

    const response = await updateProposal(event)

    expect(response.statusCode).toBe(403)
  })

  test('When getApplicationConfig returns custom headers, should include them in the response', async () => {
    vi.spyOn(getConfigModule, 'getApplicationConfig').mockReturnValue({
      defaultResponseHeaders: {
        'Content-Type': 'application/json',
        'Custom-Header': 'CustomValue'
      }
    })

    s3ClientMock.on(HeadObjectCommand).resolves({})
    s3ClientMock.on(PutObjectCommand).resolves({
      $metadata: { httpStatusCode: 200 }
    })

    const event = {
      body: JSON.stringify({ title: 'Test Proposal' }),
      pathParameters: { id: 'test-id' }
    }

    const response = await updateProposal(event)

    expect(response.headers).toEqual({
      'Content-Type': 'application/json',
      'Custom-Header': 'CustomValue'
    })
  })

  test('When S3 throws an error with a specific status code, should return that status code and appropriate message', async () => {
    const customError = new S3ServiceException({ name: 'CustomError' })
    customError.$metadata = { httpStatusCode: 503 }
    customError.message = 'Service Unavailable'
    s3ClientMock.on(HeadObjectCommand).rejects(customError)

    const event = {
      body: JSON.stringify(validProposal),
      pathParameters: { id: 'test-id' }
    }

    const response = await updateProposal(event)

    expect(response.statusCode).toBe(503)
    expect(JSON.parse(response.body).message).toBe('Service Unavailable')
  })

  test('When S3 throws a 500 error, should return 500 status code and a generic error message', async () => {
    const serverError = new S3ServiceException({ name: 'InternalServerError' })
    serverError.$metadata = { httpStatusCode: 500 }
    serverError.message = 'Internal Server Error'
    s3ClientMock.on(HeadObjectCommand).rejects(serverError)

    const event = {
      body: JSON.stringify(validProposal),
      pathParameters: { id: 'test-id' }
    }

    const response = await updateProposal(event)

    expect(response.statusCode).toBe(500)
    expect(JSON.parse(response.body).message).toBe('Internal server error')
  })

  test('When S3 throws an error without a message, should use default error message', async () => {
    const errorWithoutMessage = new S3ServiceException({ name: 'CustomError' })
    delete errorWithoutMessage.message // Ensure there's no message property
    errorWithoutMessage.$metadata = { httpStatusCode: 400 }
    s3ClientMock.on(HeadObjectCommand).rejects(errorWithoutMessage)

    const event = {
      body: JSON.stringify(validProposal),
      pathParameters: { id: 'test-id' }
    }

    const response = await updateProposal(event)

    expect(response.statusCode).toBe(400)
    expect(JSON.parse(response.body).message).toBe('Internal server error')
  })

  test('When event is missing body, should return 400', async () => {
    const event = {
      pathParameters: { id: 'test-id' }
    }

    const response = await updateProposal(event)

    expect(response.statusCode).toBe(400)
    expect(JSON.parse(response.body).message).toBe('Missing request body')
  })

  test('When event body contains invalid JSON, should return 400', async () => {
    const event = {
      body: '{ "title": "Test Proposal" ', // Note the missing closing brace
      pathParameters: { id: 'test-id' }
    }

    const response = await updateProposal(event)

    expect(response.statusCode).toBe(400)
    expect(JSON.parse(response.body).message).toBe('Invalid JSON in request body')
  })

  test('When event body is an empty object, should return 400', async () => {
    const event = {
      body: 'null',
      pathParameters: { id: 'test-id' }
    }

    const response = await updateProposal(event)

    expect(response.statusCode).toBe(400)
    expect(JSON.parse(response.body).message).toBe('Missing request body')
  })
})
