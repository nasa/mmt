import { getKeywords } from '../cmrKeywords'
import {
  handleShortNameChange,
  shouldHideGetData,
  shouldHideGetService
} from '../collectionsUtils'

// Testing GetData
describe('shouldHideGetData', () => {
  it('should hide GetData form when URLContentType is not DistributionURL and Type is not GET DATA or GET CAPABILITIES', () => {
    const props = {
      URLContentType: 'OtherContentType',
      Type: 'OtherType'
    }
    const getData = shouldHideGetData(props)
    expect(getData).toBe(true)
  })

  it('should not hide GetData form when URLContentType is DistributionURL and Type is GET DATA', () => {
    const props = {
      URLContentType: 'DistributionURL',
      Type: 'GET DATA'
    }

    const getData = shouldHideGetData(props)
    expect(getData).toBe(false)
  })

  it('should not hide GetData when URLContentType is DistributionURL and Type is GET CAPABILITIES', () => {
    const props = {
      URLContentType: 'DistributionURL',
      Type: 'GET CAPABILITIES'
    }
    const getData = shouldHideGetData(props)
    expect(getData).toBe(false)
  })
})

// Testing GetService
describe('shouldHideGetService', () => {
  it('should hide GetService form when URLContentType is not DistributionURL and Type is not USE SERVICE API', () => {
    const props = {
      URLContentType: 'OtherContentType',
      Type: 'OtherType'
    }
    const getData = shouldHideGetService(props)
    expect(getData).toBe(true)
  })

  it('should not hide GetService when URLContentType is DistributionURL and Type is USE SERVICE API', () => {
    const props = {
      URLContentType: 'DistributionURL',
      Type: 'USE SERVICE API'
    }
    const getData = shouldHideGetService(props)
    expect(getData).toBe(false)
  })
})

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
