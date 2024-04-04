import { getApplicationConfig } from './getConfig'

const getTemplates = async (providerId) => {
  const { apiHost } = getApplicationConfig()

  try {
    const response = await fetch(`${apiHost}/providers/${providerId}/templates`, {
      method: 'GET'
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
