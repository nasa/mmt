import { GET_GRANULES } from '@/js/operations/queries/getGranules'

const granuleResults = {
  request: {
    query: GET_GRANULES,
    variables: {
      params: {
        conceptId: 'C1200000104-MMT_2'
      }
    }
  },
  result: {
    data: {
      collection: {
        shortName: '10099-2',
        granules: {
          count: 2,
          items: [
            {
              conceptId: 'G1200484635-CMR_ONLY',
              title: 'jteague_granule2',
              revisionDate: '2025-04-29T18:18:54.983Z',
              __typename: 'Granule'
            },
            {
              conceptId: 'G1200484638-CMR_ONLY',
              title: 'jteague_granule2321',
              revisionDate: '2025-04-29T18:20:50.608Z',
              __typename: 'Granule'
            }
          ],
          __typename: 'GranuleList'
        },
        __typename: 'Collection'
      }
    }
  }
}
export default granuleResults
