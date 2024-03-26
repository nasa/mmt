import { gql } from '@apollo/client'

export const GET_VARIABLE = gql`
  query Variable($params: VariableInput, $collectionsParams: CollectionsInput) {
    variable(params: $params) {
      additionalIdentifiers
      associationDetails
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
      providerId
      relatedUrls
      revisionDate
      revisionId
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
      collections (params: $collectionsParams) {
        count
        items {
          conceptId
          entryTitle
          shortName
          version
          provider
          title
        }
      }
    }
  }
`

// Example Variables:
// {
//   "params": {
//     "conceptId": "V1200000096-MMT_2",
//   }
// }
