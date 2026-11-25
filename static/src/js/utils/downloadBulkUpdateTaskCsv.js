import {
  GET_COLLECTIONS_SHORT_NAME_VERSION
} from '@/js/operations/queries/getCollectionsShortNameVersion'

import constructDownloadableFile from '@/js/utils/constructDownloadableFile'

// GET_COLLECTIONS_SHORT_NAME_VERSION's `limit` becomes CMR's own `page_size` parameter
// (see cmr-graphql's handlePagingParams), which CMR's search API docs cap at 2000 -- a
// chunk larger than that would have CMR silently return fewer items than conceptIds
// requested, dropping some shortName/version lookups instead of erroring.
const CHUNK_SIZE = 2000

const CSV_HEADER = ['Concept ID', 'Short Name', 'Version', 'Status', 'Details']

// A leading =, +, -, @, tab, or carriage return is read as a formula by Excel/Sheets --
// prefixing it with ' keeps the cell as plain text when the file is opened, which matters
// here since shortName/statusMessage can carry values CMR didn't generate itself.
const FORMULA_TRIGGER_PREFIX = /^[=+\-@\t\r]/

// Wraps a field in quotes (doubling any embedded quotes) only when it contains a comma,
// quote, or line break (\n or \r) -- per the standard CSV escaping rule, any of those
// would otherwise corrupt the column structure or line breaks when the file is opened.
const escapeCsvField = (value) => {
  let text = value == null ? '' : String(value)

  if (FORMULA_TRIGGER_PREFIX.test(text)) {
    text = `'${text}`
  }

  if (/[",\r\n]/.test(text)) {
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
