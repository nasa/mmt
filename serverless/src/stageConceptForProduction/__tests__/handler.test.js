import stageConceptForProduction from '../handler'

const validEvent = {
  body: JSON.stringify({
    ShortName: 'Test',
    Version: '1'
  }),
  headers: {
    Authorization: 'Bearer ABC-1'
  },
  pathParameters: {
    conceptType: 'collections',
    providerId: 'MMT_1'
  }
}

const mockProductionResponse = (overrides = {}) => ({
  ok: true,
  status: 200,
  json: () => Promise.resolve({
    conceptType: 'collections',
    recordId: 'prod-record-1'
  }),
  ...overrides
})

beforeEach(() => {
  vi.clearAllMocks()
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})

  process.env.STAGING_TARGET_API_HOST = 'https://prod.example.com/prod'
  process.env.STAGING_TARGET_MMT_HOST = 'https://mmt.example.com'
  process.env.STAGING_TARGET_API_KEY = 'prod-staging-key'
})

describe('stageConceptForProduction', () => {
  test('forwards the metadata to production and returns a production link', async () => {
    global.fetch = vi.fn(() => Promise.resolve(mockProductionResponse()))

    const response = await stageConceptForProduction(validEvent)

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body)).toEqual({
      conceptType: 'collections',
      recordId: 'prod-record-1',
      productionUrl: 'https://mmt.example.com/staged/collections/prod-record-1'
    })

    expect(global.fetch).toHaveBeenCalledWith(
      'https://prod.example.com/prod/staged/collections',
      expect.objectContaining({
        method: 'PUT',
        headers: expect.objectContaining({ 'Staging-Api-Key': 'prod-staging-key' }),
        body: validEvent.body
      })
    )
  })

  describe('when the conceptType is invalid', () => {
    test('returns a status code 400', async () => {
      const response = await stageConceptForProduction({
        ...validEvent,
        pathParameters: {
          ...validEvent.pathParameters,
          conceptType: 'invalid-type'
        }
      })

      expect(response.statusCode).toBe(400)
    })
  })

  describe('when the request body is missing', () => {
    test('returns a status code 400', async () => {
      const response = await stageConceptForProduction({
        ...validEvent,
        body: undefined
      })

      expect(response.statusCode).toBe(400)
    })
  })

  describe('when the user is not authorized for the provider', () => {
    test('returns a status code 403', async () => {
      const response = await stageConceptForProduction({
        ...validEvent,
        pathParameters: {
          ...validEvent.pathParameters,
          providerId: 'MMT_3'
        }
      })

      expect(response.statusCode).toBe(403)
    })
  })

  describe('when fetching providers throws an error', () => {
    test('returns a status code 500', async () => {
      const response = await stageConceptForProduction({
        ...validEvent,
        headers: { Authorization: 'Bearer invalid_token' }
      })

      expect(response.statusCode).toBe(500)
    })
  })

  describe('when no staging target is configured', () => {
    test('returns a status code 500', async () => {
      delete process.env.STAGING_TARGET_API_HOST

      const response = await stageConceptForProduction(validEvent)

      expect(response.statusCode).toBe(500)
    })
  })

  describe('when the staging target rejects the request', () => {
    test('returns a status code 502', async () => {
      global.fetch = vi.fn(() => Promise.resolve(mockProductionResponse({
        ok: false,
        status: 401
      })))

      const response = await stageConceptForProduction(validEvent)

      expect(response.statusCode).toBe(502)
      expect(JSON.parse(response.body)).toEqual({
        error: 'Staging target rejected the request with status 401'
      })
    })
  })

  describe('when the forward call throws', () => {
    test('returns a status code 502', async () => {
      global.fetch = vi.fn(() => Promise.reject(new Error('Network down')))

      const response = await stageConceptForProduction(validEvent)

      expect(response.statusCode).toBe(502)
      expect(JSON.parse(response.body)).toEqual({ error: 'Error: Network down' })
    })
  })
})
