import { getApplicationConfig } from 'sharedUtils/getConfig'

/**
 * Creates or updates a concept in the Knowledge Management System (KMS)
 *
 * @param {string} rdfXml - The RDF data of the concept
 * @param {string} userNote - A note provided by the user
 * @param {Object} version - The version object containing version information
 * @param {Object} scheme - The scheme object containing the scheme information
 * @returns {Promise<void>} - A promise that resolves when the operation is complete
 * @throws {Error} - If there's an HTTP error or any other error during the process
 */
export const createUpdateKmsConcept = async (rdfXml, userNote, version, scheme) => {
  const { kmsHost } = getApplicationConfig()
  // In case of published version, use 'published' instead of the version label
  let versionParam = version.version
  if (version.version_type === 'published') {
    versionParam = 'published'
  }

  versionParam = encodeURIComponent(versionParam)
  const schemeParam = encodeURIComponent(scheme.name)

  try {
    // Construct the endpoint URL
    let endpoint = `${kmsHost}/concept?version=${versionParam}&scheme=${schemeParam}`
    if (userNote) {
      const encodedUserNote = encodeURIComponent(userNote)
      endpoint = `${endpoint}&userNote=${encodedUserNote}`
    }

    const response = await fetch(endpoint, {
      method: 'PUT',
      body: rdfXml
    })

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`createUpdateKmsConcept HTTP error! status: ${response.status}`)
    }
  } catch (error) {
    console.error('Error in createUpdateKmsConcept:', error)
    throw error
  }
}
