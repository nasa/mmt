import { GET_COLLECTION } from '../operations/queries/getCollection'
import { GET_COLLECTIONS } from '../operations/queries/getCollections'
import { GET_SERVICE } from '../operations/queries/getService'
import { GET_SERVICES } from '../operations/queries/getServices'
import { GET_TOOL } from '../operations/queries/getTool'
import { GET_TOOLS } from '../operations/queries/getTools'
import { GET_VARIABLE } from '../operations/queries/getVariable'
import { GET_VARIABLES } from '../operations/queries/getVariables'

const conceptTypeQueries = {
  Collection: GET_COLLECTION,
  Collections: GET_COLLECTIONS,
  Service: GET_SERVICE,
  Services: GET_SERVICES,
  Tool: GET_TOOL,
  Tools: GET_TOOLS,
  Variable: GET_VARIABLE,
  Variables: GET_VARIABLES
}

export default conceptTypeQueries
