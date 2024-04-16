import ummCSchema from './ummCSchema'

const ummCTemplateSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: false,
  properties: {
    TemplateName: {
      description: 'The language used in the metadata record.',
      $ref: '#/definitions/TemplateType'
    },
    ...ummCSchema.properties
  },
  required: ['TemplateName', ...ummCSchema.required],
  definitions: {
    TemplateType: {
      description: 'The name associated with the collection template',
      type: 'string',
      minLength: 1,
      maxLength: 85
    },
    ...ummCSchema.definitions
  }
}

export default ummCTemplateSchema
