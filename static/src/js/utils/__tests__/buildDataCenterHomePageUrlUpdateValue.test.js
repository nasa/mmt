import buildDataCenterHomePageUrlUpdateValue from '../buildDataCenterHomePageUrlUpdateValue'

describe('buildDataCenterHomePageUrlUpdateValue', () => {
  test('builds a RelatedUrls entry when a url is provided', () => {
    expect(buildDataCenterHomePageUrlUpdateValue('https://example.gov')).toEqual({
      ContactInformation: {
        RelatedUrls: [
          {
            URLContentType: 'DataCenterURL',
            Type: 'HOME PAGE',
            URL: 'https://example.gov'
          }
        ]
      }
    })
  })

  test('builds an empty RelatedUrls list to signal removal when no url is provided', () => {
    expect(buildDataCenterHomePageUrlUpdateValue('')).toEqual({
      ContactInformation: {
        RelatedUrls: []
      }
    })
  })
})
