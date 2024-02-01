import { gql } from '@apollo/client'

export const VARIABLE_DRAFT = gql`
  query VariableDraft($params: DraftInput) {
    draft(params: $params) {
      conceptId
      conceptType
      deleted
      name
      nativeId
      providerId
      revisionDate
      revisionId
      ummMetadata
      previewMetadata {
        ... on Variable {
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
          relatedUrls
          samplingIdentifiers
          scale
          scienceKeywords
          sets
          standardName
          units
          validRanges
          variableSubType
          variableType
        }
      }
    }
  }
`

// Example Variables:
// {
//   "params": {
//     "conceptId": "VD1200000096-MMT_2",
//     "conceptType": "Variable"
//   }
// }
