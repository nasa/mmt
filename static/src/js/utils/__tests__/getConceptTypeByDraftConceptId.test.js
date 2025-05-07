import getConceptTypeByDraftConceptId from '../getConceptTypeByDraftConceptId'

describe('getConceptTypeByDraftConceptId', () => {
  describe('when draft concept id starts with TD', () => {
    test('returns tool draft type', () => {
      expect(getConceptTypeByDraftConceptId('TD12345')).toEqual('Tool')
    })
  })

  describe('when draft concept id starts with VD', () => {
    test('returns variable draft type', () => {
      expect(getConceptTypeByDraftConceptId('VD12345')).toEqual('Variable')
    })
  })

  describe('when draft concept id starts with VISD', () => {
    test('returns visualization draft type', () => {
      expect(getConceptTypeByDraftConceptId('VISD12345')).toEqual('Visualization')
    })
  })

  describe('when draft concept id starts with CD', () => {
    test('returns collection draft type', () => {
      expect(getConceptTypeByDraftConceptId('CD12345')).toEqual('Collection')
    })
  })

  describe('when draft concept id starts with SD', () => {
    test('returns service draft type', () => {
      expect(getConceptTypeByDraftConceptId('SD12345')).toEqual('Service')
    })
  })

  describe('when draft concept id does not start with known constants', () => {
    test('returns type undefined', () => {
      expect(getConceptTypeByDraftConceptId('xx12345')).toBe(undefined)
      expect(getConceptTypeByDraftConceptId('x')).toBe(undefined)
      expect(getConceptTypeByDraftConceptId(null)).toBe(undefined)
    })
  })
})
