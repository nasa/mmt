import getTagCount from '../getTagCount'

describe('getTagCount', () => {
  describe('when the formData had two items', () => {
    test('should return 2', () => {
      const inputObject = {
        items: [
          {
            mockTestData: 'test1'
          },
          {
            mockTestData: 'test2'

          }
        ]
      }
      const result = getTagCount(inputObject)
      expect(result).toEqual(2)
    })
  })

  describe('when the formData had no items', () => {
    test('should return 0', () => {
      const inputObject = null
      const result = getTagCount(inputObject)
      expect(result).toEqual(0)
    })
  })
})
