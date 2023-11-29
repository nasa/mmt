import removeEmpty from '../removeEmpty'

describe('removeEmpty', () => {
  test('removes properties with non-boolean empty values', () => {
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

  test('does not remove boolean properties', () => {
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

  test('does not modify the original object', () => {
    const inputObject = {
      prop1: '',
      prop2: null,
      prop3: 0
    }

    const result = removeEmpty(inputObject)

    expect(result).not.toBe(inputObject) // Ensure the original object is not modified
  })
})
