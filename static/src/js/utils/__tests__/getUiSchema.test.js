import collectionUiSchema from '@/js/schemas/uiSchemas/collections'
import serviceUiSchema from '@/js/schemas/uiSchemas/services'
import toolsUiSchema from '@/js/schemas/uiSchemas/tools'
import variableUiSchema from '@/js/schemas/uiSchemas/variables'
import visualizationUiSchema from '@/js/schemas/uiSchemas/visualizations'

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

  describe('when the concept type is visualization-draft', () => {
    test('returns the UMM-VIS schema', () => {
      expect(getUiSchema('Visualization')).toEqual(visualizationUiSchema)
    })
  })

  describe('when the concept type is not recognized', () => {
    test('returns null', () => {
      expect(getUiSchema('bad-draft')).toEqual(null)
    })
  })
})
