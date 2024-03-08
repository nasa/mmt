import { getKeywords } from '../cmrKeywords'
import { handleShortNameChange } from '../handleShortNameChange'

// Mock the getKeywords function
jest.mock('../cmrKeywords', () => ({
  getKeywords: jest.fn()
}))

describe('handleShortNameChange', () => {
  it('should update RelatedUrl properties on short name change', () => {
    const name = 'ShortName'
    const value = 'exampleShortName'
    const props = {
      formData: {
        ContactInformation: {
          RelatedUrls: []
        }
      },
      onChange: jest.fn()
    }
    const state = {
      cmrResponse: {
      }
    }

    // Mock getKeywords to return expected values
    getKeywords.mockReturnValueOnce(['ExampleLongName'])
    getKeywords.mockReturnValueOnce(['ExampleURL'])

    handleShortNameChange(name, value, props, state)

    expect(props.formData.ContactInformation.RelatedUrls.length).toBe(1)

    const relatedUrl = props.formData.ContactInformation.RelatedUrls[0]
    expect(relatedUrl.URL).toBe('ExampleURL')
    expect(relatedUrl.URLContentType).toBe('DataCenterURL')
    expect(relatedUrl.Type).toBe('HOME PAGE')
  })
})
