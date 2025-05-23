import { XMLParser } from 'fast-xml-parser'

import { getApplicationConfig } from 'sharedUtils/getConfig'

/**
 * Fetches and parses KMS concept schemes from the server.
 *
 * @param {Object} version - Object containing the version information.
 * @param {string} version.version - The version string to fetch concept schemes for.
 * @returns {Promise<Object>} A promise that resolves to an object containing the parsed concept schemes.
 * @throws {Error} If there's an error fetching or parsing the data.
 *
 * @example
 * // Usage example
 * const version = { version: '1.0' };
 * try {
 *   const conceptSchemes = await getKmsConceptSchemes(version);
 *   console.log(conceptSchemes);
 *   // Output example:
 *   // {
 *   //   schemes: [
 *   //     {
 *   //       name: 'SchemeA',
 *   //       longName: 'Concept Scheme A',
 *   //       updateDate: '2023-06-01',
 *   //       csvHeaders: ['Header1', 'Header2', 'Header3']
 *   //     },
 *   //     {
 *   //       name: 'SchemeB',
 *   //       longName: 'Concept Scheme B',
 *   //       updateDate: '2023-06-02',
 *   //       csvHeaders: ['HeaderX', 'HeaderY', 'HeaderZ']
 *   //     }
 *   //   ]
 *   // }
 * } catch (error) {
 *   console.error('Error:', error);
 * }
 */
const getKmsConceptSchemes = async (version) => {
  const { kmsHost } = getApplicationConfig()
  try {
    // In case of published version, use 'published' instead of the version label
    let versionName = version.version
    if (version.version_type === 'published') {
      versionName = 'published'
    }

    // Fetch XML data from the server
    const response = await fetch(`${kmsHost}/concept_schemes/?version=${versionName}`, {
      method: 'GET'
    })

    if (!response.ok) {
      throw new Error(`getKmsConceptSchemes HTTP error! status: ${response.status}`)
    }

    const xmlText = await response.text()

    // Parse XML to JavaScript object
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_'
    })
    const result = parser.parse(xmlText)

    // Transform the parsed object into JSON structure
    const schemes = result.schemes.scheme
    const transformedData = Array.isArray(schemes) ? schemes : [schemes]

    // Create the final JSON result
    const jsonResult = {
      schemes: transformedData.map((s) => (s ? {
        name: s['@_name'],
        longName: s['@_longName'],
        updateDate: s['@_updateDate'],
        csvHeaders: s['@_csvHeaders'] ? s['@_csvHeaders'].split(',') : []
      } : null)).filter(Boolean)
    }

    return jsonResult
  } catch (error) {
    console.error('Error fetching KMS concept schemes:', error)
    throw error
  }
}

export default getKmsConceptSchemes
