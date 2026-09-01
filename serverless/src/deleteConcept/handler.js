import { DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'

import { getApplicationConfig } from '../../../sharedUtils/getConfig'
import { getS3Client } from '../utils/getS3Client'
import { getConceptsBucketName } from '../utils/getConceptsBucketName'
import { s3ConceptTypes } from '../../../sharedConstants/s3ConceptTypes'
import fetchProviders from '../utils/fetchProviders'

let s3Client

/**
 * Delete a concept from S3
 * @param {Object} event Details about the HTTP request that it received
 */
const deleteConcept = async (event) => {
  const { defaultResponseHeaders } = getApplicationConfig()

  if (s3Client == null) {
    s3Client = getS3Client()
  }

  const { pathParameters } = event
  const { conceptType, nativeId, providerId } = pathParameters

  if (!s3ConceptTypes.includes(conceptType)) {
    console.error(`Invalid conceptType "${conceptType}"`)

    return {
      statusCode: 400,
      headers: defaultResponseHeaders
    }
  }

  try {
    const providerIds = await fetchProviders(event)

    if (!providerIds.includes(providerId)) {
      console.error(`Missing permissions for provider "${providerId}"`)

      return {
        statusCode: 401,
        headers: defaultResponseHeaders
      }
    }

    // S3 directory structure: s3BucketName/providerId/conceptType/nativeId.json
    const key = `${providerId}/${conceptType}/${nativeId}.json`
    const conceptsBucketName = getConceptsBucketName()

    // DeleteObject is idempotent and won't error on a missing key, so check existence first
    try {
      await s3Client.send(new HeadObjectCommand({
        Bucket: conceptsBucketName,
        Key: key
      }))
    } catch (headError) {
      console.error(`Concept not found for key "${key}"`, headError)

      return {
        statusCode: 404,
        headers: defaultResponseHeaders
      }
    }

    // Delete the file from S3
    const deleteCommand = new DeleteObjectCommand({
      Bucket: conceptsBucketName,
      Key: key
    })

    const response = await s3Client.send(deleteCommand)

    const { $metadata: metadata } = response

    const { httpStatusCode: statusCode } = metadata

    return {
      statusCode,
      headers: defaultResponseHeaders
    }
  } catch (error) {
    console.log('deleteConcept Error:', error)

    return {
      statusCode: 404,
      headers: defaultResponseHeaders
    }
  }
}

export default deleteConcept
