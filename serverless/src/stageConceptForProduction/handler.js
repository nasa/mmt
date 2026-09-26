import { randomUUID } from 'node:crypto'

import { getApplicationConfig } from '../../../sharedUtils/getConfig'
import { s3ConceptTypes } from '../../../sharedConstants/s3ConceptTypes'
import fetchProviders from '../utils/fetchProviders'

// Temporary tracing for MMT-4195 (tracking down the "staging target rejected
// with status 403" issue). Every log line on both the source (this handler)
// and target (stagingApiKeyAuthorizer, createStagedConcept) sides is prefixed
// with this marker and carries the same `correlationId`, so a single request
// can be followed across both environments' log groups in Splunk. Never logs
// the actual Staging-Api-Key value. Safe to delete once MMT-4195 is resolved.
const DEBUG_MARKER = '[MMT-4195-STAGE-DEBUG]'

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

  const correlationId = randomUUID()
  console.log(`${DEBUG_MARKER} source: invoked correlationId=${correlationId} conceptType=${conceptType}`)

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
    STAGING_TARGET_SECRET_API_KEY: stagingTargetSecretApiKey
  } = process.env

  if (!stagingTargetApiHost || !stagingTargetMmtHost || !stagingTargetSecretApiKey) {
    console.error('Staging target is not fully configured for this environment')

    return {
      statusCode: 500,
      headers: defaultResponseHeaders
    }
  }

  const stagingTargetUrl = `${stagingTargetApiHost}/staged/${conceptType}`

  // Node's built-in fetch (undici) does not send a User-Agent header on its
  // own, so left unset it's simply absent -- itself a plausible WAF trigger
  // (rules that expect a browser-like UA). Set one explicitly so we know for
  // certain what was sent, rather than guessing at undici's default behavior.
  const debugUserAgent = `MMT-StageForProduction/1.0 correlationId=${correlationId}`

  console.log(`${DEBUG_MARKER} source: about to POST ${stagingTargetUrl} correlationId=${correlationId} userAgent="${debugUserAgent}"`)

  try {
    const response = await fetch(stagingTargetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Staging-Api-Key': stagingTargetSecretApiKey,
        'X-MMT-Debug-Correlation-Id': correlationId,
        'User-Agent': debugUserAgent
      },
      body
    })

    console.log(`${DEBUG_MARKER} source: response received correlationId=${correlationId} status=${response.status} ok=${response.ok}`)

    if (!response.ok) {
      // Logged (not returned to the client) so CloudWatch shows *why* the
      // target rejected the request -- e.g. an explicit Deny from
      // stagingApiKeyAuthorizer vs. an execute-api resource-policy/VPC
      // endpoint denial, which look identical as just a bare status code.
      const responseBody = await response.text().catch(() => '<unable to read response body>')

      console.error(`${DEBUG_MARKER} source: rejected correlationId=${correlationId} status=${response.status} body=${responseBody}`)
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
