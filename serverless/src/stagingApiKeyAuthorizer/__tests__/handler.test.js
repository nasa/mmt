import stagingApiKeyAuthorizer from '../handler'

const methodArn = 'arn:aws:execute-api:us-east-1:123456789012:api-id/stage/PUT/staged/collections'

describe('stagingApiKeyAuthorizer', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }
    delete process.env.IS_OFFLINE

    vi.spyOn(console, 'error').mockImplementation(() => {})

    process.env.STAGING_SECRET_API_KEY = 'test-staging-key'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('when running offline', () => {
    test('returns an Allow policy without checking the key', async () => {
      process.env.IS_OFFLINE = 'true'
      delete process.env.STAGING_SECRET_API_KEY

      const response = await stagingApiKeyAuthorizer({
        headers: {},
        methodArn
      })

      expect(response).toEqual({
        principalId: 'offline',
        policyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Effect: 'Allow',
              Resource: methodArn
            }
          ]
        }
      })
    })
  })

  describe('when the Staging-Api-Key header matches', () => {
    test('returns an Allow policy', async () => {
      const response = await stagingApiKeyAuthorizer({
        headers: { 'Staging-Api-Key': 'test-staging-key' },
        methodArn
      })

      expect(response).toEqual({
        principalId: 'staging-api-client',
        policyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Effect: 'Allow',
              Resource: methodArn
            }
          ]
        }
      })
    })

    test('is accepted regardless of header casing', async () => {
      const response = await stagingApiKeyAuthorizer({
        headers: { 'staging-api-key': 'test-staging-key' },
        methodArn
      })

      expect(response.principalId).toBe('staging-api-client')
    })
  })

  describe('when the Staging-Api-Key header is missing', () => {
    test('throws Unauthorized', async () => {
      await expect(
        stagingApiKeyAuthorizer({
          headers: {},
          methodArn
        })
      ).rejects.toThrow('Unauthorized')
    })
  })

  describe('when the Staging-Api-Key header does not match', () => {
    test('throws Unauthorized', async () => {
      await expect(
        stagingApiKeyAuthorizer({
          headers: { 'Staging-Api-Key': 'wrong-key' },
          methodArn
        })
      ).rejects.toThrow('Unauthorized')
    })
  })

  describe('when STAGING_SECRET_API_KEY is not configured in the environment', () => {
    test('throws Unauthorized even when the header matches an empty value', async () => {
      delete process.env.STAGING_SECRET_API_KEY

      await expect(
        stagingApiKeyAuthorizer({
          headers: {},
          methodArn
        })
      ).rejects.toThrow('Unauthorized')
    })
  })
})
