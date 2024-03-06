import getKeywords from '../getKeywords'
import relatedUrls from '../__mocks__/relatedUrls'

describe('getKeywords', () => {
  describe('Traverses a CMR facet response and returns a list of keywords for the specified type', () => {
    test('returns the keywords under the specified type', () => {
      const keywords = getKeywords(relatedUrls, 'type', { url_content_type: 'DistributionURL' }, ['url_content_type', 'type'])
      expect(keywords).toEqual([
        'GET CAPABILITIES',
        'GET DATA VIA DIRECT ACCESS',
        'USE SERVICE API',
        'GET DATA',
        'DOWNLOAD SOFTWARE', 'GOTO WEB TOOL'])
    })
  })

  describe('Traverses a CMR facet response and returns [] no keywords if the specified type does not exist', () => {
    test('returns no keywords', () => {
      const keywords = getKeywords(relatedUrls, 'typo', { url_content_type: 'DistributionURL' }, ['url_content_type', 'subtype'])
      expect(keywords).toEqual([])
    })
  })
})
