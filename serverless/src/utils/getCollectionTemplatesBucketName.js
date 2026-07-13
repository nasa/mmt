/**
 * Returns the collection templates bucket name
 */
export const getCollectionTemplatesBucketName = () => {
  if (process.env.IS_OFFLINE) {
    return 'mmt-template-bucket-local'
  }

  return process.env.COLLECTION_TEMPLATES_BUCKET_NAME
}
