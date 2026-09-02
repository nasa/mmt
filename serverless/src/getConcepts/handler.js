import { getApplicationConfig } from '../../../sharedUtils/getConfig'
import { s3ListObjects } from '../utils/s3ListObjects'
import { getS3Client } from '../utils/getS3Client'
import { getConceptsBucketName } from '../utils/getConceptsBucketName'
import { s3ConceptTypes } from '../../../sharedConstants/s3ConceptTypes'
import fetchProviders from '../utils/fetchProviders'

let s3Client

/**
 * Retrieve a list of concepts from S3
 * @param {Object} event Details about the HTTP request that it received
 */
const getConcepts = async (event) => {
  const { defaultResponseHeaders } = getApplicationConfig()

  if (s3Client == null) {
    s3Client = getS3Client()
  }

  const { headers, pathParameters } = event
  const { conceptType, providerId } = pathParameters || {}

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

  // S3 directory structure: s3BucketName/providerId/conceptType/nativeId.json
  // Since both providerId and conceptType are known, list directly under that prefix
  const prefix = `${providerId}/${conceptType}/`
  const bucketName = getConceptsBucketName()

  try {
    const allowedProviderIds = await fetchProviders(event)

    if (!allowedProviderIds.includes(providerId)) {
      return {
        statusCode: 404,
        headers: defaultResponseHeaders
      }
    }

    const objectList = await s3ListObjects(s3Client, prefix, bucketName)

    const body = objectList.map((object) => {
      const [, , fileName] = object.Key.split('/')

      // Strip the `.json` extension to recover the nativeId
      const nativeId = fileName.replace(/\.json$/, '')

      return {
        conceptType,
        lastModified: object.LastModified,
        nativeId,
        providerId
      }
    })

    const sortedBody = body.sort((a, b) => {
      const nativeIdA = a.nativeId.toUpperCase()
      const nativeIdB = b.nativeId.toUpperCase()

      if (nativeIdA < nativeIdB) return -1
      if (nativeIdA > nativeIdB) return 1

      return 0
    })

    return {
      body: JSON.stringify(sortedBody),
      statusCode: 200,
      headers: defaultResponseHeaders
    }
  } catch (error) {
    console.log('getConcepts Error:', error)

    return {
      statusCode: 404,
      headers: defaultResponseHeaders
    }
  }
}

export default getConcepts
