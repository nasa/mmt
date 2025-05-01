import { XMLParser } from 'fast-xml-parser'
import { castArray } from 'lodash-es'

import { getApplicationConfig } from 'sharedUtils/getConfig'

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
