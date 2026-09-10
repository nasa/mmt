import { PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

import { getApplicationConfig } from '../../../sharedUtils/getConfig'
import { getS3Client } from '../utils/getS3Client'
import { getConceptsBucketName } from '../utils/getConceptsBucketName'
import { s3ConceptTypes } from '../../../sharedConstants/s3ConceptTypes'

let s3Client

/**
 * Create a concept in S3
 *
 * The caller supplies only `conceptType`; a `recordId` (UUID) is generated
 * here and used as the S3 key. `conceptType` and `recordId` are returned so
 * the caller can reference the stored record.
 *
 * This is a machine-to-machine endpoint. Authentication is handled entirely by
 * the `stagingApiKeyAuthorizer` API Gateway authorizer (it verifies the
 * `Staging-Api-Key` header); the handler itself does no auth. The local API
 * runner (bin/api.mjs) does not invoke authorizers, so this route is
 * unauthenticated locally, consistent with every other local route.
 * @param {Object} event Details about the HTTP request that it received
 */
const createOrUpdateStagedConcept = async (event) => {
  const { defaultResponseHeaders } = getApplicationConfig()
  const conceptsBucketName = getConceptsBucketName()

  if (s3Client == null) {
    s3Client = getS3Client()
  }

  const { body, pathParameters } = event
  const { conceptType } = pathParameters

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
    // The caller does not supply an identifier; generate one for this record
    const recordId = uuidv4()

    // S3 directory structure: s3BucketName/conceptType/recordId
    const key = `${conceptType}/${recordId}`

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
      // Return the identifying tuple so the caller can reference the record
      body: JSON.stringify({
        conceptType,
        recordId
      })
    }
  } catch (error) {
    console.log('createOrUpdateStagedConcept Error:', error)

    return {
      statusCode: 404,
      headers: defaultResponseHeaders
    }
  }
}

export default createOrUpdateStagedConcept
