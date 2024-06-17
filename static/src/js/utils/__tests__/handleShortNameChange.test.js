import handleShortNameChange from '../handleShortNameChange'
import getKeywords from '../getKeywords'

// Enable fake timers for this test file
vi.useFakeTimers()

vi.mock('../getKeywords')

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
      onChange: vi.fn()
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

  it('should update RelatedUrl properties on short name change', () => {
    const name = 'ShortName'
    const value = 'exampleShortName'
    const props = {
      formData: {
        ContactInformation: {
          RelatedUrls: []
        }
      },
      onChange: vi.fn()
    }
    const state = {
      cmrResponse: {}
    }

    // Mock getKeywords to return expected values
    getKeywords.mockReturnValueOnce(['ExampleLongName'])
    getKeywords.mockReturnValueOnce(['ExampleURL'])

    handleShortNameChange(name, value, props, state)

    // Ensure that the setTimeout callback is executed
    vi.advanceTimersByTime(1000)

    expect(props.onChange).toHaveBeenCalledTimes(1)

    const relatedUrl = props.formData.ContactInformation.RelatedUrls[0]
    expect(relatedUrl.URL).toBe('ExampleURL')
    expect(relatedUrl.URLContentType).toBe('DataCenterURL')
    expect(relatedUrl.Type).toBe('HOME PAGE')
  })

  it('should handle case when RelatedUrls array already has items', () => {
    const name = 'ShortName'
    const value = 'exampleShortName'
    const props = {
      formData: {
        ContactInformation: {
          RelatedUrls: [{
            URL: 'existingURL',
            URLContentType: 'existingContentType',
            Type: 'existingType'
          }]
        }
      },
      onChange: vi.fn()
    }
    const state = {
      cmrResponse: {}
    }

    // Mock getKeywords to return expected values
    getKeywords.mockReturnValueOnce(['ExampleLongName'])
    getKeywords.mockReturnValueOnce(['ExampleURL'])

    handleShortNameChange(name, value, props, state)

    // Ensure that the setTimeout callback is executed
    vi.advanceTimersByTime(1000)

    expect(props.onChange).toHaveBeenCalledTimes(1)
    expect(props.formData.ContactInformation.RelatedUrls.length).toBe(1)

    const relatedUrl = props.formData.ContactInformation.RelatedUrls[0]
    expect(relatedUrl.URL).toBe('ExampleURL')
    expect(relatedUrl.URLContentType).toBe('DataCenterURL')
    expect(relatedUrl.Type).toBe('HOME PAGE')
  })

  it('should not update RelatedUrl properties if name is not ShortName', () => {
    const name = 'NotShortName' // Use a different name
    const value = 'exampleShortName'
    const props = {
      formData: {
        ContactInformation: {
          RelatedUrls: []
        }
      },
      onChange: vi.fn()
    }
    const state = {
      cmrResponse: {}
    }

    handleShortNameChange(name, value, props, state)

    // Ensure that onChange is not called
    expect(props.onChange).not.toHaveBeenCalled()
    // Ensure that RelatedUrls are not updated
    expect(props.formData.ContactInformation.RelatedUrls.length).toBe(0)
  })

  it('should call onChange after a timeout to avoid formData overwrite', () => {
    const name = 'ShortName'
    const value = 'exampleShortName'
    const props = {
      formData: {
        ContactInformation: {
          RelatedUrls: []
        }
      },
      onChange: vi.fn()
    }
    const state = {
      cmrResponse: {}
    }

    // Mock getKeywords to return expected values
    getKeywords.mockReturnValueOnce(['ExampleLongName'])
    getKeywords.mockReturnValueOnce(['ExampleURL'])

    handleShortNameChange(name, value, props, state)

    // Ensure that the setTimeout callback is executed
    vi.advanceTimersByTime(1000)

    expect(props.onChange).toHaveBeenCalledTimes(1)
  })
})
