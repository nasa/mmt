import { escapeRegExp } from 'lodash-es'

import samlLogin from '../handler'
import * as getConfig from '../../../../sharedUtils/getConfig'

beforeEach(() => {
  vi.spyOn(getConfig, 'getSamlConfig').mockImplementation(() => ({
    host: 'https://mmt.localtest.earthdata.nasa.gov',
    callbackUrl: 'https://mmt.localtest.earthdata.nasa.gov/saml/acs',
    path: '/saml/acs',
    entryPoint: 'https://auth.launchpad-sbx.nasa.gov/affwebservices/public/saml2sso',
    issuer: 'https://mmt.localtest.earthdata.nasa.gov/saml/acs',
    cert: 'fake cert',
    protocol: 'https://',
    signatureAlgorithm: 'sha256',
    digestAlgorithm: 'sha256',
    authnContext: ['urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport'],
    identifierFormat: 'urn:oasis:names:tc:SAML:2.0:nameid-format:transient'
  }))
})

describe('samlLogin', () => {
  test('returns a redirect to saml auth url where user passes a target', async () => {
    const event = {
      queryStringParameters: {
        target: 'mock_target'
      }
    }

    const response = await samlLogin(event)

    expect(response.statusCode).toBe(307)

    const regexp = `^${escapeRegExp('https://auth.launchpad-sbx.nasa.gov/affwebservices/public/saml2sso?SAMLRequest=')}.*RelayState=mock_target$`
    expect(response.headers.Location).toMatch(RegExp(regexp))
  })

  test('returns a redirect to saml auth url even if we do not pass a target', async () => {
    const event = {}

    const response = await samlLogin(event)

    expect(response.statusCode).toBe(307)

    const regexp = `^${escapeRegExp('https://auth.launchpad-sbx.nasa.gov/affwebservices/public/saml2sso?SAMLRequest=')}.*`
    expect(response.headers.Location).toMatch(RegExp(regexp))
  })
})
