import { camelCase } from 'lodash-es'
import toKebabCase from '../toKebabCase'

describe('toKebabCase', () => {
  describe('when the display name is "Related URLs"', () => {
    test('returns a lower cased kebab string ', () => {
      console.log('Related URLs', camelCase('Related URLs'))
      expect(toKebabCase('Related URLs')).toEqual('related-urls')
    })
  })

  describe('when the display name is "Tool Information"', () => {
    test('returns a lower cased kebab string ', () => {
      expect(toKebabCase('Tool Information')).toEqual('tool-information')
    })
  })
})
