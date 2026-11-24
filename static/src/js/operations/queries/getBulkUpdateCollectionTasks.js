import { gql } from '@apollo/client'

export const GET_BULK_UPDATE_COLLECTION_TASKS = gql`
  query GetBulkUpdateCollectionTasks ($params: BulkUpdateCollectionTasksInput!) {
    bulkUpdateCollectionTasks (params: $params) {
      items {
        taskId
        name
        createdAt
        status
        statusMessage
        requestJsonBody
      }
    }
  }
`

// Example Variables:
// {
//   "params": {
//     "providerId": "MMT_2"
//   }
// }
