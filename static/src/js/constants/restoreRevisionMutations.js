import { RESTORE_COLLECTION_REVISION } from '../operations/mutations/restoreCollectionRevision'
import { RESTORE_SERVICE_REVISION } from '../operations/mutations/restoreServiceRevision'
import { RESTORE_TOOL_REVISION } from '../operations/mutations/restoreToolRevision'
import { RESTORE_VARIABLE_REVISION } from '../operations/mutations/restoreVariableRevision'

const restoreRevisionMutations = {
  Collection: RESTORE_COLLECTION_REVISION,
  Service: RESTORE_SERVICE_REVISION,
  Tool: RESTORE_TOOL_REVISION,
  Variable: RESTORE_VARIABLE_REVISION
}

export default restoreRevisionMutations
