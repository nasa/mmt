import { getApplicationConfig } from '../../../../sharedUtils/getConfig'

const getTemplates = async (providerId, token) => {
  const { apiHost } = getApplicationConfig()
  const { tokenValue } = token

  try {
    const response = await fetch(`${apiHost}/providers/${providerId}/templates`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenValue}`
      }
    })
    const data = await response.json()

    return { response: data }
  } catch (e) {
    return {
      error: 'Error retrieving templates'
    }
  }
}

export default getTemplates
