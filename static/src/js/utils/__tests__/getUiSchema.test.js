import serviceUiSchema from '../../schemas/uiSchemas/services'
import toolsUiSchema from '../../schemas/uiSchemas/tools'
import getUiSchema from '../getUiSchema'

describe('getUiSchema', () => {
  describe('when the concept type is tool-draft', () => {
    test('returns the UMM-T schema', () => {
      expect(getUiSchema('Tool')).toEqual(toolsUiSchema)
    })
  })

  describe('when the concept type is service-draft', () => {
    test('returns the UMM-S schema', () => {
      expect(getUiSchema('Service')).toEqual(serviceUiSchema)
    })
  })

  // TODO MMT-3418
  describe('when the concept type is variable-draft', () => {
    test.skip('returns the UMM-V schema', () => {
      expect(getUiSchema('Variable')).toEqual('Replace with Variable uiSchema')
    })
  })

  // TODO MMT-3422
  describe('when the concept type is collection-draft', () => {
    test.skip('returns the UMM-C schema', () => {
      expect(getUiSchema('Collection')).toEqual('Replace with Collection uiSchema')
    })
  })
})
