import { GetObjectCommand } from '@aws-sdk/client-s3'

import { getApplicationConfig } from '../../../sharedUtils/getConfig'
import { s3ListObjects } from '../utils/s3ListObjects'
import { getS3Client } from '../utils/getS3Client'

let s3Client

/**
 * Retrieve a template from S3
 * @param {Object} event Details about the HTTP request that it received
 */
const getTemplate = async (event) => {
  const { defaultResponseHeaders } = getApplicationConfig()

  if (s3Client == null) {
    s3Client = getS3Client()
  }

  const { pathParameters } = event
  const { id } = pathParameters

  try {
    // We only know the provider and the id, but we need the full filename to retrieve the contents
    // Use the provider and id to find the correct file
    const objectList = await s3ListObjects(s3Client)

    let providerId

    const object = objectList.find(({ Key }) => {
      const [objectProviderId, guid] = Key.split('/')

      providerId = objectProviderId

      return guid === id
    })

    const { Key: key } = object

    // Retrieve the file from S3
    const { COLLECTION_TEMPLATES_BUCKET_NAME: collectionTemplatesBucketName } = process.env
    const getCommand = new GetObjectCommand({
      Bucket: collectionTemplatesBucketName,
      Key: key
    })

    const response = await s3Client.send(getCommand)

    const { $metadata: metadata } = response

    const { httpStatusCode: statusCode } = metadata

    // Transform the body into a string to return
    const { Body: responseBody } = response

    const body = {
      template: JSON.parse(await responseBody.transformToString()),
      providerId
    }

    return {
      body: JSON.stringify(body),
      statusCode,
      headers: defaultResponseHeaders
    }
  } catch (error) {
    console.log('getTemplate Error:', error)

    return {
      statusCode: 404,
      headers: defaultResponseHeaders
    }
  }
}

export default getTemplate
