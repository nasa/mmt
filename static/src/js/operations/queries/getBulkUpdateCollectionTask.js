import { gql } from '@apollo/client'

export const GET_BULK_UPDATE_COLLECTION_TASK = gql`
  query GetBulkUpdateCollectionTask ($params: BulkUpdateCollectionTaskInput!) {
    bulkUpdateCollectionTask (params: $params) {
      taskId
      name
      createdAt
      status
      statusMessage
      requestJsonBody
      collectionStatuses {
        conceptId
        status
        statusMessage
      }
    }
  }
`

// Example Variables:
// {
//   "params": {
//     "providerId": "MMT_2",
//     "taskId": "BU-1005"
//   }
// }
