import { GET_CITATION_DRAFTS } from '../operations/queries/getCitationDrafts'
import { GET_COLLECTION_DRAFTS } from '../operations/queries/getCollectionDrafts'
import { GET_SERVICE_DRAFTS } from '../operations/queries/getServiceDrafts'
import { GET_TOOL_DRAFTS } from '../operations/queries/getToolDrafts'
import { GET_VARIABLE_DRAFTS } from '../operations/queries/getVariableDrafts'
import { GET_VISUALIZATION_DRAFTS } from '../operations/queries/getVisualizationDrafts'

const conceptTypeDraftsQueries = {
  Citation: GET_CITATION_DRAFTS,
  Collection: GET_COLLECTION_DRAFTS,
  Service: GET_SERVICE_DRAFTS,
  Tool: GET_TOOL_DRAFTS,
  Variable: GET_VARIABLE_DRAFTS,
  Visualization: GET_VISUALIZATION_DRAFTS
}

export default conceptTypeDraftsQueries
