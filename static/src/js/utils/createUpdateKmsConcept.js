import { getApplicationConfig } from 'sharedUtils/getConfig'

export const createUpdateKmsConcept = async (rdfData, userNote, version, scheme) => {
  const { kmsHost } = getApplicationConfig()
  // In case of published version, use 'published' instead of the version label
  let versionParam = version.version
  if (version.version_type === 'published') {
    versionParam = 'published'
  }

  try {
    const endpoint = `${kmsHost}/concept?version=${versionParam}&scheme=${scheme}`
    const response = await fetch(endpoint, {
      method: 'PUT',
      body: rdfData,
      userNote
    })
    if (!response.ok) {
      throw new Error(`createUpdateKmsConcept HTTP error! status: ${response.status}`)
    }
  } catch (error) {
    console.error('Error in createUpdateKmsConcept:', error)
    throw error
  }
}
