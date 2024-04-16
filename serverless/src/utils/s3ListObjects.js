import { ListObjectsV2Command } from '@aws-sdk/client-s3'

/**
 * Returns list of contents from an S3 ListObjectsV2Command
 * @param {Object} s3Client S3 Client instance
 * @param {String} prefix Prefix used to search S3
 */
export const s3ListObjects = async (s3Client, prefix) => {
  const { COLLECTION_TEMPLATES_BUCKET_NAME: collectionTemplatesBucketName } = process.env

  const s3Command = new ListObjectsV2Command({
    Bucket: collectionTemplatesBucketName,
    Prefix: prefix
  })

  const response = await s3Client.send(s3Command)
  const { Contents: s3Contents = [] } = response

  return s3Contents
}
