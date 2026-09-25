import { PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

import { getApplicationConfig } from '../../../sharedUtils/getConfig'
import { getS3Client } from '../utils/getS3Client'
import { getConceptsBucketName } from '../utils/getConceptsBucketName'
import { s3ConceptTypes } from '../../../sharedConstants/s3ConceptTypes'
import { downcaseKeys } from '../utils/downcaseKeys'

let s3Client

// Temporary tracing for MMT-4195 (tracking down the "staging target rejected
// with status 403" issue). Paired with the same marker/correlationId logged
// by stageConceptForProduction (source) and stagingApiKeyAuthorizer (target).
// Reaching this log for a given correlationId proves the authorizer returned
// Allow -- API Gateway never invokes this handler otherwise. Safe to delete
// once MMT-4195 is resolved.
const DEBUG_MARKER = '[MMT-4195-STAGE-DEBUG]'

/**
 * Create a concept in S3
 *
 * The caller supplies only `conceptType`; a `recordId` (UUID) is generated
 * here and used as the S3 key. `recordId` is returned so the caller can
 * reference the stored record.
 *
 * This is a machine-to-machine endpoint. Authentication is handled entirely by
 * the `stagingApiKeyAuthorizer` API Gateway authorizer (it verifies the
 * `Staging-Api-Key` header); the handler itself does no auth. The local API
 * runner (bin/api.mjs) does not invoke authorizers, so this route is
 * unauthenticated locally, consistent with every other local route.
 * @param {Object} event Details about the HTTP request that it received
 */
const createStagedConcept = async (event) => {
  const { defaultResponseHeaders } = getApplicationConfig()
  const conceptsBucketName = getConceptsBucketName()

  if (s3Client == null) {
    s3Client = getS3Client()
  }

  const {
    body, headers = {}, pathParameters
  } = event
  const { conceptType } = pathParameters

  const { 'x-mmt-debug-correlation-id': correlationId } = downcaseKeys(headers)
  console.log(`${DEBUG_MARKER} target-handler: invoked correlationId=${correlationId} conceptType=${conceptType}`)

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
      // Return the generated id so the caller can reference the record
      body: JSON.stringify({
        recordId
      })
    }
  } catch (error) {
    console.log('createStagedConcept Error:', error)

    return {
      statusCode: 404,
      headers: defaultResponseHeaders
    }
  }
}

export default createStagedConcept
