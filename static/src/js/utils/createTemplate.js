import { getApplicationConfig } from '../../../../sharedUtils/getConfig'

const createTemplate = async (providerId, token, ummMetadata) => {
  const { apiHost } = getApplicationConfig()
  const { tokenValue } = token

  try {
    const response = await fetch(`${apiHost}/providers/${providerId}/templates`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenValue}`
      },
      body: JSON.stringify({
        pathParameters: {
          providerId
        },
        ...ummMetadata
      })
    })
    const data = await response.json()

    return { response: data }
  } catch (e) {
    return {
      error: 'Error retrieving templates'
    }
  }
}

export default createTemplate
