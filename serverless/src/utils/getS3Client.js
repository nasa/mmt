import { S3Client } from '@aws-sdk/client-s3'

/**
 * Returns an S3 Client instance
 */
export const getS3Client = () => {
  const config = {
    forcePathStyle: true
  }

  if (process.env.IS_OFFLINE) {
    config.endpoint = 'http://localhost:4569'
    config.credentials = {
      accessKeyId: 'S3RVER', // This specific key is required when working offline
      secretAccessKey: 'S3RVER'
    }
  }

  return new S3Client(config)
}
