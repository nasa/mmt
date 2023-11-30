import getAvailableKey from '../getAvailableKey'

describe('getAvailableKey', () => {
  describe('Creates a unique key to be used for onKeyChange.js', () => {
    test('returns the key', () => {
      const preferredKey = 'Sample'
      const registry = {}
      const uiSchema = {}
      const formData = {
        existingKey: 'Sample'
      }
      expect(getAvailableKey(preferredKey, registry, uiSchema, formData)).toEqual('Sample')
    })
  })
})
