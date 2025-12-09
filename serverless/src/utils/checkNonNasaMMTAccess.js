import { getApplicationConfig } from '../../../sharedUtils/getConfig'
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
  const { cmrHost } = getApplicationConfig()
  try {
    const encodedUid = encodeURIComponent(uid)
    const response = await fetch(`${cmrHost}/access-control/permissions?target=NON_NASA_DRAFT_USER&provider=SCIOPS&user_id=${encodedUid}`, {
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

    // Check if the user has the 'create' permission for NON_NASA_DRAFT_USER
    const permissions = data.NON_NASA_DRAFT_USER || []

    return permissions.includes('create')
  } catch (error) {
    console.error('Error checking Non-NASA MMT access:', error)
    throw error
  }
}

export default checkNonNasaMMTAccess
