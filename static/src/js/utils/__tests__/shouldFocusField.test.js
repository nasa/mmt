import shouldFocusField from '../shouldFocusField'

// Test shouldFocusField on a field in the form when a user clicks on a field id in the Nav panel
describe('shouldFocusField', () => {
  describe('when focus an id field name on the Nav panel matches exactly with a field name on the form', () => {
    test('should return true', () => {
      const result = shouldFocusField('Version', 'Version')
      expect(result).toBe(true)
    })

    describe('when focus and id field name on the Nav panel matches on pattern match with a field name on the form', () => {
      test('should return true', () => {
        const result = shouldFocusField('Version', 'Version_123')
        expect(result).toBe(true)
      })
    })

    describe('when focus and id field name on the Nav panel does not match with a field name on the form', () => {
      test('should return false', () => {
        const result = shouldFocusField('Version', 'LongName')
        expect(result).toBe(false)
      })
    })

    describe('when empty id on the Nav panel', () => {
      test('Empty id should return false', () => {
        const result = shouldFocusField('Version', '')
        expect(result).toBe(false)
      })
    })

    describe('when mismatched', () => {
      test('should return false', () => {
        const result = shouldFocusField('Version', 'Verson_456')
        expect(result).toBe(false)
      })
    })
  })
})
