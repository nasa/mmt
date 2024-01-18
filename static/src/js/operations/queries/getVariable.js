import { gql } from '@apollo/client'

export const GET_VARIABLE = gql`
  query Variable($params: VariableInput) {
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
