import { PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

import { getApplicationConfig } from '../../../sharedUtils/getConfig'
import { getS3Client } from '../utils/getS3Client'

let s3Client

/**
 * Create a template to S3
 * @param {Object} event Details about the HTTP request that it received
 */
const createTemplate = async (event) => {
  const { defaultResponseHeaders } = getApplicationConfig()

  if (s3Client == null) {
    s3Client = getS3Client()
  }

  const { body, pathParameters } = event
  const { providerId } = pathParameters
  const { TemplateName: templateName } = JSON.parse(body)

  const hashedName = Buffer.from(templateName).toString('base64')
  const guid = uuidv4()

  const { COLLECTION_TEMPLATES_BUCKET_NAME: collectionTemplatesBucketName } = process.env
  const createCommand = new PutObjectCommand({
    Bucket: collectionTemplatesBucketName,
    Body: body,
    Key: `${providerId}/${guid}/${hashedName}`
  })

  const response = await s3Client.send(createCommand)

  const { $metadata: metadata } = response
  const { httpStatusCode: statusCode } = metadata

  return {
    statusCode,
    headers: defaultResponseHeaders,
    body: JSON.stringify({
      id: guid
    })
  }
}

export default createTemplate
