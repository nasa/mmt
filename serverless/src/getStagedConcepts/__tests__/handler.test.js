import { s3ListObjects } from '../../utils/s3ListObjects'
import getStagedConcepts from '../handler'

vi.mock('../../utils/s3ListObjects', () => ({
  s3ListObjects: vi.fn()
}))

beforeEach(() => {
  vi.clearAllMocks()
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('getStagedConcepts', () => {
  test('retrieves a list of concepts from s3, most recently staged first', async () => {
    s3ListObjects.mockResolvedValue([
      {
        Key: 'collections/record-a',
        LastModified: '2024-01-01T00:00:00.000Z'
      },
      {
        Key: 'collections/record-c',
        LastModified: '2024-01-03T00:00:00.000Z'
      },
      {
        Key: 'collections/record-b',
        LastModified: '2024-01-02T00:00:00.000Z'
      }
    ])

    const event = {
      pathParameters: {
        conceptType: 'collections'
      }
    }

    const response = await getStagedConcepts(event)

    expect(response.statusCode).toBe(200)

    expect(JSON.parse(response.body)).toEqual([
      {
        conceptType: 'collections',
        lastModified: '2024-01-03T00:00:00.000Z',
        recordId: 'record-c'
      },
      {
        conceptType: 'collections',
        lastModified: '2024-01-02T00:00:00.000Z',
        recordId: 'record-b'
      },
      {
        conceptType: 'collections',
        lastModified: '2024-01-01T00:00:00.000Z',
        recordId: 'record-a'
      }
    ])

    expect(s3ListObjects.mock.calls[0][1]).toBe('collections/')
  })

  describe('when pathParameters is missing', () => {
    test('returns a status code 400', async () => {
      const response = await getStagedConcepts({})

      expect(response.statusCode).toBe(400)
    })
  })

  describe('when the conceptType is invalid', () => {
    test('returns a status code 400', async () => {
      const event = {
        pathParameters: {
          conceptType: 'invalid-type'
        }
      }

      const response = await getStagedConcepts(event)

      expect(response.statusCode).toBe(400)
    })
  })

  describe('when listing objects in s3 throws an error', () => {
    test('returns a status code 404', async () => {
      s3ListObjects.mockRejectedValue(new Error('S3 error'))

      const event = {
        pathParameters: {
          conceptType: 'collections'
        }
      }

      const response = await getStagedConcepts(event)

      expect(response.statusCode).toBe(404)
    })
  })

  describe('when there are no staged concepts', () => {
    test('returns an empty array', async () => {
      s3ListObjects.mockResolvedValue([])

      const event = {
        pathParameters: {
          conceptType: 'collections'
        }
      }

      const response = await getStagedConcepts(event)

      expect(response.statusCode).toBe(200)
      expect(JSON.parse(response.body)).toEqual([])
    })
  })
})
