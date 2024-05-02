import { GET_COLLECTION } from '@/js/operations/queries/getCollection'
import { GET_COLLECTIONS } from '@/js/operations/queries/getCollections'
import { GET_ORDER_OPTION } from '@/js/operations/queries/getOrderOption'
import { GET_ORDER_OPTIONS } from '@/js/operations/queries/getOrderOptions'
import { GET_SERVICE } from '@/js/operations/queries/getService'
import { GET_SERVICES } from '@/js/operations/queries/getServices'
import { GET_TOOL } from '@/js/operations/queries/getTool'
import { GET_TOOLS } from '@/js/operations/queries/getTools'
import { GET_VARIABLE } from '@/js/operations/queries/getVariable'
import { GET_VARIABLES } from '@/js/operations/queries/getVariables'

const conceptTypeQueries = {
  Collection: GET_COLLECTION,
  Collections: GET_COLLECTIONS,
  OrderOption: GET_ORDER_OPTION,
  OrderOptions: GET_ORDER_OPTIONS,
  Service: GET_SERVICE,
  Services: GET_SERVICES,
  Tool: GET_TOOL,
  Tools: GET_TOOLS,
  Variable: GET_VARIABLE,
  Variables: GET_VARIABLES
}

export default conceptTypeQueries
