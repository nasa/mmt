import createPath from '../createPath'

describe('createPath', () => {
  describe('when the property is a top level field', () => {
    test('returns the path', () => {
      expect(createPath('SamplePath')).toEqual('SamplePath')
    })
  })

  describe('when the property is an array field', () => {
    test('returns the path', () => {
      expect(createPath('SamplePath.1')).toEqual('SamplePath[1]')
    })
  })

  describe('when the property is nested field under an array field', () => {
    test('returns the path', () => {
      expect(createPath('SamplePath.1.ArrayThing')).toEqual('SamplePath[1].ArrayThing')
    })
  })
})
