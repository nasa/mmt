import getConceptTypeByConceptId from '../getConceptTypeByConcept'

describe('getConceptTypeByConcept', () => {
  describe('when concept id starts with T', () => {
    test('returns tool type', () => {
      expect(getConceptTypeByConceptId('T12345')).toEqual('Tool')
    })
  })

  describe('when concept id starts with V', () => {
    test('returns tool type', () => {
      expect(getConceptTypeByConceptId('V12345')).toEqual('Variable')
    })
  })

  describe('when concept id starts with C', () => {
    test('returns tool type', () => {
      expect(getConceptTypeByConceptId('C12345')).toEqual('Collection')
    })
  })

  describe('when concept id starts with S', () => {
    test('returns tool type', () => {
      expect(getConceptTypeByConceptId('S12345')).toEqual('Service')
    })
  })

  describe('when concept id does not start with known constants', () => {
    test('returns tool type', () => {
      expect(getConceptTypeByConceptId('xx12345')).toBe(undefined)
      expect(getConceptTypeByConceptId('x')).toBe(undefined)
      expect(getConceptTypeByConceptId(null)).toBe(undefined)
    })
  })
})
