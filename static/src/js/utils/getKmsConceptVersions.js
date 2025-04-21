import { XMLParser } from 'fast-xml-parser'
import { getApplicationConfig } from 'sharedUtils/getConfig'

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
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
      textNodeName: 'value',
      parseAttributeValue: false, // Add this line to prevent attribute value parsing
      numberParseOptions: {
        leadingZeros: false, // Add this to preserve leading zeros
        skipLike: /^[0-9]+\.?[0-9]*$/ // Add this to skip parsing numbers with decimal points
      }
    })
    const result = parser.parse(xmlText)

    // Transform the parsed object into a more friendly JSON structure
    const versions = result.versions.version
    const transformedData = Array.isArray(versions) ? versions : [versions]

    const jsonResult = {
      versions: transformedData.map((v) => ({
        type: v.type,
        creation_date: v.creation_date,
        version: v.value // This should now preserve the original string representation
      }))
    }

    return jsonResult
  } catch (error) {
    console.error('Error fetching KMS concept versions:', error)
    throw error
  }
}

export default getKmsConceptVersions
