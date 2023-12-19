import removeEmpty from '../removeEmpty'

describe('removeEmpty', () => {
  describe('when properties with empty value, null, undefined, NaN', () => {
    test('should remove those properties', () => {
      const inputObject = {
        prop1: '',
        prop2: null,
        prop3: 0,
        prop4: false,
        prop5: true,
        prop6: 'value',
        prop7: {
          nestedProp1: undefined,
          nestedProp2: NaN,
          nestedProp3: []
        }
      }

      const expectedResult = {
        prop3: 0,
        prop4: false,
        prop5: true,
        prop6: 'value'
      }

      const result = removeEmpty(inputObject)

      expect(result).toEqual(expectedResult)
    })
  })

  describe('when properties with boolean value', () => {
    test('should not remove those properties', () => {
      const inputObject = {
        prop1: true,
        prop2: false,
        prop3: {
          nestedProp1: true,
          nestedProp2: false
        }
      }

      const expectedResult = {
        prop1: true,
        prop2: false,
        prop3: {
          nestedProp1: true,
          nestedProp2: false
        }
      }

      const result = removeEmpty(inputObject)

      expect(result).toEqual(expectedResult)
    })
  })

  describe('Ensure the original object is not modified', () => {
    test('should not modify the original object', () => {
      const inputObject = {
        prop1: '',
        prop2: null,
        prop3: 0
      }

      const result = removeEmpty(inputObject)

      expect(result).not.toBe(inputObject)
    })
  })
})
