import { getApplicationConfig } from '../../../sharedUtils/getConfig'
import { s3ConceptTypes } from '../../../sharedConstants/s3ConceptTypes'
import fetchProviders from '../utils/fetchProviders'

/**
 * Forwards a collection's metadata from MMT UAT to the Production API Gateway so
 * it can be staged for production.
 *
 * This Lambda runs in UAT behind the EDL authorizer (a real browser user). It
 * verifies the user may act for the given provider, then calls the Production
 * `createOrUpdateConcept` endpoint using the Production staging API key held in
 * an environment variable (so the key never reaches the browser). On success it
 * returns a link the user can follow to continue the workflow in Production.
 * @param {Object} event Details about the HTTP request that it received
 */
const stageConceptForProduction = async (event) => {
  const { defaultResponseHeaders } = getApplicationConfig()

  const { body, pathParameters } = event
  const { conceptType, nativeId, providerId } = pathParameters || {}

  if (!s3ConceptTypes.includes(conceptType)) {
    console.error(`Invalid conceptType "${conceptType}"`)

    return {
      statusCode: 400,
      headers: defaultResponseHeaders
    }
  }

  if (!body) {
    console.error('Missing request body')

    return {
      statusCode: 400,
      headers: defaultResponseHeaders
    }
  }

  try {
    const allowedProviderIds = await fetchProviders(event)

    if (!allowedProviderIds.includes(providerId)) {
      console.error(`Missing permissions for provider "${providerId}"`)

      return {
        statusCode: 403,
        headers: defaultResponseHeaders
      }
    }
  } catch (error) {
    console.log('Error fetching providers:', error)

    return {
      statusCode: 500,
      headers: defaultResponseHeaders
    }
  }

  const {
    PRODUCTION_API_HOST: productionApiHost,
    PRODUCTION_MMT_HOST: productionMmtHost,
    PRODUCTION_STAGING_API_KEY: productionStagingApiKey
  } = process.env

  if (!productionApiHost || !productionStagingApiKey) {
    console.error('Production promotion is not configured for this environment')

    return {
      statusCode: 500,
      headers: defaultResponseHeaders
    }
  }

  const productionUrl = `${productionApiHost}/providers/${providerId}/${conceptType}/${nativeId}`

  try {
    const response = await fetch(productionUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Staging-Api-Key': productionStagingApiKey
      },
      body
    })

    if (!response.ok) {
      console.error(`Production responded with status ${response.status} staging "${providerId}/${conceptType}/${nativeId}"`)

      return {
        statusCode: 502,
        headers: defaultResponseHeaders,
        body: JSON.stringify({
          error: `Production rejected the request with status ${response.status}`
        })
      }
    }

    return {
      statusCode: 200,
      headers: defaultResponseHeaders,
      body: JSON.stringify({
        conceptType,
        nativeId,
        providerId,
        productionUrl: `${productionMmtHost}/providers/${providerId}/${conceptType}/${nativeId}`
      })
    }
  } catch (error) {
    console.error(`Error staging concept for production: ${error.toString()}`)

    return {
      statusCode: 502,
      headers: defaultResponseHeaders,
      body: JSON.stringify({
        error: error.toString()
      })
    }
  }
}

export default stageConceptForProduction
