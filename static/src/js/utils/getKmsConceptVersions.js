import xml2js from 'xml2js'
import { getApplicationConfig } from 'sharedUtils/getConfig'

/**
 * Fetches and parses KMS concept versions from the server.
 * @async
 * @function getKmsConceptVersions
 * @returns {Promise<Object>} A promise that resolves to an object containing parsed version data.
 * @throws {Error} If there's an error fetching or parsing the data.
 */
const getKmsConceptVersions = async () => {
  const { kmsHost } = getApplicationConfig()
  try {
    // Fetch data from KMS server
    const response = await fetch(`${kmsHost}/concept_versions/version_type/all`, {
      method: 'GET'
    })

    if (!response.ok) {
      throw new Error(`getKmsConceptVersions HTTP error! status: ${response.status}`)
    }

    const xmlText = await response.text()

    // Parse XML to JavaScript object
    const parser = new xml2js.Parser({ explicitArray: false })
    const result = await parser.parseStringPromise(xmlText)

    // Transform the parsed object into a more friendly JSON structure
    const versions = result.versions.version
    const transformedData = Array.isArray(versions) ? versions : [versions]

    /**
     * @typedef {Object} Version
     * @property {string} type - The type of the version.
     * @property {string} creation_date - The creation date of the version.
     * @property {string} version - The version number or identifier.
     */

    /**
     * @type {{versions: Version[]}}
     */
    const jsonResult = {
      versions: transformedData.map((v) => ({
        type: v.$.type,
        creation_date: v.$.creation_date,
        version: v._
      }))
    }

    return jsonResult
  } catch (error) {
    console.error('Error fetching KMS concept versions:', error)
    throw error
  }
}

export default getKmsConceptVersions
