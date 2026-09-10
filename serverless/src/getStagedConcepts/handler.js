import { getApplicationConfig } from '../../../sharedUtils/getConfig'
import { s3ListObjects } from '../utils/s3ListObjects'
import { getS3Client } from '../utils/getS3Client'
import { getConceptsBucketName } from '../utils/getConceptsBucketName'
import { s3ConceptTypes } from '../../../sharedConstants/s3ConceptTypes'

let s3Client

/**
 * Retrieve a list of staged concepts from S3
 *
 * Staged concepts are opaque promotion artifacts keyed by a generated
 * `recordId`; there is no provider dimension, so this route only requires an
 * authenticated MMT user (the EDL authorizer).
 * @param {Object} event Details about the HTTP request that it received
 */
const getStagedConcepts = async (event) => {
  const { defaultResponseHeaders } = getApplicationConfig()

  if (s3Client == null) {
    s3Client = getS3Client()
  }

  const { pathParameters } = event
  const { conceptType } = pathParameters || {}

  if (!s3ConceptTypes.includes(conceptType)) {
    console.error(`Invalid conceptType "${conceptType}"`)

    return {
      statusCode: 400,
      headers: defaultResponseHeaders
    }
  }

  // S3 directory structure: s3BucketName/conceptType/recordId
  const prefix = `${conceptType}/`
  const bucketName = getConceptsBucketName()

  try {
    const objectList = await s3ListObjects(s3Client, prefix, bucketName)

    const body = objectList.map((object) => {
      const [, recordId] = object.Key.split('/')

      return {
        conceptType,
        lastModified: object.LastModified,
        recordId
      }
    })

    // `recordId` is an opaque UUID, so order by most recently staged first
    const sortedBody = body.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))

    return {
      body: JSON.stringify(sortedBody),
      statusCode: 200,
      headers: defaultResponseHeaders
    }
  } catch (error) {
    console.log('getStagedConcepts Error:', error)

    return {
      statusCode: 404,
      headers: defaultResponseHeaders
    }
  }
}

export default getStagedConcepts
