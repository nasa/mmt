import { s3ListObjects } from '../../utils/s3ListObjects'
import getConcepts from '../handler'

vi.mock('../../utils/s3ListObjects', () => ({
  s3ListObjects: vi.fn()
}))

beforeEach(() => {
  vi.clearAllMocks()
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
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
      headers: {
        Authorization: 'Bearer ABC-1'
      },
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

  describe('when pathParameters is missing', () => {
    test('returns a status code 400', async () => {
      const event = {
        headers: {
          Authorization: 'Bearer ABC-1'
        }
      }

      const response = await getConcepts(event)

      expect(response.statusCode).toBe(400)
    })
  })

  describe('when the conceptType is invalid', () => {
    test('returns a status code 400', async () => {
      const event = {
        headers: {
          Authorization: 'Bearer ABC-1'
        },
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
        headers: {
          Authorization: 'Bearer ABC-1'
        },
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
        headers: {
          Authorization: 'Bearer ABC-1'
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

  describe('when there are no concepts for the provider', () => {
    test('returns an empty array', async () => {
      s3ListObjects.mockResolvedValue([])

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

      expect(response.statusCode).toBe(200)
      expect(JSON.parse(response.body)).toEqual([])
    })
  })
})
