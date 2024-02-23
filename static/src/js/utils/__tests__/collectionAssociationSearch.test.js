import { collectionAssociationSearch } from '../collectionAssociationSearch'

describe('collectionAssociationSearch', () => {
  describe('when the formData has a wildcard search field', () => {
    test('return a query with pattern', () => {
      const expectedResult = {
        options: {
          entryTitle: {
            pattern: true
          }
        },
        entryTitle: '*'
      }

      const query = collectionAssociationSearch('entryTitle', '*')

      expect(query).toEqual(expectedResult)
    })
  })

  describe('when the formData has scienceKeywords field', () => {
    test('return a query with scienceKeywords', () => {
      const expectedResult = {
        scienceKeywords: {
          0: {
            any: 'SULFUR COMPOUNDS'
          }
        }
      }

      const query = collectionAssociationSearch('scienceKeywords', 'SULFUR COMPOUNDS')

      expect(query).toEqual(expectedResult)
    })
  })

  describe('when the formData has single search field', () => {
    test('return a query with concept id', () => {
      const expectedResult = {
        conceptId: 'C10000000'
      }

      const query = collectionAssociationSearch('conceptId', 'C10000000')

      expect(query).toEqual(expectedResult)
    })
  })
})
