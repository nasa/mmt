const keywordSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: false,
  properties: {
    KeywordUUID: {
      type: 'string',
      format: 'uuid'
    },
    BroaderKeywords: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          BroaderUUID: {
            type: 'string'
          }
        }
      }
    },
    NarrowerKeywords: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          NarrowerUUID: {
            type: 'string'
          }
        }
      }
    },
    PreferredLabel: {
      type: 'string',
      minLength: 1,
      maxLength: 80
    },
    AlternateLabels: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          LabelName: {
            type: 'string',
            maxLength: 80
          },
          LabelType: {
            $ref: '#/definitions/LabelTypeEnum'
          }
        },
        required: ['LabelName', 'LabelType']
      }
    },
    Definition: {
      type: 'string',
      minLength: 0,
      maxLength: 4000
    },
    DefinitionReference: {
      type: 'string',
      minLength: 0,
      maxLength: 2000
    },
    Resources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          ResourceType: {
            $ref: '#/definitions/ResourceTypeEnum'
          },
          ResourceUri: {
            type: 'string',
            minLength: 1,
            maxLength: 1024
          }
        },
        required: ['ResourceType', 'ResourceUri']
      }
    },
    RelatedKeywords: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          UUID: {
            type: 'string',
            format: 'uuid'
          },
          RelationshipType: {
            $ref: '#/definitions/RelationshipTypeEnum'
          }
        },
        required: ['UUID', 'RelationshipType']
      }
    },
    ChangeLogs: {
      type: 'string'
    }
  },
  required: ['KeywordUUID', 'PreferredLabel'],
  definitions: {
    LabelTypeEnum: {
      type: 'string',
      enum: ['primary', 'alternate', 'abbreviation', 'outdated']
    },
    RelationshipTypeEnum: {
      type: 'string',
      enum: ['Has Instrument', 'On Platform', 'Has Sensor', 'Related']
    },
    ResourceTypeEnum: {
      type: 'string',
      enum: ['provider', 'image']
    }
  }
}

export default keywordSchema
