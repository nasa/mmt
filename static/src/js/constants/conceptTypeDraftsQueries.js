import { GET_SERVICE_DRAFTS } from '../operations/queries/getServiceDrafts'
import { GET_TOOL_DRAFTS } from '../operations/queries/getToolDrafts'

const conceptTypeDraftsQueries = {
  Collection: GET_TOOL_DRAFTS,
  Service: GET_SERVICE_DRAFTS,
  Tool: GET_TOOL_DRAFTS,
  Variable: GET_TOOL_DRAFTS
}

export default conceptTypeDraftsQueries
