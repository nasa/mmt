import { ListObjectsV2Command } from '@aws-sdk/client-s3'

/**
 * Retrieves a list of objects from an S3 bucket using the specified prefix
 * @param {Object} params - The parameters for the function
 * @param {Object} params.s3Client - S3 Client instance
 * @param {String} params.bucketName - Name of the S3 bucket
 * @param {String} params.prefix - Prefix used to filter objects in S3
 * @returns {Promise<Array>} - A promise that resolves to an array of S3 object contents
 */
export const s3BucketContents = async ({ s3Client, bucketName, prefix = '' }) => {
  const s3Command = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: prefix
  })

  const response = await s3Client.send(s3Command)
  const { Contents: s3Contents = [] } = response

  return s3Contents
}
