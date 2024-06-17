import getKeywords from './getKeywords'

/**
 * Function to handle 'handleShortNameChange
 * @param {String} name Name of the field selected
 * @param {String} value Selected short name value
 * @param {Object} props `formData` and `onChange` from RJSF props
 * @param {Object} keywords CMR Controlled keywords response data
 */
const handleShortNameChange = (name, value, props, keywords) => {
  if (name === 'ShortName') {
    const { onChange, formData } = props
    const { ContactInformation = {} } = formData
    const { RelatedUrls = [] } = ContactInformation
    let filter = { short_name: value }

    // Parse the response and retrieve the long name
    let enums = getKeywords(keywords, 'long_name', filter, ['short_name', 'long_name'])
    const [LongName = ''] = enums

    // Parse the response and retrieve the URL
    filter = {
      short_name: value,
      long_name: LongName
    }

    enums = getKeywords(keywords, 'url', filter, ['short_name', 'long_name', 'url'])
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
