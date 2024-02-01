import { GET_SERVICE_DRAFTS } from '../operations/queries/getServiceDrafts'
import { GET_TOOL_DRAFTS } from '../operations/queries/getToolDrafts'
import { GET_VARIABLE_DRAFTS } from '../operations/queries/getVariableDrafts'
import { GET_COLLECTION_DRAFTS } from '../operations/queries/getCollectionDrafts'

const conceptTypeDraftsQueries = {
  Collection: GET_COLLECTION_DRAFTS,
  Service: GET_SERVICE_DRAFTS,
  Tool: GET_TOOL_DRAFTS,
  Variable: GET_VARIABLE_DRAFTS
}

export default conceptTypeDraftsQueries
