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
  console.log('Starting checkNonNasaMMTAccess function')
  console.log('Input parameters:', {
    uid,
    token: token || 'Token missing'
  })

  const { cmrHost } = getApplicationConfig()
  console.log('CMR Host:', cmrHost)
  try {
    const encodedUid = encodeURIComponent(uid)
    console.log('Encoded UID:', encodedUid)
    const url = `${cmrHost}/access-control/acls?permitted_user=${encodedUid}&identity_type=Provider&target=NON_NASA_DRAFT_USER&page_size=2000`
    console.log('Request URL:', url)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    console.log('Response received. Status:', response.status)

    if (!response.ok) {
      console.error('Response not OK. Status:', response.status)
      // Throw new Error(`HTTP error! status: ${response.status}`)
    }

    console.log('Parsing response JSON...')
    const data = await response.text()
    console.log('Parsed data:', data)

    // Default to an empty array if items is not present or null
    const { items = [] } = data
    console.log('Number of items:', items.length)

    const hasAccess = items.some((item) => item.name.includes('NON_NASA_DRAFT_USER'))
    console.log('Has Non-NASA MMT access:', hasAccess)

    return hasAccess
  } catch (error) {
    console.error('Error checking Non-NASA MMT access:', error)
    console.error('Error stack:', error.stack)
    throw error
  } finally {
    console.log('Finished checkNonNasaMMTAccess function')
  }
}

export default checkNonNasaMMTAccess
