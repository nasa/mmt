import {
  GET_COLLECTIONS_SHORT_NAME_VERSION
} from '@/js/operations/queries/getCollectionsShortNameVersion'

import constructDownloadableFile from '@/js/utils/constructDownloadableFile'
import downloadBulkUpdateTaskCsv from '../downloadBulkUpdateTaskCsv'

vi.mock('@/js/utils/constructDownloadableFile')

const buildCollectionItem = (conceptId, shortName, version) => ({
  conceptId,
  shortName,
  version
})

const buildApolloClient = (items = []) => ({
  query: vi.fn().mockResolvedValue({ data: { collections: { items } } })
})

describe('downloadBulkUpdateTaskCsv', () => {
  test('builds and downloads a CSV with one row per collection status', async () => {
    const apolloClient = buildApolloClient([
      buildCollectionItem('C1-MMT_2', 'ShortName1', '1'),
      buildCollectionItem('C2-MMT_2', 'ShortName2', '2')
    ])

    const task = {
      taskId: 'BU-1005',
      collectionStatuses: [
        {
          conceptId: 'C1-MMT_2',
          status: 'UPDATED',
          statusMessage: null
        },
        {
          conceptId: 'C2-MMT_2',
          status: 'FAILED',
          statusMessage: 'Validation error'
        }
      ]
    }

    await downloadBulkUpdateTaskCsv({
      apolloClient,
      task
    })

    expect(apolloClient.query).toHaveBeenCalledTimes(1)
    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_COLLECTIONS_SHORT_NAME_VERSION,
      variables: {
        params: {
          conceptId: ['C1-MMT_2', 'C2-MMT_2'],
          limit: 2
        }
      }
    })

    expect(constructDownloadableFile).toHaveBeenCalledTimes(1)

    const [csv, fileName, mimeType] = constructDownloadableFile.mock.calls[0]

    expect(fileName).toBe('BU-1005.csv')
    expect(mimeType).toBe('text/csv')
    expect(csv).toBe(
      'Concept ID,Short Name,Version,Status,Details\n'
      + 'C1-MMT_2,ShortName1,1,UPDATED,\n'
      + 'C2-MMT_2,ShortName2,2,FAILED,Validation error'
    )
  })

  test('still includes a row for a conceptId GET_COLLECTIONS_SHORT_NAME_VERSION does not return', async () => {
    const apolloClient = buildApolloClient()

    const task = {
      taskId: 'BU-1006',
      collectionStatuses: [
        {
          conceptId: 'C1-MMT_2',
          status: 'FAILED',
          statusMessage: 'Collection not found'
        }
      ]
    }

    await downloadBulkUpdateTaskCsv({
      apolloClient,
      task
    })

    const [csv] = constructDownloadableFile.mock.calls[0]

    expect(csv).toBe(
      'Concept ID,Short Name,Version,Status,Details\n'
      + 'C1-MMT_2,,,FAILED,Collection not found'
    )
  })

  test('escapes a field containing a comma, quote, or newline', async () => {
    const apolloClient = buildApolloClient([buildCollectionItem('C1-MMT_2', 'ShortName1', '1')])

    const task = {
      taskId: 'BU-1007',
      collectionStatuses: [
        {
          conceptId: 'C1-MMT_2',
          status: 'FAILED',
          statusMessage: 'Error: "bad" value, at line\nnext'
        }
      ]
    }

    await downloadBulkUpdateTaskCsv({
      apolloClient,
      task
    })

    const [csv] = constructDownloadableFile.mock.calls[0]

    expect(csv).toBe(
      'Concept ID,Short Name,Version,Status,Details\n'
      + 'C1-MMT_2,ShortName1,1,FAILED,"Error: ""bad"" value, at line\nnext"'
    )
  })

  test('quotes a field containing only a carriage return', async () => {
    const apolloClient = buildApolloClient([buildCollectionItem('C1-MMT_2', 'ShortName1', '1')])

    const task = {
      taskId: 'BU-1009',
      collectionStatuses: [
        {
          conceptId: 'C1-MMT_2',
          status: 'FAILED',
          statusMessage: 'bad\rvalue'
        }
      ]
    }

    await downloadBulkUpdateTaskCsv({
      apolloClient,
      task
    })

    const [csv] = constructDownloadableFile.mock.calls[0]

    expect(csv).toBe(
      'Concept ID,Short Name,Version,Status,Details\n'
      + 'C1-MMT_2,ShortName1,1,FAILED,"bad\rvalue"'
    )
  })

  test.each([
    ['=1+1', "'=1+1"],
    ['+1', "'+1"],
    ['-1', "'-1"],
    ['@SUM(A1)', "'@SUM(A1)"],
    ['\tvalue', "'\tvalue"],
    ['\rvalue', '"\'\rvalue"']
  ])(
    "prefixes a field starting with a formula-triggering character with ' (%s)",
    async (statusMessage, expectedField) => {
      const apolloClient = buildApolloClient([buildCollectionItem('C1-MMT_2', 'ShortName1', '1')])

      const task = {
        taskId: 'BU-1010',
        collectionStatuses: [
          {
            conceptId: 'C1-MMT_2',
            status: 'FAILED',
            statusMessage
          }
        ]
      }

      await downloadBulkUpdateTaskCsv({
        apolloClient,
        task
      })

      const [csv] = constructDownloadableFile.mock.calls[0]

      expect(csv).toBe(
        'Concept ID,Short Name,Version,Status,Details\n'
        + `C1-MMT_2,ShortName1,1,FAILED,${expectedField}`
      )
    }
  )

  test('chunks the GET_COLLECTIONS_SHORT_NAME_VERSION lookup for a conceptId list larger than CMR\'s page_size max', async () => {
    const apolloClient = buildApolloClient()

    // One more than CHUNK_SIZE (CMR's documented page_size max of 2000) -- the smallest
    // list that forces a second chunk.
    const collectionStatuses = Array.from({ length: 2001 }, (_, index) => ({
      conceptId: `C${index}-MMT_2`,
      status: 'UPDATED',
      statusMessage: null
    }))

    await downloadBulkUpdateTaskCsv({
      apolloClient,
      task: {
        taskId: 'BU-1008',
        collectionStatuses
      }
    })

    expect(apolloClient.query).toHaveBeenCalledTimes(2)

    const [[firstCall], [secondCall]] = apolloClient.query.mock.calls

    expect(firstCall.variables.params.conceptId).toHaveLength(2000)
    expect(secondCall.variables.params.conceptId).toHaveLength(1)
  })
})
