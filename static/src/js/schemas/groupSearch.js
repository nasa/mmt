const groupSearch = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Group Search',
  type: 'object',
  additionalProperties: false,
  properties: {
    name: {
      description: 'The name of the group.',
      type: 'string'
    },
    providers: {
      description: 'The provider of the group.',
      type: 'array',
      items: {
        type: 'string',
        enum: ['MMT_1', 'MMT_2'] // Overwritten by GroupSearchForm.jsx
      }
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
  required: ['providers']
}

export default groupSearch
