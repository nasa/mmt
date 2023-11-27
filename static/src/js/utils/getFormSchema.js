import { kebabCase } from 'lodash'

/**
 * Gets the form schema based on the current section
 * @param {Object} fullSchema A full schema.
 * @param {Object[]} formConfigurations A configurations of the form with the list of field in each section.
 * @param {string} formName A form's title.
 */
const getFormSchema = ({
  fullSchema,
  formConfigurations,
  formName
}) => {
  const config = formConfigurations
    .find((formConfig) => kebabCase(formConfig.displayName) === formName)
  const { properties } = config

  const schemaProperties = {}
  properties.forEach((property) => {
    schemaProperties[property] = fullSchema.properties[property]
  })

  const required = fullSchema.required.filter((field) => properties.includes(field))

  return {
    $id: fullSchema.$id,
    $schema: fullSchema.$schema,
    definitions: fullSchema.definitions,
    required,
    properties: schemaProperties
  }
}

export default getFormSchema
