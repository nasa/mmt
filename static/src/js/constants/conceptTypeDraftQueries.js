import { SERVICE_DRAFT } from '../operations/queries/getServiceDraft'
import { TOOL_DRAFT } from '../operations/queries/getToolDraft'

const conceptTypeDraftQueries = {
  Collection: TOOL_DRAFT,
  Service: SERVICE_DRAFT,
  Tool: TOOL_DRAFT,
  Variable: TOOL_DRAFT
}

export default conceptTypeDraftQueries
