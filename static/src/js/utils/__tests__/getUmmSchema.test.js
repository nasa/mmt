import getUmmSchema from '../getUmmSchema'

import ummCSchema from '../../schemas/umm/ummCSchema'
import ummSSchema from '../../schemas/umm/ummSSchema'
import ummTSchema from '../../schemas/umm/ummTSchema'
import ummVarSchema from '../../schemas/umm/ummVarSchema'

describe('getUmmSchema', () => {
  describe('when the concept type is collection-draft', () => {
    test('returns the UMM-C schema', () => {
      expect(getUmmSchema('collection-draft')).toEqual(ummCSchema)
    })
  })

  describe('when the concept type is service-draft', () => {
    test('returns the UMM-S schema', () => {
      expect(getUmmSchema('service-draft')).toEqual(ummSSchema)
    })
  })

  describe('when the concept type is tool-draft', () => {
    test('returns the UMM-T schema', () => {
      expect(getUmmSchema('tool-draft')).toEqual(ummTSchema)
    })
  })

  describe('when the concept type is variable-draft', () => {
    test('returns the UMM-Var schema', () => {
      expect(getUmmSchema('variable-draft')).toEqual(ummVarSchema)
    })
  })

  describe('when the concept type is not recognized', () => {
    test('returns null', () => {
      expect(getUmmSchema('bad-draft')).toEqual(null)
    })
  })
})
