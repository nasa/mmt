import xml2js from 'xml2js'
import { getApplicationConfig } from '../../../../sharedUtils/getConfig'

const getKmsConceptVersions = async () => {
  const { kmsHost } = getApplicationConfig()
  try {
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
