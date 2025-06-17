import { getS3Client } from '../getS3Client'

describe('getS3Client', () => {
  test('returns a new S3Client', async () => {
    const result = getS3Client()

    expect(result.config).toEqual(expect.objectContaining({
      forcePathStyle: true,
      endpoint: undefined
    }))
  })

  describe('when in offline mode', () => {
    test('returns a new S3Client', async () => {
      process.env.IS_OFFLINE = true
      const result = getS3Client()

      expect(result.config).toEqual(expect.objectContaining({
        forcePathStyle: true
      }))

      const credentials = await result.config.credentials()
      expect(credentials).toEqual({
        accessKeyId: 'S3RVER',
        secretAccessKey: 'S3RVER',
        $source: expect.any(Object)
      })

      const endpoint = await result.config.endpoint()
      expect(endpoint).toEqual({
        hostname: 'localhost',
        port: 4569,
        protocol: 'http:',
        path: '/',
        query: undefined
      })
    })
  })
})
