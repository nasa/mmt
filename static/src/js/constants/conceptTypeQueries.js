import { GET_COLLECTION } from '../operations/queries/getCollection'
import { GET_COLLECTIONS } from '../operations/queries/getCollections'
import { GET_SERVICE } from '../operations/queries/getService'
import { GET_TOOL } from '../operations/queries/getTool'
import { GET_VARIABLE } from '../operations/queries/getVariable'

const conceptTypeQueries = {
  Collection: GET_COLLECTION,
  Collections: GET_COLLECTIONS,
  Service: GET_SERVICE,
  Tool: GET_TOOL,
  Variable: GET_VARIABLE
}

export default conceptTypeQueries
