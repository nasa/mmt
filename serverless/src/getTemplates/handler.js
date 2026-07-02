import { getApplicationConfig } from '../../../sharedUtils/getConfig'
import { s3ListObjects } from '../utils/s3ListObjects'
import { getS3Client } from '../utils/getS3Client'
import fetchProviders from '../utils/fetchProviders'

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

  // If we're running offline, return an empty array without making a fetch request to S3
  if (process.env.IS_OFFLINE) {
    return {
      body: JSON.stringify([]),
      statusCode: 200,
      headers: defaultResponseHeaders
    }
  }

  try {
    const objectList = await s3ListObjects(s3Client)

    const providerIds = await fetchProviders(event)
    console.log(`providerIds: ${providerIds}`)

    const body = objectList.map((object) => {
      const [providerId, guid, hashedName] = object.Key.split('/')

      const name = Buffer.from(hashedName, 'base64').toString()

      return {
        id: guid,
        lastModified: object.LastModified,
        name,
        providerId
      }
    }).filter((object) => providerIds.includes(object.providerId))

    const sortedBody = body.sort((a, b) => {
      const nameA = a.name.toUpperCase()
      const nameB = b.name.toUpperCase()

      if (nameA < nameB) return -1
      if (nameA > nameB) return 1

      return 0
    })

    return {
      body: JSON.stringify(sortedBody),
      statusCode: 200,
      headers: defaultResponseHeaders
    }
  } catch (error) {
    console.log('getTemplates Error:', error)

    return {
      statusCode: 404,
      headers: defaultResponseHeaders
    }
  }
}

export default getTemplates
