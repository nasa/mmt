import { getApplicationConfig, getUmmVersionsConfig } from '../getConfig'

describe('getConfig', () => {
  describe('when applicationConfig is called', () => {
    test('returns a valid json object for applicationConfig', () => {
      const expectedApplicationConfig = {
        apiHost: 'http://localhost:4001/dev',
        graphQlHost: 'http://localhost:3013/development/api',
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
        ummC: '1.18.2',
        ummS: '1.5.3',
        ummT: '1.2.0',
        ummV: '1.9.0'
      }

      const ummVersionConfig = getUmmVersionsConfig()

      expect(ummVersionConfig).toMatchObject(expectedUmmVersionConfig)
    })
  })
})
