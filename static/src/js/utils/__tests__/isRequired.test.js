import isRequired from '../isRequired'

describe('isRequired', () => {
  // Test case for when the field is required
  test('returns true when the field is required', () => {
    const schema = {
      required: ['fieldName']
    }
    const result = isRequired('fieldName', schema)
    expect(result).toBe(true)
  })

  // Test case for when the field is not required
  test('returns false when the field is not required', () => {
    const schema = {
      required: ['otherField']
    }
    const result = isRequired('fieldName', schema)
    expect(result).toBe(false)
  })

  // Test case for when the schema does not have the 'required' property
  test('returns false when the schema does not have the required property', () => {
    const schema = {}
    const result = isRequired('fieldName', schema)
    expect(result).toBe(false)
  })

  // Test case for when the 'required' property is not an array
  test('returns false when the required property is not an array', () => {
    const schema = {
      required: 'fieldName'
    }
    const result = isRequired('fieldName', schema)
    expect(result).toBe(false)
  })

  // Test case for when the field is in the required array, but not at the same index
  test('returns true when the field is in the required array but not at the same index', () => {
    const schema = {
      required: ['otherField', 'fieldName']
    }
    const result = isRequired('fieldName', schema)
    expect(result).toBe(true)
  })
})
