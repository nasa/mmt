import { getCollectionTemplatesBucketName } from '../getCollectionTemplatesBucketName'

describe('getCollectionTemplatesBucketName', () => {
  test('returns the default when offline', () => {
    process.env.IS_OFFLINE = true
    const bucketName = getCollectionTemplatesBucketName()

    expect(bucketName).toBe('mmt-template-bucket-local')
  })
})
