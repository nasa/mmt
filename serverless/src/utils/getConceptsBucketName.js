/**
 * Returns the concepts bucket name
 */
export const getConceptsBucketName = () => {
  if (process.env.IS_OFFLINE) {
    return 'mmt-concepts-bucket-local'
  }

  return process.env.CONCEPTS_BUCKET_NAME
}
