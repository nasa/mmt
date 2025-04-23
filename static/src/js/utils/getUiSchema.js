import collectionsUiSchema from '../schemas/uiSchemas/collections'
import serviceUiSchema from '../schemas/uiSchemas/services'
import toolsUiSchema from '../schemas/uiSchemas/tools'
import variableUiSchema from '../schemas/uiSchemas/variables'

/**
 * Returns the UI Schema of the provided conceptType
 * @param {String} conceptType Concept Type of the schema to return
 */
const getUiSchema = (conceptType) => {
  switch (conceptType) {
    case 'Collection':
      return collectionsUiSchema
    case 'Service':
      return serviceUiSchema
    case 'Tool':
      return toolsUiSchema
    case 'Variable':
      return variableUiSchema
    default:
      return null
  }
}

export default getUiSchema
