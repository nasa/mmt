import shouldFocusField from '../shouldFocusField'

// Test shouldFocusField on a field in the form when a user clicks on a field id in the Nav panel
describe('shouldFocusField', () => {
  test('Exact match should return true', () => {
    const result = shouldFocusField('Version', 'Version')
    expect(result).toBe(true)
  })

  test('Pattern match should return true', () => {
    const result = shouldFocusField('Version', 'Version_123')
    expect(result).toBe(true)
  })

  test('Non-matching case should return false', () => {
    const result = shouldFocusField('Version', 'LongName')
    expect(result).toBe(false)
  })

  test('Empty id should return false', () => {
    const result = shouldFocusField('Version', '')
    expect(result).toBe(false)
  })

  test('Mismatched should return false', () => {
    const result = shouldFocusField('Version', 'Verson_456')
    expect(result).toBe(false)
  })
})
