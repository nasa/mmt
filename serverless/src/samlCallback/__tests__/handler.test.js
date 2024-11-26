import samlCallback from '../handler'
import fetchEdlProfile from '../../utils/fetchEdlProfile'
import createJwt from '../../utils/createJwt'
import * as getConfig from '../../../../sharedUtils/getConfig'

vi.mock('../../utils/createJwt')
createJwt.mockImplementation(() => 'mock-jwt')
vi.mock('../../utils/fetchEdlProfile')
const mockEdlProfile = {
  name: 'Test User',
  uid: 'mock_user'
}
fetchEdlProfile.mockImplementation(() => (mockEdlProfile))

vi.spyOn(getConfig, 'getApplicationConfig').mockImplementation(() => ({
  mmtHost: 'https://mmt.localtest.earthdata.nasa.gov',
  apiHost: 'https://mmt.localtest.earthdata.nasa.gov/dev',
  graphQlHost: 'http://localhost:3013/dev/api',
  cmrHost: 'http://localhost:4000',
  version: 'sit',
  env: 'development'
}))

vi.spyOn(Date.prototype, 'valueOf').mockImplementation(() => 1234)

describe('samlCallback', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }
    process.env.COOKIE_DOMAIN = 'example.com'
    process.env.JWT_SECRET = 'JWT_SECRET'
    process.env.JWT_VALID_TIME = 900

    const date = new Date(2024)
    vi.setSystemTime(date)
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('samlCallback is called by launchpad after a successful login in production mode', () => {
    test('returns a redirect to the mmt app and encodes the launchpad token in a cookie', async () => {
      const samlXmlResponse = '<Response xmlns="urn:oasis:names:tc:SAML:2.0:protocol" Destination="https://mmt.localtest.earthdata.nasa.gov/saml/acs" ID="_29b3f955312a3c68db49eda34f2266f0e411" InResponseTo="_d5e333760bd8d18b872d2d21bda9dd44e8b1c765" IssueInstant="2024-01-24T21:26:05Z" Version="2.0"><ns1:Issuer xmlns:ns1="urn:oasis:names:tc:SAML:2.0:assertion" Format="urn:oasis:names:tc:SAML:2.0:nameid-format:entity">https://auth.launchpad-sbx.nasa.gov</ns1:Issuer><Status><StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success"/></Status><ns2:Assertion xmlns:ns2="urn:oasis:names:tc:SAML:2.0:assertion" ID="_767bd1669f107d1223bd4d261d5c08b75f90" IssueInstant="2024-01-24T21:26:05Z" Version="2.0"><ns2:Issuer Format="urn:oasis:names:tc:SAML:2.0:nameid-format:entity">https://auth.launchpad-sbx.nasa.gov</ns2:Issuer><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/><ds:Reference URI="#_767bd1669f107d1223bd4d261d5c08b75f90"><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/><ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>6OZUBWzQOgUDTOFcU+6Laswoq+emcweu9jMq9l8Bmp8=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue>JYOpL7f2GCg/zPaDqZm1/ZyAcNCK7japfbmggF3O4RxbTkk9FrVQRK6bu7mi2fagWhAs9rk/v+pEGc4RHUjOTYYYpfPpiyMYydi3YfHK1p0gO4DslopgeUJ6UFYWK6aWQQCDpDKR1/BHFHgu2KvfaaO0foz9ktYZiLoqhXBpC97vK7OElIjhH6N6S6E2Yzr0jDErvoJoif/xj/x9wNlmGqYon6mcJvbufO/pA09xpQjliK9RYLoucGqC2QEhet3UA3vw0nk4o6+QOPD5WD1yG5vVfv9zHowEF4YLS/lbt08TNJoqbU/rGJOtuI/XD87iikkl2ZplSXj8Hj0AlpjU1w==</ds:SignatureValue><ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:X509Data><ds:X509Certificate>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</ds:X509Certificate></ds:X509Data></ds:KeyInfo></ds:Signature><ns2:Subject><ns2:NameID Format="urn:oasis:names:tc:SAML:2.0:nameid-format:transient">_7903f9c4c432c875a953385756f3f159636f</ns2:NameID><ns2:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer"><ns2:SubjectConfirmationData InResponseTo="_d5e333760bd8d18b872d2d21bda9dd44e8b1c765" NotOnOrAfter="2024-01-24T21:27:35Z" Recipient="https://mmt.localtest.earthdata.nasa.gov/saml/acs"/></ns2:SubjectConfirmation></ns2:Subject><ns2:Conditions NotBefore="2024-01-24T21:25:35Z" NotOnOrAfter="2024-01-24T21:27:35Z"><ns2:AudienceRestriction><ns2:Audience>https://mmt.localtest.earthdata.nasa.gov/saml/acs</ns2:Audience></ns2:AudienceRestriction></ns2:Conditions><ns2:AuthnStatement AuthnInstant="2024-01-24T21:25:39Z" SessionIndex="Z5yPcR6a8SaKdbNoPLXxxWMOTA4=iKIwow=="><ns2:AuthnContext><ns2:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport</ns2:AuthnContextClassRef></ns2:AuthnContext></ns2:AuthnStatement><ns2:AttributeStatement><ns2:Attribute Name="auid" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:unspecified"><ns2:AttributeValue>mock.user</ns2:AttributeValue></ns2:Attribute><ns2:Attribute Name="email" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:unspecified"><ns2:AttributeValue>mock.user@site.com</ns2:AttributeValue></ns2:Attribute></ns2:AttributeStatement></ns2:Assertion></Response>'
      const encodedXml = Buffer.from(samlXmlResponse).toString('base64')

      const event = {
        body: `RelayState=%2Fhome&SAMLResponse=${encodeURIComponent(encodedXml)}`,
        headers: {
          Cookie: 'SBXSESSION=launchpad_token'
        }
      }

      const response = await samlCallback(event)

      const { headers, statusCode } = response
      const {
        Location,
        'Set-Cookie': setCookie
      } = headers

      expect(statusCode).toEqual(303)
      expect(Location).toEqual('https://mmt.localtest.earthdata.nasa.gov/auth-callback?target=%2Fhome')
      expect(setCookie).toEqual('_mmt_jwt_development=mock-jwt; SameSite=Strict; Path=/; Domain=example.com; Max-Age=900; Secure;')

      expect(createJwt).toHaveBeenCalledTimes(1)
      expect(createJwt).toHaveBeenCalledWith('launchpad_token', mockEdlProfile)
    })
  })

  describe('when url parameters are provided in the relay state', () => {
    test('the params are persisted through the redirect', async () => {
      const samlXmlResponse = '<Response xmlns="urn:oasis:names:tc:SAML:2.0:protocol" Destination="https://mmt.localtest.earthdata.nasa.gov/saml/acs" ID="_29b3f955312a3c68db49eda34f2266f0e411" InResponseTo="_d5e333760bd8d18b872d2d21bda9dd44e8b1c765" IssueInstant="2024-01-24T21:26:05Z" Version="2.0"><ns1:Issuer xmlns:ns1="urn:oasis:names:tc:SAML:2.0:assertion" Format="urn:oasis:names:tc:SAML:2.0:nameid-format:entity">https://auth.launchpad-sbx.nasa.gov</ns1:Issuer><Status><StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success"/></Status><ns2:Assertion xmlns:ns2="urn:oasis:names:tc:SAML:2.0:assertion" ID="_767bd1669f107d1223bd4d261d5c08b75f90" IssueInstant="2024-01-24T21:26:05Z" Version="2.0"><ns2:Issuer Format="urn:oasis:names:tc:SAML:2.0:nameid-format:entity">https://auth.launchpad-sbx.nasa.gov</ns2:Issuer><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/><ds:Reference URI="#_767bd1669f107d1223bd4d261d5c08b75f90"><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/><ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>6OZUBWzQOgUDTOFcU+6Laswoq+emcweu9jMq9l8Bmp8=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue>JYOpL7f2GCg/zPaDqZm1/ZyAcNCK7japfbmggF3O4RxbTkk9FrVQRK6bu7mi2fagWhAs9rk/v+pEGc4RHUjOTYYYpfPpiyMYydi3YfHK1p0gO4DslopgeUJ6UFYWK6aWQQCDpDKR1/BHFHgu2KvfaaO0foz9ktYZiLoqhXBpC97vK7OElIjhH6N6S6E2Yzr0jDErvoJoif/xj/x9wNlmGqYon6mcJvbufO/pA09xpQjliK9RYLoucGqC2QEhet3UA3vw0nk4o6+QOPD5WD1yG5vVfv9zHowEF4YLS/lbt08TNJoqbU/rGJOtuI/XD87iikkl2ZplSXj8Hj0AlpjU1w==</ds:SignatureValue><ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:X509Data><ds:X509Certificate>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</ds:X509Certificate></ds:X509Data></ds:KeyInfo></ds:Signature><ns2:Subject><ns2:NameID Format="urn:oasis:names:tc:SAML:2.0:nameid-format:transient">_7903f9c4c432c875a953385756f3f159636f</ns2:NameID><ns2:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer"><ns2:SubjectConfirmationData InResponseTo="_d5e333760bd8d18b872d2d21bda9dd44e8b1c765" NotOnOrAfter="2024-01-24T21:27:35Z" Recipient="https://mmt.localtest.earthdata.nasa.gov/saml/acs"/></ns2:SubjectConfirmation></ns2:Subject><ns2:Conditions NotBefore="2024-01-24T21:25:35Z" NotOnOrAfter="2024-01-24T21:27:35Z"><ns2:AudienceRestriction><ns2:Audience>https://mmt.localtest.earthdata.nasa.gov/saml/acs</ns2:Audience></ns2:AudienceRestriction></ns2:Conditions><ns2:AuthnStatement AuthnInstant="2024-01-24T21:25:39Z" SessionIndex="Z5yPcR6a8SaKdbNoPLXxxWMOTA4=iKIwow=="><ns2:AuthnContext><ns2:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport</ns2:AuthnContextClassRef></ns2:AuthnContext></ns2:AuthnStatement><ns2:AttributeStatement><ns2:Attribute Name="auid" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:unspecified"><ns2:AttributeValue>mock.user</ns2:AttributeValue></ns2:Attribute><ns2:Attribute Name="email" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:unspecified"><ns2:AttributeValue>mock.user@site.com</ns2:AttributeValue></ns2:Attribute></ns2:AttributeStatement></ns2:Assertion></Response>'
      const encodedXml = Buffer.from(samlXmlResponse).toString('base64')
      const event = {
        body: `RelayState=%2Fhome&SAMLResponse=${encodeURIComponent(encodedXml)}`,
        headers: {
          Cookie: 'SBXSESSION=launchpad_token'
        }
      }
      vi.spyOn(getConfig, 'getApplicationConfig').mockImplementation(() => ({
        mmtHost: 'https://mmt.localtest.earthdata.nasa.gov',
        apiHost: 'https://mmt.localtest.earthdata.nasa.gov/dev',
        graphQlHost: 'http://localhost:3013/dev/api',
        cmrHost: 'http://localhost:4000',
        version: 'sit',
        env: 'development'
      }))

      const response = await samlCallback(event)
      const { headers, statusCode } = response
      const {
        Location,
        'Set-Cookie': setCookie
      } = headers

      expect(statusCode).toEqual(303)
      expect(Location).toEqual('https://mmt.localtest.earthdata.nasa.gov/auth-callback?target=%2Fhome')
      expect(setCookie).toEqual('_mmt_jwt_development=mock-jwt; SameSite=Strict; Path=/; Domain=example.com; Max-Age=900; Secure;')

      expect(createJwt).toHaveBeenCalledTimes(1)
      expect(createJwt).toHaveBeenCalledWith('launchpad_token', mockEdlProfile)
    })
  })

  describe('samlCallback is called by launchpad after a successful login in dev mode', () => {
    test('returns a redirect to the mmt app but uses ABC-1 for the token', async () => {
      process.env.IS_OFFLINE = true

      const samlXmlResponse = '<Response xmlns="urn:oasis:names:tc:SAML:2.0:protocol" Destination="https://mmt.localtest.earthdata.nasa.gov/saml/acs" ID="_29b3f955312a3c68db49eda34f2266f0e411" InResponseTo="_d5e333760bd8d18b872d2d21bda9dd44e8b1c765" IssueInstant="2024-01-24T21:26:05Z" Version="2.0"><ns1:Issuer xmlns:ns1="urn:oasis:names:tc:SAML:2.0:assertion" Format="urn:oasis:names:tc:SAML:2.0:nameid-format:entity">https://auth.launchpad-sbx.nasa.gov</ns1:Issuer><Status><StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success"/></Status><ns2:Assertion xmlns:ns2="urn:oasis:names:tc:SAML:2.0:assertion" ID="_767bd1669f107d1223bd4d261d5c08b75f90" IssueInstant="2024-01-24T21:26:05Z" Version="2.0"><ns2:Issuer Format="urn:oasis:names:tc:SAML:2.0:nameid-format:entity">https://auth.launchpad-sbx.nasa.gov</ns2:Issuer><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/><ds:Reference URI="#_767bd1669f107d1223bd4d261d5c08b75f90"><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/><ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>6OZUBWzQOgUDTOFcU+6Laswoq+emcweu9jMq9l8Bmp8=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue>JYOpL7f2GCg/zPaDqZm1/ZyAcNCK7japfbmggF3O4RxbTkk9FrVQRK6bu7mi2fagWhAs9rk/v+pEGc4RHUjOTYYYpfPpiyMYydi3YfHK1p0gO4DslopgeUJ6UFYWK6aWQQCDpDKR1/BHFHgu2KvfaaO0foz9ktYZiLoqhXBpC97vK7OElIjhH6N6S6E2Yzr0jDErvoJoif/xj/x9wNlmGqYon6mcJvbufO/pA09xpQjliK9RYLoucGqC2QEhet3UA3vw0nk4o6+QOPD5WD1yG5vVfv9zHowEF4YLS/lbt08TNJoqbU/rGJOtuI/XD87iikkl2ZplSXj8Hj0AlpjU1w==</ds:SignatureValue><ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:X509Data><ds:X509Certificate>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</ds:X509Certificate></ds:X509Data></ds:KeyInfo></ds:Signature><ns2:Subject><ns2:NameID Format="urn:oasis:names:tc:SAML:2.0:nameid-format:transient">_7903f9c4c432c875a953385756f3f159636f</ns2:NameID><ns2:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer"><ns2:SubjectConfirmationData InResponseTo="_d5e333760bd8d18b872d2d21bda9dd44e8b1c765" NotOnOrAfter="2024-01-24T21:27:35Z" Recipient="https://mmt.localtest.earthdata.nasa.gov/saml/acs"/></ns2:SubjectConfirmation></ns2:Subject><ns2:Conditions NotBefore="2024-01-24T21:25:35Z" NotOnOrAfter="2024-01-24T21:27:35Z"><ns2:AudienceRestriction><ns2:Audience>https://mmt.localtest.earthdata.nasa.gov/saml/acs</ns2:Audience></ns2:AudienceRestriction></ns2:Conditions><ns2:AuthnStatement AuthnInstant="2024-01-24T21:25:39Z" SessionIndex="Z5yPcR6a8SaKdbNoPLXxxWMOTA4=iKIwow=="><ns2:AuthnContext><ns2:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport</ns2:AuthnContextClassRef></ns2:AuthnContext></ns2:AuthnStatement><ns2:AttributeStatement><ns2:Attribute Name="auid" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:unspecified"><ns2:AttributeValue>mock.user</ns2:AttributeValue></ns2:Attribute><ns2:Attribute Name="email" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:unspecified"><ns2:AttributeValue>mock.user@site.com</ns2:AttributeValue></ns2:Attribute></ns2:AttributeStatement></ns2:Assertion></Response>'
      const encodedXml = Buffer.from(samlXmlResponse).toString('base64')
      const event = {
        body: `RelayState=%2Fhome&SAMLResponse=${encodeURIComponent(encodedXml)}`,
        headers: {
          Cookie: 'SBXSESSION=launchpad_token'
        }
      }
      vi.spyOn(getConfig, 'getApplicationConfig').mockImplementation(() => ({
        mmtHost: 'https://mmt.localtest.earthdata.nasa.gov',
        apiHost: 'https://mmt.localtest.earthdata.nasa.gov/dev',
        graphQlHost: 'http://localhost:3013/dev/api',
        cmrHost: 'http://localhost:4000',
        env: 'development'
      }))

      const response = await samlCallback(event)
      const { headers, statusCode } = response
      const {
        Location,
        'Set-Cookie': setCookie
      } = headers

      expect(statusCode).toEqual(303)
      expect(Location).toEqual('https://mmt.localtest.earthdata.nasa.gov/auth-callback?target=%2Fhome')
      expect(setCookie).toEqual('_mmt_jwt_development=mock-jwt; SameSite=Strict; Path=/; Domain=example.com; Max-Age=900;')

      expect(createJwt).toHaveBeenCalledTimes(1)
      expect(createJwt).toHaveBeenCalledWith('ABC-1', mockEdlProfile)
    })
  })
})
