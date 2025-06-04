import constructDownloadableFile from '@/js/utils/constructDownloadableFile'
import { getApplicationConfig } from 'sharedUtils/getConfig'

/**
 * Creates a CSV report of changes in Keyword Management System (KMS)
 *
 * @param {string} startDate - The start date of the report
 * @param {string} endDate - The end date of the report
 * @param {Object} version - The version object containing version information
 * @param {String} userId - The EDL user id
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
      const data = await responseObject.text()
      constructDownloadableFile(data, `KeywordUpdateReport-${startDate}-${endDate}`, 'text/csv')
    })
      .catch((error) => {
        throw new Error(`Failed to download report ${error.message}`)
      })
  } catch (error) {
    console.error('Error in kmsGetConceptUpdatesReport:', error)
    throw error
  }
}
