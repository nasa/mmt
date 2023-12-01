import onPropertyChange from '../onPropertyChange'

describe('onPropertyChange', () => {
  // Mock callback function for onChange
  const mockOnChange = jest.fn()

  test('should handle property change with undefined value and addedByAdditionalProperties', () => {
    const name = 'longName'
    const formData = { existingField: 'existingValue' }
    const errorSchema = { existingField: 'error' }
    const addedByAdditionalProperties = true

    const propertyChangeHandler = onPropertyChange(
      name,
      formData,
      mockOnChange,
      errorSchema,
      addedByAdditionalProperties
    )

    // Call the propertyChangeHandler with undefined value
    propertyChangeHandler(undefined, 'newError', 'fieldId')

    // Ensure the onChange callback is called with the correct arguments
    expect(mockOnChange).toHaveBeenCalledWith(
      {
        existingField: 'existingValue',
        longName: ''
      }, // Updated longName in form data
      {
        existingField: 'error',
        longName: 'newError'
      }, // Updated error schema
      'fieldId' // Expected field ID
    )
  })

  test('should handle property change without modifying value', () => {
    const name = 'longName'
    const formData = { existingField: 'existingValue' }
    const errorSchema = { existingField: 'error' }
    const addedByAdditionalProperties = false

    const propertyChangeHandler = onPropertyChange(
      name,
      formData,
      mockOnChange,
      errorSchema,
      addedByAdditionalProperties
    )

    // Call the propertyChangeHandler with a value
    propertyChangeHandler('someValue', 'newError', 'fieldId')

    // Ensure the onChange callback is called with the correct arguments
    expect(mockOnChange).toHaveBeenCalledWith(
      {
        existingField: 'existingValue',
        longName: 'someValue'
      }, // Updated longName in form data
      {
        existingField: 'error',
        longName: 'newError'
      }, // Updated error schema
      'fieldId' // Expected field ID
    )
  })

  test('should not throw an error when addedByAdditionalProperties is true and value is undefined', () => {
    const name = 'longName'
    const formData = { existingField: 'existingValue' }
    const errorSchema = { existingField: 'error' }
    const addedByAdditionalProperties = true

    const propertyChangeHandler = onPropertyChange(
      name,
      formData,
      mockOnChange,
      errorSchema,
      addedByAdditionalProperties
    )

    // Call the propertyChangeHandler with undefined value
    const result = () => propertyChangeHandler(undefined, 'newError', 'fieldId')

    // Ensure the function doesn't throw an error
    expect(result).not.toThrow()
  })
})
