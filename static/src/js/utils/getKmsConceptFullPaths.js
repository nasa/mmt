import { XMLParser } from 'fast-xml-parser'
import { castArray } from 'lodash-es'

import { getApplicationConfig } from 'sharedUtils/getConfig'

/**
 * Fetches the full path(s) for a given KMS concept UUID and returns them as an array of strings.
 *
 * @async
 * @function getKmsConceptFullPaths
 * @param {Object} params - The parameters for the function.
 * @param {string} params.uuid - The UUID of the KMS concept whose full paths are to be fetched.
 * @param {string|null} [params.version] - Optional. The version of the concept to fetch. If not provided, the latest version is used.
 * @returns {Promise<string[]>} A promise that resolves to an array of full paths as strings.
 * @throws Will throw an error if the fetch operation or XML parsing fails.
 *
 * @example
 * // Import the function
 * import { getKmsConceptFullPaths } from './getKmsConceptFullPaths';
 *
 * // Usage example
 * async function fetchConceptPaths() {
 *   try {
 *     const uuid = '123e4567-e89b-12d3-a456-426614174000';
 *     const version = '1.0'; // Optional, can be omitted
 *
 *     const paths = await getKmsConceptFullPaths({ uuid, version });
 *
 *     console.log('Concept full paths:', paths);
 *     // Example output: ['Root > Category > Subcategory > Concept']
 *   } catch (error) {
 *     console.error('Error fetching concept paths:', error);
 *   }
 * }
 *
 * // Call the function
 * fetchConceptPaths();
 */
const getKmsConceptFullPaths = async ({ uuid, version }) => {
  const { kmsHost } = getApplicationConfig()
  try {
    // Construct the base URL
    let url = `${kmsHost}/concept_fullpaths/concept_uuid/${uuid}`

    // Add version parameter only if version is not null
    if (version) {
      url += `?version=${version}`
    }

    // Fetch data from KMS server
    const response = await fetch(url, {
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
