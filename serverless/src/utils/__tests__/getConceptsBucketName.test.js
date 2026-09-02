import { getConceptsBucketName } from '../getConceptsBucketName'

describe('getConceptsBucketName', () => {
  test('returns the default when offline', () => {
    process.env.IS_OFFLINE = true
    const bucketName = getConceptsBucketName()

    expect(bucketName).toBe('mmt-staging-concepts-bucket-local')
  })
})
