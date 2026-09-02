/**
 * Returns the concepts bucket name
 */
export const getConceptsBucketName = () => {
  if (process.env.IS_OFFLINE) {
    return 'mmt-staging-concepts-bucket-local'
  }

  return process.env.STAGING_CONCEPTS_BUCKET_NAME
}
