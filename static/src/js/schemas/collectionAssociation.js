const collectionAssociation = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'collection-association',
  type: 'object',
  additionalProperties: false,
  properties: {
    SearchField: {
      title: 'Search Field',
      $ref: '#/definitions/SearchFieldType'
    },
    ProviderFilter: {
      type: 'boolean',
      // Title: 'Provider Filter',
      description: 'This is the radio-description',
      default: true
    }
  },
  required: [
    'SearchField'
    // 'ProviderFilter'
  ],

  definitions: {
    SearchFieldType: {
      type: 'object',
      oneOf: [
        {
          additionalProperties: false,
          title: 'Concept Id',
          properties: {
            ConceptId: {
              description: 'Concept id of the collection record',
              type: 'string'
            }
          }
        },
        {
          additionalProperties: false,
          title: 'Data Center',
          properties: {
            DataCenter: {
              description: 'This field supports wildcard searches. Use an asterisk (*) to find collections that match zero or more characters at the beginning, middle or end of your term.',
              type: 'string'
            }
          }
        },
        {
          additionalProperties: false,
          title: 'Platform',
          properties: {
            Platform: {
              description: 'This field supports wildcard searches. Use an asterisk (*) to find collections that match zero or more characters at the beginning, middle or end of your term.',
              type: 'string'
            }
          }
        },
        {
          additionalProperties: false,
          title: 'Processing Level ID',
          properties: {
            ProcessingLevelId: {
              description: 'Processing Level ID of the collection record',
              type: 'string'
            }
          }
        },
        {
          additionalProperties: false,
          title: 'Project',
          properties: {
            Project: {
              description: 'This field supports wildcard searches. Use an asterisk (*) to find collections that match zero or more characters at the beginning, middle or end of your term.',
              type: 'string'
            }
          }
        },
        {
          additionalProperties: false,
          title: 'Short Name',
          properties: {
            ShortName: {
              description: 'This field supports wildcard searches. Use an asterisk (*) to find collections that match zero or more characters at the beginning, middle or end of your term.',
              type: 'string'
            }
          }
        }
      ]
    }
  }
}

export default collectionAssociation
