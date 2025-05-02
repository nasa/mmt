import ummVisRootDefinitions from '../schemas/umm/ummVisSchema/ummVisRootDefinitions'
import ummVisRootSchema from '../schemas/umm/ummVisSchema/ummVisRootSchema'
import ummVisTilesSchema from '../schemas/umm/ummVisSchema/tiles/ummVisTilesSchema'
import ummVisTilesDefinitions from '../schemas/umm/ummVisSchema/tiles/ummVisTilesDefinitions'
import ummVisMapsSchema from '../schemas/umm/ummVisSchema/maps/ummVisMapsSchema'

const getCombinedUmmVisSchema = () => {
  // Combine all definitions
  const combinedDefinitions = {
    ...ummVisRootDefinitions[0].definitions,
    ...ummVisTilesDefinitions[0].definitions,
    ...ummVisMapsSchema[0].definitions
  }

  // Combine root schema with tiles and maps schemas
  const combinedSchema = {
    ...ummVisRootSchema[0],
    definitions: combinedDefinitions
  }

  // Add tiles and maps specific properties
  combinedSchema.properties.Specification = {
    oneOf: [
      ummVisTilesSchema[0].properties.Specification,
      ummVisMapsSchema[0].definitions.Specification
    ]
  }

  combinedSchema.properties.Generation = {
    oneOf: [
      ummVisTilesSchema[0].properties.Generation,
      ummVisMapsSchema[0].definitions.Generation
    ]
  }

  // Function to update references
  const updateReferences = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj

    if (Array.isArray(obj)) {
      return obj.map(updateReferences)
    }

    return Object.keys(obj).reduce((acc, key) => {
      const value = obj[key]
      if (key === '$ref') {
        if (value.startsWith('definitions.json#/definitions/') || value.startsWith('../definitions.json#/definitions/')) {
          return {
            ...acc,
            [key]: value.replace(/(\.\.\/)?definitions\.json#\/definitions\//, '#/definitions/')
          }
        }

        if (value.startsWith('tiles/schema.json#/properties/')) {
          return {
            ...acc,
            [key]: value.replace('tiles/schema.json#/properties/', '#/definitions/')
          }
        }

        if (value.startsWith('maps/schema.json#/properties/')) {
          return {
            ...acc,
            [key]: value.replace('maps/schema.json#/properties/', '#/definitions/')
          }
        }

        return {
          ...acc,
          [key]: value
        }
      }

      return {
        ...acc,
        [key]: updateReferences(value)
      }
    }, {})
  }

  // Update all references in the combined schema
  const updatedSchema = updateReferences(combinedSchema)

  return updatedSchema
}

export default getCombinedUmmVisSchema
