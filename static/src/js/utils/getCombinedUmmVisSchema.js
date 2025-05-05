import ummVisRootDefinitions from '../schemas/umm/ummVisSchema/ummVisRootDefinitions'
import ummVisRootSchema from '../schemas/umm/ummVisSchema/ummVisRootSchema'
import ummVisTilesSchema from '../schemas/umm/ummVisSchema/tiles/ummVisTilesSchema'
import ummVisTilesDefinitions from '../schemas/umm/ummVisSchema/tiles/ummVisTilesDefinitions'
import ummVisMapsSchema from '../schemas/umm/ummVisSchema/maps/ummVisMapsSchema'

const getCombinedUmmVisSchema = () => {
  const rootSchema = ummVisRootSchema[0]
  const rootDefinitions = ummVisRootDefinitions[0].definitions
  const tilesDefinitions = ummVisTilesDefinitions[0].definitions
  const tilesSchema = ummVisTilesSchema[0]
  const mapsSchema = ummVisMapsSchema[0]

  // Combine the schemas
  const combinedSchema = {
    ...rootSchema,
    definitions: {
      ...rootDefinitions,
      ...tilesDefinitions,
      ...mapsSchema.definitions,
      Specification: {
        oneOf: [
          tilesSchema.properties.Specification,
          mapsSchema.definitions.Specification
        ]
      },
      Generation: {
        oneOf: [
          tilesSchema.properties.Generation,
          mapsSchema.definitions.Generation
        ]
      }
    }
  }

  // Update references
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
      }

      return {
        ...acc,
        [key]: updateReferences(value)
      }
    }, {})
  }

  const updatedSchema = updateReferences(combinedSchema)

  // Update the allOf section
  if (updatedSchema.allOf) {
    updatedSchema.allOf = updatedSchema.allOf.map(condition => {
      if (condition.then && condition.then.properties) {
        if (condition.then.properties.Specification) {
          condition.then.properties.Specification.$ref = '#/definitions/Specification'
        }
        if (condition.then.properties.Generation) {
          condition.then.properties.Generation.$ref = '#/definitions/Generation'
        }
      }
      return condition
    })
  }

  return updatedSchema
}

export default getCombinedUmmVisSchema
