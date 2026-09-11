import { GetObjectCommand } from '@aws-sdk/client-s3'

import { getApplicationConfig } from '../../../sharedUtils/getConfig'
import { getS3Client } from '../utils/getS3Client'
import { getConceptsBucketName } from '../utils/getConceptsBucketName'
import { s3ConceptTypes } from '../../../sharedConstants/s3ConceptTypes'

let s3Client

/**
 * Retrieve a staged concept from S3
 *
 * Staged concepts are opaque promotion artifacts keyed by a generated
 * `recordId` (see `createStagedConcept`); there is no provider/native
 * identity to authorize against, so this route only requires an authenticated
 * MMT user (the EDL authorizer).
 * @param {Object} event Details about the HTTP request that it received
 */
const getStagedConcept = async (event) => {
  const { defaultResponseHeaders } = getApplicationConfig()

  if (s3Client == null) {
    s3Client = getS3Client()
  }

  const { pathParameters } = event
  const { conceptType, recordId } = pathParameters || {}

  if (!s3ConceptTypes.includes(conceptType)) {
    console.error(`Invalid conceptType "${conceptType}"`)

    return {
      statusCode: 400,
      headers: defaultResponseHeaders
    }
  }

  try {
    // S3 directory structure: s3BucketName/conceptType/recordId
    const key = `${conceptType}/${recordId}`

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
      recordId
    }

    return {
      body: JSON.stringify(body),
      statusCode,
      headers: defaultResponseHeaders
    }
  } catch (error) {
    console.log('getStagedConcept Error:', error)

    return {
      statusCode: 404,
      headers: defaultResponseHeaders
    }
  }
}

export default getStagedConcept
