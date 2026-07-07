import { PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

import { getApplicationConfig } from '../../../sharedUtils/getConfig'
import { getS3Client } from '../utils/getS3Client'
import { getCollectionTemplatesBucketName } from '../utils/getCollectionTemplatesBucketName'
import fetchProviders from '../utils/fetchProviders'

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

  let templateName
  try {
    ({ TemplateName: templateName } = JSON.parse(body))
  } catch (error) {
    console.error('Error parsing body in createTemplate:', error)

    return {
      statusCode: 400,
      headers: defaultResponseHeaders,
      body: JSON.stringify({ error: 'Invalid request body' })
    }
  }

  if (!templateName) {
    console.error('Missing TemplateName in createTemplate request')

    return {
      statusCode: 400,
      headers: defaultResponseHeaders,
      body: JSON.stringify({ error: 'TemplateName is required' })
    }
  }

  const providerIds = await fetchProviders(event)
  console.log('🚀 ~ file: handler.js:26 ~ providerIds:', providerIds)

  if (!providerIds.includes(providerId)) {
    return {
      statusCode: 401,
      headers: defaultResponseHeaders
    }
  }

  const hashedName = Buffer.from(templateName).toString('base64')
  const guid = uuidv4()

  const collectionTemplatesBucketName = getCollectionTemplatesBucketName()
  const createCommand = new PutObjectCommand({
    Bucket: collectionTemplatesBucketName,
    Body: body,
    Key: `${providerId}/${guid}/${hashedName}`
  })

  const response = await s3Client.send(createCommand)
  console.log('🚀 ~ file: handler.js:47 ~ response:', response)

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
