import { getApplicationConfig } from './getConfig'

/**
 * Checks if a user has Non-NASA MMT access.
 *
 * This function makes a request to the CMR access control endpoint to retrieve
 * the user's ACLs and checks if any of them grant Non-NASA MMT access.
 *
 * @param {string} uid - The user ID to check access for.
 * @param {string} token - The authentication token for the API request.
 * @returns {Promise<boolean>} A promise that resolves to true if the user has Non-NASA MMT access, false otherwise.
 * @throws {Error} If there's an error during the API request or processing the response.
 */
const checkNonNasaMMTAccess = async (uid, token) => {
  if (!uid || !token) {
    throw new Error('User id and token are required to verify Non-NASA MMT access')
  }

  try {
    const { cmrHost } = getApplicationConfig()
    const encodedUid = encodeURIComponent(uid)
    const url = `${cmrHost}/access-control/acls?permitted_user=${encodedUid}&identity_type=Provider&target=NON_NASA_DRAFT_USER&page_size=2000`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    const { items = [] } = data

    return items.some((item = {}) => item.name?.includes('NON_NASA_DRAFT_USER'))
  } catch (error) {
    console.error('Error checking Non-NASA MMT access:', error)
    throw error
  }
}

export default checkNonNasaMMTAccess
