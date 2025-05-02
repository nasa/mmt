import { XMLParser } from 'fast-xml-parser'
import { castArray } from 'lodash-es'

import { getApplicationConfig } from 'sharedUtils/getConfig'

/**
 * Fetches the full path(s) for a given KMS concept UUID and returns them as an array of strings.
 *
 * @async
 * @function getKmsConceptFullPaths
 * @param {string} value - The UUID of the KMS concept whose full paths are to be fetched.
 * @returns {Promise<string[]>} A promise that resolves to an array of full paths as strings.
 * @throws Will throw an error if the fetch operation or XML parsing fails.
 */
const getKmsConceptFullPaths = async (value) => {
  const { kmsHost } = getApplicationConfig()
  try {
    // Fetch data from KMS server
    const response = await fetch(`${kmsHost}/concept_fullpaths/concept_uuid/${value}`, {
      method: 'GET'
    })

    if (!response.ok) {
      throw new Error(`getConceptFullPaths HTTP error! status: ${response.status}`)
    }

    const xmlText = await response.text()

    // Parse XML to JavaScript object
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_'
    })
    const result = parser.parse(xmlText)

    // Ensure we always have an array of FullPath objects
    const fullPaths = castArray(result.FullPaths.FullPath)

    return fullPaths.map((path) => (path['#text']))
  } catch (error) {
    console.error('Error fetching KMS concept schemes:', error)
    throw error
  }
}

export { getKmsConceptFullPaths }
