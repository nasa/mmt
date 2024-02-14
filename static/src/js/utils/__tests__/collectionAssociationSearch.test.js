import { collectionAssociationSearch } from '../collectionAssociationSearch'

describe('collectionAssociationSearch', () => {
  describe('when the formData has a wildcard search field', () => {
    test('return a query with pattern', () => {
      const formData = {
        entryTitle: '*'

      }

      const expectedResult = {
        options: {
          entryTitle: {
            pattern: true
          }
        },
        entryTitle: '*'
      }

      const query = collectionAssociationSearch(formData)

      expect(query).toEqual(expectedResult)
    })
  })

  describe('when the formData has temporal extent field', () => {
    test('return a query with temporal', () => {
      const formData = {
        rangeStart: '1978-01-01T00:00:00.000Z',
        rangeEnd: '1999-12-31T00:00:00.000Z'
      }

      const expectedResult = {
        temporal: '1978-01-01T00:00:00.000Z,1999-12-31T00:00:00.000Z'
      }

      const query = collectionAssociationSearch(formData)

      expect(query).toEqual(expectedResult)
    })
  })

  describe('when the formData has scienceKeywords field', () => {
    test('return a query with scienceKeywords', () => {
      const formData = {
        scienceKeywords: 'SULFUR COMPOUNDS'
      }

      const expectedResult = {
        scienceKeywords: {
          0: {
            any: 'SULFUR COMPOUNDS'
          }
        }
      }

      const query = collectionAssociationSearch(formData)

      expect(query).toEqual(expectedResult)
    })
  })

  describe('when the formData has single search field', () => {
    test('return a query with concept id', () => {
      const formData = {
        conceptId: 'C10000000'
      }

      const expectedResult = {
        conceptId: 'C10000000'
      }

      const query = collectionAssociationSearch(formData)

      expect(query).toEqual(expectedResult)
    })
  })
})
