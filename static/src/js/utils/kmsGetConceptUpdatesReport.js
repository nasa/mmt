import { getApplicationConfig } from 'sharedUtils/getConfig'

/**
 * Creates or updates a concept in the Knowledge Management System (KMS)
 *
 * @param {string} startDate - The RDF data of the concept
 * @param {string} endDate - A note provided by the user
 * @param {Object} version - The version object containing version information
 * @param {Object} userId
 * @returns {Promise<void>} - A promise that resolves when the operation is complete
 * @throws {Error} - If there's an HTTP error or any other error during the process
 */
export const kmsGetConceptUpdatesReport = async ({
  version,
  startDate,
  endDate,
  userId
}) => {
  const { kmsHost } = getApplicationConfig()
  // In case of published version, use 'published' instead of the version label
  let versionParam = version.version
  if (version.version_type === 'published') {
    versionParam = 'published'
  }

  versionParam = encodeURIComponent(versionParam)

  try {
    // Construct the endpoint URL
    let endpoint = `${kmsHost}/concepts/operations/update_report?version=${versionParam}&startDate=${startDate}&endDate=${endDate}`
    if (userId) {
      endpoint += `&userId=${userId}`
    }

    await fetch(endpoint, {
      method: 'GET'
    }).then(async (responseObject) => {
      const data = await responseObject.blob()

      // Create a blob with the text data from the response
      const blob = new Blob([data], { type: 'text/csv' })

      const url = window.URL.createObjectURL(blob)

      // Create a hyperlink to the blob and give it a filename
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `KeywordUpdateReport-${startDate}-${endDate}`)

      // Add the link to the page
      document.body.appendChild(link)

      // Click on the link to download the export file to the user's computer
      link.click()

      // Remove the link from the page
      link.parentNode.removeChild(link)
    })
      .catch((error) => {
        throw new Error(`Failed to download report ${error.message}`)
      })
  } catch (error) {
    console.error('Error in kmsGetConceptUpdatesReport:', error)
    throw error
  }
}
