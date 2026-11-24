import { gql } from '@apollo/client'

// Used to enrich a bulk-update task's conceptIds with shortName/version. Deliberately
// narrower than GET_COLLECTIONS -- fields like granules.count and tagDefinitions aren't
// needed here, and are expensive to resolve across what can be a large list of conceptIds.
export const GET_COLLECTIONS_SHORT_NAME_VERSION = gql`
  query GetCollectionsShortNameVersion($params: CollectionsInput) {
    collections(params: $params) {
      items {
        conceptId
        shortName
        version
      }
    }
  }
`
