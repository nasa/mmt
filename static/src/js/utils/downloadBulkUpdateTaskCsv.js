import {
  GET_COLLECTIONS_SHORT_NAME_VERSION
} from '@/js/operations/queries/getCollectionsShortNameVersion'

import constructDownloadableFile from '@/js/utils/constructDownloadableFile'

// Keeps each shortName/version lookup bounded -- a bulk-update task's conceptIds list has
// no documented upper bound, so one unbounded request isn't a safe assumption.
const CHUNK_SIZE = 150

const CSV_HEADER = ['Concept ID', 'Short Name', 'Version', 'Status', 'Details']

// Wraps a field in quotes (doubling any embedded quotes) only when it contains a comma,
// quote, or newline -- per the standard CSV escaping rule, any of those would otherwise
// corrupt the column structure or line breaks when the file is opened.
const escapeCsvField = (value) => {
  const text = value == null ? '' : String(value)

  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }

  return text
}

const chunk = (items, size) => {
  const chunks = []

  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size))
  }

  return chunks
}

/**
 * Builds a CSV report for a bulk-update task's collection statuses and triggers a browser
 * download. ShortName/version is looked up in bounded chunks, not the whole conceptId list
 * in one request -- a conceptId that lookup doesn't return (e.g. a since-deleted
 * collection) still gets a CSV row, just with blank shortName/version, rather than being
 * silently dropped from the report.
 *
 * @param {Object} params
 * @param {import('@apollo/client').ApolloClient} params.apolloClient Used for the chunked shortName/version lookup.
 * @param {Object} params.task The task to report on, shaped `{ taskId, collectionStatuses: [{ conceptId, status, statusMessage }] }`.
 */
const downloadBulkUpdateTaskCsv = async ({ apolloClient, task }) => {
  const { taskId, collectionStatuses = [] } = task

  const conceptIds = collectionStatuses.map(({ conceptId }) => conceptId)

  const chunkResults = await Promise.all(
    chunk(conceptIds, CHUNK_SIZE).map((conceptIdChunk) => (
      apolloClient.query({
        query: GET_COLLECTIONS_SHORT_NAME_VERSION,
        variables: {
          params: {
            conceptId: conceptIdChunk,
            limit: conceptIdChunk.length
          }
        }
      })
    ))
  )

  const collectionsByConceptId = new Map(
    chunkResults
      .flatMap(({ data }) => data?.collections?.items || [])
      .map((item) => [item.conceptId, item])
  )

  const rows = collectionStatuses.map(({ conceptId, status, statusMessage }) => {
    const { shortName, version } = collectionsByConceptId.get(conceptId) || {}

    return [conceptId, shortName, version, status, statusMessage]
  })

  const csv = [CSV_HEADER, ...rows]
    .map((row) => row.map(escapeCsvField).join(','))
    .join('\n')

  constructDownloadableFile(csv, `${taskId}.csv`, 'text/csv')
}

export default downloadBulkUpdateTaskCsv
