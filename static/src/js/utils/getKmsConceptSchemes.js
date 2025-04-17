import xml2js from 'xml2js'
import { getApplicationConfig } from 'sharedUtils/getConfig'

const getKmsConceptSchemes = async (version) => {
  console.log('GET ConceptScheme called with version=', version.version)
  const { kmsHost } = getApplicationConfig()
  try {
    const response = await fetch(`${kmsHost}/concept_schemes/?version=${version.version}`, {
      method: 'GET'
    })

    if (!response.ok) {
      throw new Error(`getKmsConceptSchemes HTTP error! status: ${response.status}`)
    }

    const xmlText = await response.text()

    // Parse XML to JavaScript object
    const parser = new xml2js.Parser({ explicitArray: false })
    const result = await parser.parseStringPromise(xmlText)

    // Transform the parsed object into JSON structure
    const schemes = result.schemes.scheme
    const transformedData = Array.isArray(schemes) ? schemes : [schemes]

    const jsonResult = {
      schemes: transformedData.map((s) => (s ? {
        name: s.$.name,
        longName: s.$.longName,
        updateDate: s.$.updateDate,
        csvHeaders: s.$.csvHeaders ? s.$.csvHeaders.split(',') : []
      } : null)).filter(Boolean)
    }

    return jsonResult
  } catch (error) {
    console.error('Error fetching KMS concept schemes:', error)
    throw error
  }
}

export default getKmsConceptSchemes
