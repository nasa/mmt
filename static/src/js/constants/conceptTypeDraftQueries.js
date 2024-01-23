import { SERVICE_DRAFT } from '../operations/queries/getServiceDraft'
import { TOOL_DRAFT } from '../operations/queries/getToolDraft'
import { VARIABLE_DRAFT } from '../operations/queries/getVariableDraft'

const conceptTypeDraftQueries = {
  Collection: TOOL_DRAFT,
  Service: SERVICE_DRAFT,
  Tool: TOOL_DRAFT,
  Variable: VARIABLE_DRAFT
}

export default conceptTypeDraftQueries
