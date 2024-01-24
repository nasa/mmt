import { SERVICE_DRAFT } from '../operations/queries/getServiceDraft'
import { TOOL_DRAFT } from '../operations/queries/getToolDraft'
import { COLLECTION_DRAFT } from '../operations/queries/getCollectionDraft'

const conceptTypeDraftQueries = {
  Collection: COLLECTION_DRAFT,
  Service: SERVICE_DRAFT,
  Tool: TOOL_DRAFT,
  Variable: TOOL_DRAFT
}

export default conceptTypeDraftQueries
