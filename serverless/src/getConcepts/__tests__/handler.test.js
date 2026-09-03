import { s3ListObjects } from '../../utils/s3ListObjects'
import getConcepts from '../handler'

vi.mock('../../utils/s3ListObjects', () => ({
  s3ListObjects: vi.fn()
}))

const validStagingHeaders = {
  Authorization: 'Bearer ABC-1',
  'Staging-Api-Key': 'test-staging-key'
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})

  process.env.STAGING_API_KEY = 'test-staging-key'
})

describe('getConcepts', () => {
  test('retrieves a sorted list of concepts from s3', async () => {
    s3ListObjects.mockResolvedValue([
      {
        Key: 'MMT_1/collections/Zebra.json',
        LastModified: '2024-01-02T00:00:00.000Z'
      },
      {
        Key: 'MMT_1/collections/Apple.json',
        LastModified: '2024-01-01T00:00:00.000Z'
      }
    ])

    const event = {
      headers: validStagingHeaders,
      pathParameters: {
        conceptType: 'collections',
        providerId: 'MMT_1'
      }
    }

    const response = await getConcepts(event)

    expect(response.statusCode).toBe(200)

    expect(JSON.parse(response.body)).toEqual([
      {
        conceptType: 'collections',
        lastModified: '2024-01-01T00:00:00.000Z',
        nativeId: 'Apple',
        providerId: 'MMT_1'
      },
      {
        conceptType: 'collections',
        lastModified: '2024-01-02T00:00:00.000Z',
        nativeId: 'Zebra',
        providerId: 'MMT_1'
      }
    ])
  })

  describe('when STAGING_API_KEY is not configured in the environment', () => {
    test('returns a status code 401 even when no header is sent', async () => {
      delete process.env.STAGING_API_KEY

      const event = {
        headers: {
          Authorization: 'Bearer ABC-1'
        // No Staging-Api-Key header sent at all
        },
        pathParameters: {
          conceptType: 'collections',
          providerId: 'MMT_1'
        }
      }

      const response = await getConcepts(event)

      expect(response.statusCode).toBe(401)
      expect(s3ListObjects).not.toHaveBeenCalled()
    })
  })

  describe('when the Staging-Api-Key header is missing', () => {
    test('returns a status code 401', async () => {
      const event = {
        headers: {
          Authorization: 'Bearer ABC-1'
        },
        pathParameters: {
          conceptType: 'collections',
          providerId: 'MMT_1'
        }
      }

      const response = await getConcepts(event)

      expect(response.statusCode).toBe(401)
      expect(s3ListObjects).not.toHaveBeenCalled()
    })
  })

  describe('when the Prod-Staging-Api-Key header does not match', () => {
    test('returns a status code 401', async () => {
      const event = {
        headers: {
          Authorization: 'Bearer ABC-1',
          'Staging-Api-Key': 'wrong-key'
        },
        pathParameters: {
          conceptType: 'collections',
          providerId: 'MMT_1'
        }
      }

      const response = await getConcepts(event)

      expect(response.statusCode).toBe(401)
      expect(s3ListObjects).not.toHaveBeenCalled()
    })
  })

  describe('when the Prod-Staging-Api-Key header has different casing', () => {
    test('is still accepted (case-insensitive lookup)', async () => {
      s3ListObjects.mockResolvedValue([])

      const event = {
        headers: {
          Authorization: 'Bearer ABC-1',
          'staging-api-key': 'test-staging-key'
        },
        pathParameters: {
          conceptType: 'collections',
          providerId: 'MMT_1'
        }
      }

      const response = await getConcepts(event)

      expect(response.statusCode).toBe(200)
    })
  })

  describe('when pathParameters is missing', () => {
    test('returns a status code 400', async () => {
      const event = {
        headers: validStagingHeaders
      }

      const response = await getConcepts(event)

      expect(response.statusCode).toBe(400)
    })
  })

  describe('when the conceptType is invalid', () => {
    test('returns a status code 400', async () => {
      const event = {
        headers: validStagingHeaders,
        pathParameters: {
          conceptType: 'invalid-type',
          providerId: 'MMT_1'
        }
      }

      const response = await getConcepts(event)

      expect(response.statusCode).toBe(400)
    })
  })

  describe('when you do not have authorization to list', () => {
    test('returns a status code 404', async () => {
      const event = {
        headers: validStagingHeaders,
        pathParameters: {
          conceptType: 'collections',
          providerId: 'MMT_3'
        }
      }

      const response = await getConcepts(event)

      expect(response.statusCode).toBe(404)
      expect(s3ListObjects).not.toHaveBeenCalled()
    })
  })

  describe('when fetching providers throws an error', () => {
    test('returns a status code 404', async () => {
      const event = {
        headers: {
          ...validStagingHeaders,
          Authorization: 'Bearer invalid_token'
        },
        pathParameters: {
          conceptType: 'collections',
          providerId: 'MMT_1'
        }
      }

      const response = await getConcepts(event)

      expect(response.statusCode).toBe(404)
    })
  })

  describe('when listing objects in s3 throws an error', () => {
    test('returns a status code 404', async () => {
      s3ListObjects.mockRejectedValue(new Error('S3 error'))

      const event = {
        headers: validStagingHeaders,
        pathParameters: {
          conceptType: 'collections',
          providerId: 'MMT_1'
        }
      }

      const response = await getConcepts(event)

      expect(response.statusCode).toBe(404)
    })
  })

  describe('when there are no concepts for the provider', () => {
    test('returns an empty array', async () => {
      s3ListObjects.mockResolvedValue([])

      const event = {
        headers: validStagingHeaders,
        pathParameters: {
          conceptType: 'collections',
          providerId: 'MMT_1'
        }
      }

      const response = await getConcepts(event)

      expect(response.statusCode).toBe(200)
      expect(JSON.parse(response.body)).toEqual([])
    })
  })
})
