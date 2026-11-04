import { gql } from '@apollo/client'

export const CREATE_BULK_UPDATE_COLLECTION_TASK = gql`
  mutation CreateBulkUpdateCollectionTask (
    $providerId: String!
    $conceptIds: [String!]!
    $name: String
    $updateType: BulkUpdateCollectionUpdateType!
    $updateField: BulkUpdateCollectionUpdateField!
    $findValue: JSON
    $updateValue: JSON
  ) {
    createBulkUpdateCollectionTask (
      providerId: $providerId
      conceptIds: $conceptIds
      name: $name
      updateType: $updateType
      updateField: $updateField
      findValue: $findValue
      updateValue: $updateValue
    ) {
      taskId
    }
  }
`

// Example Variables:
// {
//   "providerId": "MMT_2",
//   "conceptIds": ["C1200481832-MMT_2"],
//   "updateType": "FIND_AND_REPLACE",
//   "updateField": "SCIENCE_KEYWORDS",
//   "findValue": { "Category": "EARTH SCIENCE" },
//   "updateValue": { "Category": "EARTH SCIENCE" }
// }
