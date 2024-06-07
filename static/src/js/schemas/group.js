const group = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'group',
  type: 'object',
  additionalProperties: false,
  properties: {
    name: {
      description: 'The name of the group.',
      type: 'string',
      minLength: 1,
      maxLength: 85
    },
    description: {
      description: 'The description of the group.',
      type: 'string',
      minLength: 1,
      maxLength: 255
    },
    members: {
      description: 'Group Members',
      type: 'array',
      items: {
        description: 'Member',
        type: 'object',
        additionalProperties: false,
        properties: {
          label: {
            type: 'string'
          },
          id: {
            type: 'string'
          }
        }
      }
    }
  },
  required: ['name', 'description']
}

export default group
