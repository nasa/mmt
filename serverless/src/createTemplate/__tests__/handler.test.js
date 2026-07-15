import { mockClient } from 'aws-sdk-client-mock'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

import createTemplate from '../handler'

const s3ClientMock = mockClient(S3Client)

beforeEach(() => {
  vi.clearAllMocks()
  s3ClientMock.reset()
})

describe('createTemplate', () => {
  test('saves the template to s3', async () => {
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
      headers: {
        Authorization: 'Bearer ABC-1'
      },
      body: JSON.stringify({
        TemplateName: 'Test Template',
        mock: 'Template Body'
      }),
      pathParameters: {
        providerId: 'MMT_1'
      }
    }

    const response = await createTemplate(event)

    expect(response.statusCode).toBe(200)
  })

  test('it requires TemplateName to be provided', async () => {
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
      headers: {
        Authorization: 'Bearer ABC-1'
      },
      body: JSON.stringify({
        TemplateDescription: 'Test Template',
        mock: 'Template Body'
      }),
      pathParameters: {
        providerId: 'MMT_1'
      }
    }

    const response = await createTemplate(event)

    expect(response.statusCode).toBe(400)
  })

  describe('when you do not have authorization to create', () => {
    test('returns a status code 401', async () => {
      const event = {
        headers: {
          Authorization: 'Bearer ABC-1'
        },
        body: JSON.stringify({
          TemplateName: 'Test Template',
          mock: 'Template Body'
        }),
        pathParameters: {
          providerId: 'MMT_3'
        }
      }

      const response = await createTemplate(event)

      expect(response.statusCode).toBe(401)
    })
  })
})
