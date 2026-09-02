import { PutObjectCommand } from '@aws-sdk/client-s3'

import { getApplicationConfig } from '../../../sharedUtils/getConfig'
import { getS3Client } from '../utils/getS3Client'
import { getConceptsBucketName } from '../utils/getConceptsBucketName'
import { s3ConceptTypes } from '../../../sharedConstants/s3ConceptTypes'
import fetchProviders from '../utils/fetchProviders'

let s3Client

/**
 * Update (overwrite) a concept in S3
 * @param {Object} event Details about the HTTP request that it received
 */
const createOrUpdateConcept = async (event) => {
  const { defaultResponseHeaders } = getApplicationConfig()
  const conceptsBucketName = getConceptsBucketName()

  if (s3Client == null) {
    s3Client = getS3Client()
  }

  const { body, pathParameters } = event
  const { conceptType, nativeId, providerId } = pathParameters

  if (!body) {
    console.error('Missing request body')

    return {
      statusCode: 400,
      headers: defaultResponseHeaders
    }
  }

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
  } catch (error) {
    console.log('Error fetching providers:', error)

    return {
      statusCode: 500,
      headers: defaultResponseHeaders
    }
  }

  try {
    // S3 directory structure: s3BucketName/providerId/conceptType/nativeId.json
    const key = `${providerId}/${conceptType}/${nativeId}.json`

    // PutObject overwrites any existing object at this key
    const putCommand = new PutObjectCommand({
      Bucket: conceptsBucketName,
      Body: body,
      Key: key
    })

    const response = await s3Client.send(putCommand)

    const { $metadata: metadata } = response
    const { httpStatusCode: statusCode } = metadata

    return {
      statusCode,
      headers: defaultResponseHeaders
    }
  } catch (error) {
    console.log('updateConcept Error:', error)

    return {
      statusCode: 404,
      headers: defaultResponseHeaders
    }
  }
}

export default createOrUpdateConcept
