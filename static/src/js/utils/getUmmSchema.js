import ummCSchema from '../schemas/umm/ummCSchema'
import ummSSchema from '../schemas/umm/ummSSchema'
import ummTSchema from '../schemas/umm/ummTSchema'
import ummVarSchema from '../schemas/umm/ummVarSchema'
import otherSchemasVisSchema from '../schemas/otherSchemasVisSchema'
import otherSchemasCitSchema from '../schemas/otherSchemasCitSchema'

/**
 * Returns the UMM Schema of the provided conceptType
 * @param {String} conceptType Concept Type of the schema to return
 */
const getUmmSchema = (conceptType) => {
  switch (conceptType) {
    case 'Collection':
      return ummCSchema
    case 'Service':
      return ummSSchema
    case 'Tool':
      return ummTSchema
    case 'Variable':
      return ummVarSchema
    case 'Visualization':
      return otherSchemasVisSchema
    case 'Citation':
      return otherSchemasCitSchema
    default:
      return null
  }
}

export default getUmmSchema
