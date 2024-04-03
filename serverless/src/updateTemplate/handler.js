import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'

import { getApplicationConfig } from '../../../static/src/js/utils/getConfig'
import { getS3Client } from '../utils/getS3Client'
import { s3ListObjects } from '../utils/s3ListObjects'

let s3Client

/**
 * Update a template to S3
 * @param {Object} event Details about the HTTP request that it received
 */
const updateTemplate = async (event) => {
  const { defaultResponseHeaders } = getApplicationConfig()
  const { COLLECTION_TEMPLATES_BUCKET_NAME: collectionTemplatesBucketName } = process.env

  if (s3Client == null) {
    s3Client = getS3Client()
  }

  const { body, pathParameters } = event
  const { id, providerId } = pathParameters
  const { TemplateName: templateName } = JSON.parse(body)
  const hashedName = Buffer.from(templateName).toString('base64')

  try {
    // Find an existing file with the same `id`
    const prefix = `${providerId}/${id}`
    const objectList = await s3ListObjects(s3Client, prefix)
    const [object] = objectList
    const { Key: existingObjectKey } = object

    const existingObjectHashedName = existingObjectKey.split('/')[2]

    const putCommand = new PutObjectCommand({
      Bucket: collectionTemplatesBucketName,
      Body: body,
      Key: `${providerId}/${id}/${hashedName}`
    })

    const response = await s3Client.send(putCommand)

    const { $metadata: metadata } = response
    const { httpStatusCode: statusCode } = metadata

    // If there is an existing file with a different template name, delete the old file
    if (statusCode === 200 && existingObjectHashedName !== hashedName) {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: collectionTemplatesBucketName,
        Key: existingObjectKey
      })

      await s3Client.send(deleteCommand)
    }

    return {
      statusCode,
      headers: defaultResponseHeaders
    }
  } catch (error) {
    console.log('updateTemplate Error:', error)

    return {
      statusCode: 404,
      headers: defaultResponseHeaders
    }
  }
}

export default updateTemplate
