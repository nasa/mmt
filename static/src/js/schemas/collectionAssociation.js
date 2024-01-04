const collectionAssociation = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'collection-association',
  type: 'object',
  additionalProperties: false,
  properties: {
    SearchField: {
      $ref: '#/definitions/SearchFieldType'
    }
  },
  required: [
    'SearchField'
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
          title: 'Short Name',
          properties: {
            ShortName: {
              description: 'Short Name of the collection record',
              type: 'string'
            }
          }
        },
        {
          additionalProperties: false,
          title: 'Data Center',
          properties: {
            DataCenter: {
              description: 'Data Center of the collection record',
              type: 'string'
            }
          }
        },
        {
          additionalProperties: false,
          title: 'Platform',
          properties: {
            Platform: {
              description: 'Platform of the collection record',
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
          title: 'Revision Date',
          properties: {
            RevisionDate: {
              description: 'Revision Date of the collection record',
              format: 'date-time',
              type: 'string'
            }
          }
        },
        {
          additionalProperties: false,
          title: 'Revision Date',
          properties: {
            RevisionDate: {
              description: 'Revision Date of the collection record',
              format: 'date-time',
              type: 'string'
            }
          }
        },
        {
          additionalProperties: false,
          title: 'Temporal Extent',
          properties: {
            RangeStart: {
              description: 'Range Start of the collection record',
              format: 'date-time',
              type: 'string'
            },
            RangeEnd: {
              description: 'Range End of the collection record',
              format: 'date-time',
              type: 'string'
            }
          }
        }
      ]
    }
  }
}

export default collectionAssociation
