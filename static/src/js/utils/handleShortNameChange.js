import { getKeywords } from './cmrKeywords'

/**
 * Function to handle 'handleShortNameChange
 * @param {Object} props An form object from uiSchema
 */

export const handleShortNameChange = (name, value, props, state) => {
  if (name === 'ShortName') {
    const { formData } = props
    const { onChange } = props
    const { ContactInformation = {} } = formData
    const { RelatedUrls = [] } = ContactInformation
    let filter = { short_name: value }

    // Cmr Response contains the fetch response to facet query for providers
    const { cmrResponse } = state

    // Parse the response and retrieve the long name
    let enums = getKeywords(cmrResponse, 'long_name', filter, ['short_name', 'long_name'])
    const [LongName = ''] = enums

    // Parse the response and retrieve the URL
    filter = {
      short_name: value,
      long_name: LongName
    }

    enums = getKeywords(cmrResponse, 'url', filter, ['short_name', 'long_name', 'url'])
    const [URL = ''] = enums

    // If there is no Related URL create one.
    if (RelatedUrls.length === 0) {
      RelatedUrls.push({})
    }

    // Note this prepopulating only works for the first Related URL in the list.
    const RelatedUrl = RelatedUrls[0]
    RelatedUrl.URL = URL
    RelatedUrl.URLContentType = 'DataCenterURL'
    RelatedUrl.Type = 'HOME PAGE'

    // Note the 1 second delay, the controlled form has other onChange events
    // happening, like updating long name, so adding a slight delay to make
    // sure these fire first, otherwise I notice the formData gets overwritten.
    setTimeout(() => {
      onChange(formData)
    }, 1000)
  }
}

export default handleShortNameChange
