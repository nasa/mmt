import { gql } from '@apollo/client'

export const GET_VARIABLE = gql`
  query GetVariable($params: VariableInput, $collectionsParams: CollectionsInput) {
    variable(params: $params) {
      additionalIdentifiers
      associationDetails
      collections (params: $collectionsParams) {
        count
        items {
          conceptId
          provider
          shortName
          title
          version
        }
      }
      conceptId
      dataType
      definition
      dimensions
      fillValues
      indexRanges
      instanceInformation
      longName
      measurementIdentifiers
      name
      nativeId
      offset
      pageTitle: name
      providerId
      relatedUrls
      revisionDate
      revisionId
      revisions {
        count
        items {
          conceptId
          revisionDate
          revisionId
          userId
        }
      }
      samplingIdentifiers
      scale
      scienceKeywords
      sets
      standardName
      ummMetadata
      units
      validRanges
      variableSubType
      variableType
    }
  }
`

// Example Variables:
// {
//   "params": {
//     "conceptId": "V1200000096-MMT_2",
//   }
// }
