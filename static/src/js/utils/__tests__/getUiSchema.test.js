import collectionUiSchema from '../../schemas/uiSchemas/collections'
import serviceUiSchema from '../../schemas/uiSchemas/services'
import toolsUiSchema from '../../schemas/uiSchemas/tools'
import variableUiSchema from '../../schemas/uiSchemas/variables'
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

  describe('when the concept type is variable-draft', () => {
    test('returns the UMM-V schema', () => {
      expect(getUiSchema('Variable')).toEqual(variableUiSchema)
    })
  })

  describe('when the concept type is collection-draft', () => {
    test('returns the UMM-C schema', () => {
      expect(getUiSchema('Collection')).toEqual(collectionUiSchema)
    })
  })

  describe('when the concept type is not recognized', () => {
    test('returns null', () => {
      expect(getUiSchema('bad-draft')).toEqual(null)
    })
  })
})
