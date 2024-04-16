import getHumanizedNameFromTypeParam from '../getHumanizedNameFromTypeParam'

describe('getHumanizedNameFromTypeParam', () => {
  describe('when provided type and true for plural arguments', () => {
    test('returns humanized and pluralized string', () => {
      expect(getHumanizedNameFromTypeParam('collections', true)).toEqual('collections')
    })
  })

  describe('when provided type and false for plural arguments', () => {
    test('returns humanized and pluralized string', () => {
      expect(getHumanizedNameFromTypeParam('collections', false)).toEqual('collection')
    })
  })
})
