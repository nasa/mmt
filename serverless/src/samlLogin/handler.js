import { getSamlConfig } from '../../../sharedUtils/getConfig'

const { SAML } = require('@node-saml/node-saml')

/**
 * Handles login authentication
 * @param {Object} event Details about the HTTP request that it received
 */

const samlLogin = async (event) => {
  const options = getSamlConfig()
  const saml = new SAML(options)
  const { queryStringParameters } = event
  const { target: relayState } = queryStringParameters || {}

  const authorizeUrl = await saml.getAuthorizeUrlAsync(relayState, options)

  return {
    statusCode: 307,
    headers: {
      Location: authorizeUrl
    }
  }
}

export default samlLogin
