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
    if (!response.ok) {
      return { error: response.statusText }
    }

    const body = await response.json()

    return { response: body }
  } catch (error) {
    return { error }
  }
}

export default getTemplates
