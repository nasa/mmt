import { DELETE_COLLECTION } from '../operations/mutations/deleteCollection'
import { DELETE_SERVICE } from '../operations/mutations/deleteService'
import { DELETE_TOOL } from '../operations/mutations/deleteTool'
import { DELETE_VARIABLE } from '../operations/mutations/deleteVariable'

const deleteMutationTypes = {
  Collection: DELETE_COLLECTION,
  Service: DELETE_SERVICE,
  Tool: DELETE_TOOL,
  Variable: DELETE_VARIABLE
}

export default deleteMutationTypes
