import { PutObjectCommand } from '@aws-sdk/client-s3'

import { getApplicationConfig } from '../../../sharedUtils/getConfig'
import { getS3Client } from '../utils/getS3Client'
import { getConceptsBucketName } from '../utils/getConceptsBucketName'
import { s3ConceptTypes } from '../../../sharedConstants/s3ConceptTypes'
import { safeCompareSecret } from '../utils/safeCompareSecret'

let s3Client

/**
 * Update (overwrite) a concept in S3
 *
 * This is a machine-to-machine endpoint. In deployed environments API Gateway
 * runs the `stagingApiKeyAuthorizer` in front of it; the in-handler
 * `Staging-Api-Key` check below is kept because the local API runner
 * (bin/api.mjs) does not invoke authorizers, so it is the only auth layer
 * locally. Callers are trusted to be authorized for `providerId` (the MMT UAT
 * forwarding Lambda performs the per-user provider check before forwarding).
 * @param {Object} event Details about the HTTP request that it received
 */
const createOrUpdateConcept = async (event) => {
  const { defaultResponseHeaders } = getApplicationConfig()
  const conceptsBucketName = getConceptsBucketName()

  if (s3Client == null) {
    s3Client = getS3Client()
  }

  const { body, headers, pathParameters } = event
  const { conceptType, nativeId, providerId } = pathParameters

  // Header casing isn't guaranteed by API Gateway/Lambda proxy integration,
  // so look up 'Staging-Api-Key' case-insensitively
  const stagingApiKeyHeader = Object.entries(headers || {})
    .find(([headerName]) => headerName.toLowerCase() === 'staging-api-key')

  const [, stagingApiKey] = stagingApiKeyHeader || []

  if (!safeCompareSecret(stagingApiKey, process.env.STAGING_API_KEY)) {
    console.error('Missing or invalid Staging-Api-Key header')

    return {
      statusCode: 401,
      headers: defaultResponseHeaders
    }
  }

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
      headers: defaultResponseHeaders,
      // Return the identifying tuple so the caller can build a deep link
      body: JSON.stringify({
        conceptType,
        nativeId,
        providerId
      })
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
