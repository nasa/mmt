import { getCollectionTemplatesBucketName } from '../getCollectionTemplatesBucketName'

describe('getCollectionTemplatesBucketName', () => {
  test('returns the default when offline', () => {
    process.env.IS_OFFLINE = true
    const bucketName = getCollectionTemplatesBucketName()

    expect(bucketName).toMatchObject('mmt-template-bucket-local')
  })
})
