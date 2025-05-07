import getConceptTypeByConceptId from '../getConceptTypeByConceptId'

describe('getConceptTypeByConcept', () => {
  describe('when concept id starts with T', () => {
    test('returns tool type', () => {
      expect(getConceptTypeByConceptId('T12345-MMT_1')).toEqual('Tool')
    })
  })

  describe('when concept id starts with V', () => {
    test('returns variable type', () => {
      expect(getConceptTypeByConceptId('V12345-MMT_1')).toEqual('Variable')
    })
  })

  describe('when concept id starts with VIS', () => {
    test('returns visualization type', () => {
      expect(getConceptTypeByConceptId('VIS12345-MMT_1')).toEqual('Visualization')
    })
  })

  describe('when concept id starts with C', () => {
    test('returns collection type', () => {
      expect(getConceptTypeByConceptId('C12345-MMT_1')).toEqual('Collection')
    })
  })

  describe('when concept id starts with S', () => {
    test('returns service type', () => {
      expect(getConceptTypeByConceptId('S12345-MMT_1')).toEqual('Service')
    })
  })

  describe('when concept id starts with OO', () => {
    test('returns order option type', () => {
      expect(getConceptTypeByConceptId('OO12345-MMT_1')).toEqual('OrderOption')
    })
  })

  describe('when concept id does not start with known constants', () => {
    test('returns undefined', () => {
      expect(getConceptTypeByConceptId('xx12345')).toBe(undefined)
      expect(getConceptTypeByConceptId('x')).toBe(undefined)
      expect(getConceptTypeByConceptId(null)).toBe(undefined)
    })
  })
})
