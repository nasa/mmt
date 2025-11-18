import { ListObjectsV2Command } from '@aws-sdk/client-s3'

/**
 * Returns list of contents from an S3 ListObjectsV2Command
 * @param {Object} s3Client - S3 Client instance
 * @param {String} [prefix=''] - Prefix used to filter S3 objects
 * @param {String} [bucketName=process.env.COLLECTION_TEMPLATES_BUCKET_NAME] - Name of the S3 bucket
 * @returns {Promise<Array>} - List of S3 objects matching the prefix in the specified bucket
 */
export const s3ListObjects = async (s3Client, prefix = '', bucketName = process.env.COLLECTION_TEMPLATES_BUCKET_NAME) => {
  const s3Command = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: prefix
  })

  const response = await s3Client.send(s3Command)
  const { Contents: s3Contents = [] } = response

  return s3Contents
}
