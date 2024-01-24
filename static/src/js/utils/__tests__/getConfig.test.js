import { getApplicationConfig, getUmmVersionsConfig } from '../getConfig'

describe('getConfig', () => {
  describe('when applicationConfig is called', () => {
    test('returns a valid json object for applicationConfig', () => {
      const expectedApplicationConfig = {
        apiHost: 'http://localhost:4001/dev',
        graphQlHost: 'http://localhost:3013/dev/api',
        cmrHost: 'http://localhost:4000',
        version: 'development'
      }

      const applicationConfig = getApplicationConfig()

      expect(applicationConfig).toMatchObject(expectedApplicationConfig)
    })
  })

  describe('when ummVersionConfig is called', () => {
    test('returns a valid json object for ummVersionConfig', () => {
      const expectedUmmVersionConfig = {
        ummC: '1.17.3',
        ummS: '1.4',
        ummT: '1.1',
        ummV: '1.9.0'
      }

      const ummVersionConfig = getUmmVersionsConfig()

      expect(ummVersionConfig).toMatchObject(expectedUmmVersionConfig)
    })
  })
})