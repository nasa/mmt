import { getApplicationConfig } from '../../../sharedUtils/getConfig'
import { s3ConceptTypes } from '../../../sharedConstants/s3ConceptTypes'
import fetchProviders from '../utils/fetchProviders'

/**
 * Forwards a collection's metadata from this MMT environment to another MMT
 * environment's API Gateway so it can be staged there. The typical use is
 * UAT → Production, but the target is whatever `STAGING_TARGET_*` points at
 * (SIT → UAT, a same-environment loopback for local testing, etc.).
 *
 * This Lambda runs behind the EDL authorizer (a real browser user). It verifies
 * the user may act for the given provider, then calls the staging target's
 * `createStagedConcept` endpoint using the target's staging API key held
 * in an environment variable (so the key never reaches the browser). The target
 * stores the metadata under a generated `recordId` and returns it; this Lambda
 * turns that into a deep link the user can follow to continue the workflow
 * there.
 *
 * `providerId` is used only for the per-user permission check; it is not part
 * of the forwarded request (staged concepts have no provider identity).
 * @param {Object} event Details about the HTTP request that it received
 */
const stageConceptForProduction = async (event) => {
  const { defaultResponseHeaders } = getApplicationConfig()

  const { body, pathParameters } = event
  const { conceptType, providerId } = pathParameters || {}

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
    STAGING_TARGET_API_HOST: stagingTargetApiHost,
    STAGING_TARGET_MMT_HOST: stagingTargetMmtHost,
    STAGING_TARGET_API_KEY: stagingTargetApiKey
  } = process.env

  if (!stagingTargetApiHost || !stagingTargetMmtHost || !stagingTargetApiKey) {
    console.error('Staging target is not fully configured for this environment')

    return {
      statusCode: 500,
      headers: defaultResponseHeaders
    }
  }

  const stagingTargetUrl = `${stagingTargetApiHost}/staged/${conceptType}`

  try {
    const response = await fetch(stagingTargetUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Staging-Api-Key': stagingTargetApiKey
      },
      body
    })

    if (!response.ok) {
      console.error(`Staging target responded with status ${response.status} staging a "${conceptType}" concept`)

      return {
        statusCode: 502,
        headers: defaultResponseHeaders,
        body: JSON.stringify({
          error: `Staging target rejected the request with status ${response.status}`
        })
      }
    }

    const { recordId } = await response.json()

    return {
      statusCode: 200,
      headers: defaultResponseHeaders,
      body: JSON.stringify({
        stagedConceptLink: `${stagingTargetMmtHost}/${conceptType}/staged/${recordId}`
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
