import { DeleteObjectCommand } from '@aws-sdk/client-s3'

import { getApplicationConfig } from '../../../sharedUtils/getConfig'
import { getS3Client } from '../utils/getS3Client'
import { getCollectionTemplatesBucketName } from '../utils/getCollectionTemplatesBucketName'
import { s3ListObjects } from '../utils/s3ListObjects'
import fetchProviders from '../utils/fetchProviders'

let s3Client

/**
 * Delete a template to S3
 * @param {Object} event Details about the HTTP request that it received
 */
const deleteTemplate = async (event) => {
  const { defaultResponseHeaders } = getApplicationConfig()

  const collectionTemplatesBucketName = getCollectionTemplatesBucketName()

  if (s3Client == null) {
    s3Client = getS3Client()
  }

  const { pathParameters } = event
  const { id, providerId } = pathParameters

  try {
    const providerIds = await fetchProviders(event)

    if (!providerIds.includes(providerId)) {
      console.error(`Missing permissions for provider "${providerId}"`)

      return {
        statusCode: 401,
        headers: defaultResponseHeaders
      }
    }
  } catch (error) {
    console.log('Error fetching providers:', error)

    return {
      statusCode: 500,
      headers: defaultResponseHeaders
    }
  }

  // Find an existing file with the same `id`
  const prefix = `${providerId}/${id}`
  const objectList = await s3ListObjects(s3Client, prefix)
  const [object] = objectList

  let statusCode = 404
  if (object) {
    const { Key: key } = object

    // Delete the file
    const deleteCommand = new DeleteObjectCommand({
      Bucket: collectionTemplatesBucketName,
      Key: key
    })

    const response = await s3Client.send(deleteCommand)

    const { $metadata: metadata } = response;
    ({ httpStatusCode: statusCode } = metadata)
  }

  return {
    statusCode,
    headers: defaultResponseHeaders
  }
}

export default deleteTemplate
