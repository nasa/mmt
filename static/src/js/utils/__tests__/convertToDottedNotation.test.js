import convertToDottedNotation from '../convertToDottedNotation'

describe('convertToDottedNotation', () => {
  describe('when the property has underscores', () => {
    test('returns the path', () => {
      expect(convertToDottedNotation('SamplePath_1_a')).toEqual('SamplePath.1.a')
    })
  })

  describe('when the property starts with underscore', () => {
    test('returns the path', () => {
      expect(convertToDottedNotation('_SamplePath_1')).toEqual('.SamplePath.1')
    })
  })

  describe('when the property has no underscore', () => {
    test('returns the path', () => {
      expect(convertToDottedNotation('SamplePath')).toEqual('SamplePath')
    })
  })
})
