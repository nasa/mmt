import { DELETE_COLLECTION } from '@/js/operations/mutations/deleteCollection'
import { DELETE_SERVICE } from '@/js/operations/mutations/deleteService'
import { DELETE_TOOL } from '@/js/operations/mutations/deleteTool'
import { DELETE_VARIABLE } from '@/js/operations/mutations/deleteVariable'
import { DELETE_VISUALIZATION } from '@/js/operations/mutations/deleteVisualization'
import { DELETE_CITATION } from '@/js/operations/mutations/deleteCitation'

const deleteMutationTypes = {
  Collection: DELETE_COLLECTION,
  Service: DELETE_SERVICE,
  Tool: DELETE_TOOL,
  Variable: DELETE_VARIABLE,
  Visualization: DELETE_VISUALIZATION,
  Citation: DELETE_CITATION
}

export default deleteMutationTypes
