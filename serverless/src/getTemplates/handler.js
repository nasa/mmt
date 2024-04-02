import { getApplicationConfig } from '../../../static/src/js/utils/getConfig'
import { s3ListObjects } from '../utils/s3ListObjects'
import { getS3Client } from '../utils/getS3Client'

let s3Client

/**
 * Retrieve a list of templates from S3
 * @param {Object} event Details about the HTTP request that it received
 */
const getTemplates = async (event) => {
  const { defaultResponseHeaders } = getApplicationConfig()

  if (s3Client == null) {
    s3Client = getS3Client()
  }

  const { pathParameters } = event
  const { providerId } = pathParameters
  const prefix = `${providerId}/`

  try {
    const objectList = await s3ListObjects(s3Client, prefix)

    const body = objectList.map((object) => {
      const [guid, hashedName] = object.Key.replace(prefix, '').split('/')
      const name = Buffer.from(hashedName, 'base64').toString()

      return {
        id: guid,
        name,
        lastModified: object.LastModified
      }
    })

    return {
      body: JSON.stringify(body),
      statusCode: 200,
      headers: defaultResponseHeaders
    }
  } catch (error) {
    console.log('🚀 ~ getTemplates ~ error:', error)

    return {
      statusCode: 404,
      headers: defaultResponseHeaders
    }
  }
}

export default getTemplates
