import { GetObjectCommand } from '@aws-sdk/client-s3'

import { getApplicationConfig } from '../../../sharedUtils/getConfig'
import { getS3Client } from '../utils/getS3Client'
import { getConceptsBucketName } from '../utils/getConceptsBucketName'
import { s3ConceptTypes } from '../../../sharedConstants/s3ConceptTypes'
import fetchProviders from '../utils/fetchProviders'

let s3Client

/**
 * Retrieve a concept from S3
 * @param {Object} event Details about the HTTP request that it received
 */
const getConcept = async (event) => {
  const { defaultResponseHeaders } = getApplicationConfig()

  if (s3Client == null) {
    s3Client = getS3Client()
  }

  const { headers, pathParameters } = event
  const { conceptType, nativeId, providerId } = pathParameters

  // Header casing isn't guaranteed by API Gateway/Lambda proxy integration,
  // so look up 'Staging-Api-Key' case-insensitively
  const stagingApiKeyHeader = Object.entries(headers || {})
    .find(([headerName]) => headerName.toLowerCase() === 'staging-api-key')

  const [, stagingApiKey] = stagingApiKeyHeader || []

  if (stagingApiKey !== process.env.STAGING_API_KEY) {
    console.error('Missing or invalid Staging-Api-Key header')

    return {
      statusCode: 401,
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

    // S3 directory structure: s3BucketName/providerId/conceptType/nativeId.json
    const key = `${providerId}/${conceptType}/${nativeId}.json`

    // Retrieve the file from S3
    const conceptsBucketName = getConceptsBucketName()
    const getCommand = new GetObjectCommand({
      Bucket: conceptsBucketName,
      Key: key
    })

    const response = await s3Client.send(getCommand)

    const { $metadata: metadata } = response

    const { httpStatusCode: statusCode } = metadata

    // Transform the body into a string to return
    const { Body: responseBody } = response

    const body = {
      concept: JSON.parse(await responseBody.transformToString()),
      conceptType,
      nativeId,
      providerId
    }

    return {
      body: JSON.stringify(body),
      statusCode,
      headers: defaultResponseHeaders
    }
  } catch (error) {
    console.log('getConcept Error:', error)

    return {
      statusCode: 404,
      headers: defaultResponseHeaders
    }
  }
}

export default getConcept
