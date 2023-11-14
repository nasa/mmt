import { kebabCase } from 'lodash'

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
