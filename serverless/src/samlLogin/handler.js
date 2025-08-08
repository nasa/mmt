import { SAML } from '@node-saml/node-saml'

import { getSamlConfig } from '../../../sharedUtils/getConfig'

/**
 * Handles login authentication
 * @param {Object} event Details about the HTTP request that it received
 */
const samlLogin = async (event) => {
  const options = getSamlConfig()

  // SAML package will not produce an authorization url (see below) without the 'cert' property,
  // although it is only necessary if we are validating tokens (which we are not doing at the
  // moment)
  options.cert = 'fake_cert'
  options.idpCert = 'fake_idp_cert'
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
