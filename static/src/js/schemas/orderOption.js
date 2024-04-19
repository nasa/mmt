const orderOption = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'order-option',
  type: 'object',
  additionalProperties: false,
  properties: {
    name: {
      description: 'The name of the order option.',
      type: 'string',
      minLength: 1,
      maxLength: 85
    },
    sortKey: {
      description: 'The sort key of the order option.',
      type: 'string',
      minLength: 1,
      maxLength: 85
    },
    description: {
      description: 'The description of the order option.',
      type: 'string',
      minLength: 1,
      maxLength: 1024
    },
    form: {
      description: 'The XML of the order option.',
      type: 'string',
      minLength: 1,
      maxLength: 1024
    }
  },
  required: ['name', 'description', 'form']
}
export default orderOption
