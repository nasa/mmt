import { mockClient } from 'aws-sdk-client-mock'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

import createProposal from '../handler'

const s3ClientMock = mockClient(S3Client)

let consoleErrorSpy

beforeEach(() => {
  vi.clearAllMocks()
  s3ClientMock.reset()
  consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  consoleErrorSpy.mockRestore()
})

describe('createProposal', () => {
  test('When given a valid proposal, should save it to S3 and return success', async () => {
    s3ClientMock.on(PutObjectCommand).resolves({
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
      body: {
        id: 'test-proposal-id',
        title: 'Test Proposal',
        content: 'This is a test proposal'
      }
    }

    const response = await createProposal(event)

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body)).toEqual({ id: 'test-proposal-id' })
  })

  test('When S3 client is not initialized, should create a new S3 client', async () => {
    s3ClientMock.on(PutObjectCommand).resolves({
      $metadata: { httpStatusCode: 200 }
    })

    const event = {
      body: {
        id: 'test-proposal-id',
        title: 'Test Proposal',
        content: 'This is a test proposal'
      }
    }

    await createProposal(event)
    await createProposal(event)

    expect(s3ClientMock.calls()).toHaveLength(2)
  })

  test('When S3 operation fails, should return the error status code', async () => {
    s3ClientMock.on(PutObjectCommand).rejects(new Error('S3 operation failed'))

    const event = {
      body: {
        id: 'test-proposal-id',
        title: 'Test Proposal',
        content: 'This is a test proposal'
      }
    }

    const response = await createProposal(event)

    expect(response.statusCode).toBe(500)
  })

  test('When proposal is saved, should use correct S3 bucket and key', async () => {
    s3ClientMock.on(PutObjectCommand).resolves({
      $metadata: { httpStatusCode: 200 }
    })

    const event = {
      body: {
        id: 'test-proposal-id',
        title: 'Test Proposal',
        content: 'This is a test proposal'
      }
    }

    process.env.COLLECTION_PROPOSALS_BUCKET_NAME = 'test-bucket'

    await createProposal(event)

    const call = s3ClientMock.calls()[0]
    const { input } = call.args[0]
    expect(input.Bucket).toBe('test-bucket')
    expect(input.Key).toBe('proposals/test-proposal-id')
    expect(JSON.parse(input.Body)).toEqual(event.body)
  })

  test('When S3 operation fails with a custom error message, should return that message', async () => {
    const customErrorMessage = 'Custom S3 error occurred'
    s3ClientMock.on(PutObjectCommand).rejects(new Error(customErrorMessage))

    const event = {
      body: {
        id: 'test-proposal-id',
        title: 'Test Proposal',
        content: 'This is a test proposal'
      }
    }

    const response = await createProposal(event)

    expect(response.statusCode).toBe(500)
    expect(JSON.parse(response.body)).toEqual({ message: customErrorMessage })
  })

  test('When S3 operation fails without a custom error message, should return default error message', async () => {
    s3ClientMock.on(PutObjectCommand).rejects(new Error())

    const event = {
      body: {
        id: 'test-proposal-id',
        title: 'Test Proposal',
        content: 'This is a test proposal'
      }
    }

    const response = await createProposal(event)

    expect(response.statusCode).toBe(500)
    expect(JSON.parse(response.body)).toEqual({ message: 'Internal server error' })
  })
})
