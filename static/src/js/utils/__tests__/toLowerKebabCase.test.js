import toLowerKebabCase from '../toLowerKebabCase'

describe('toLowerKebabCase', () => {
  describe('when the display name is "Related URLs"', () => {
    test('returns a lower cased kebab string ', () => {
      expect(toLowerKebabCase('Related URLs')).toEqual('related-urls')
    })
  })

  describe('when the display name is "Tool Information"', () => {
    test('returns a lower cased kebab string ', () => {
      expect(toLowerKebabCase('Tool Information')).toEqual('tool-information')
    })
  })
})
