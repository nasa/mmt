import prefixProperty from '../prefixProperty'

describe('prefixProperty', () => {
  describe('when the property does not start with a `.`', () => {
    test('returns the prefixed property', () => {
      expect(prefixProperty('SampleProperty')).toEqual('.SampleProperty')
    })
  })

  describe('when the property does not start with a `.`', () => {
    test('returns the property', () => {
      expect(prefixProperty('.SampleProperty')).toEqual('.SampleProperty')
    })
  })
})
