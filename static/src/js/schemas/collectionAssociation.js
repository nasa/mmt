const collectionAssociation = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'collection-association',
  type: 'object',
  additionalProperties: false,
  properties: {
    ServiceField: {
      title: 'Service Field',
      type: 'string'
    },
    SearchField: {
      title: 'Search Field',
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
          title: 'DOI',
          properties: {
            DOI: {
              description: 'Entry Title of the collection',
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
          title: 'Entry Title',
          properties: {
            EntryTitle: {
              description: 'This field supports wildcard searches. Use an asterisk (*) to find collections that match zero or more characters at the beginning, middle or end of your term.',
              type: 'string'
            }
          }
        },
        {
          additionalProperties: false,
          title: 'Instrument',
          properties: {
            Instrument: {
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
          title: 'Revision Date',
          properties: {
            RevisionDate: {
              description: 'The last revision date the collection was updated',
              type: 'string',
              format: 'date-time'
            }
          }
        },
        {
          additionalProperties: false,
          title: 'Science Keywords',
          properties: {
            ScienceKeywords: {
              description: 'Searches for provided search term at all levels of the science keyword hierarchy.',
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
        },
        {
          additionalProperties: false,
          title: 'Spatial Keyword',
          properties: {
            SpatialKeyword: {
              description: 'This field supports wildcard searches. Use an asterisk (*) to find collections that match zero or more characters at the beginning, middle or end of your term.',
              type: 'string'
            }
          }
        },
        {
          additionalProperties: false,
          title: 'Temporal Extent',
          properties: {
            RangeStart: {
              description: 'This field supports wildcard searches. Use an asterisk (*) to find collections that match zero or more characters at the beginning, middle or end of your term.',
              format: 'date-time',
              type: 'string'
            },
            RangeEnd: {
              description: 'This field supports wildcard searches. Use an asterisk (*) to find collections that match zero or more characters at the beginning, middle or end of your term.',
              format: 'date-time',
              type: 'string'
            }
          }
        },
        {
          additionalProperties: false,
          title: 'Tiling Identification Systems',
          properties: {
            twoDCoordinateSystemName: {
              description: 'Tiling Identification System of the collection record.',
              type: 'string'
            }
          }
        },
        {
          additionalProperties: false,
          title: 'Updated Since',
          properties: {
            updatedSince: {
              description: 'Date for the last updated Collections',
              type: 'string',
              format: 'date-time'
            }
          }
        },
        {
          additionalProperties: false,
          title: 'Version',
          properties: {
            Version: {
              description: 'The version of the collection',
              type: 'string'
            }
          }
        }
      ]
    }
  }
}

export default collectionAssociation
