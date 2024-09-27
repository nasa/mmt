const collectionPermission = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Collection Permission',
  type: 'object',
  additionalProperties: false,
  properties: {
    name: {
      description: 'The name of the collection permission.',
      type: 'string',
      minLength: 1,
      maxLength: 85
    },
    providerId: {
      description: 'The provider id of the collection permission.',
      type: 'string'
    },
    accessPermission: {
      $ref: '#/definitions/accessPermissionType'
    },
    collectionSelection: {
      $ref: '#/definitions/collectionSelectionType'
    },
    accessConstraintFilter: {
      $ref: '#/definitions/accessConstraintFilterType'
    },
    temporalConstraintFilter: {
      $ref: '#/definitions/temporalConstraintFilterType'
    },
    groupPermissions: {
      type: 'object'
    }
  },
  required: ['name', 'providerId', 'collectionSelection', 'accessPermission', 'groupPermissions'],

  definitions: {
    collectionSelectionType: {
      oneOf: [
        {
          title: 'All Collections',
          properties: {
            allCollection: {
              title: 'All Collections',
              type: 'string',
              default: true
            }
          }
        },
        {
          title: 'Selected Collection',
          properties: {
            selectedCollections: {
              description: 'Entry Title of the collection'
            }
          }
        }
      ]
    },
    accessConstraintFilterType: {
      type: 'object',
      additionalProperties: false,
      description: 'This object describes the access constraint on a collection or granules for this permission.',
      properties: {
        collectionAccessConstraint: {
          $ref: '#/definitions/collectionAccessConstraintType'
        },
        granuleAccessConstraint: {
          $ref: '#/definitions/granuleAccessConstraintType'
        }
      }
    },
    temporalConstraintFilterType: {
      type: 'object',
      additionalProperties: false,
      description: 'This object describes the temporal constraint on a collection or granules for this permission.',
      properties: {
        collectionTemporalConstraint: {
          $ref: '#/definitions/collectionTemporalConstraintType'
        },
        granuleTemporalConstraint: {
          $ref: '#/definitions/granuleTemporalConstraintType'
        }
      }
    },
    collectionAccessConstraintType: {
      type: 'object',
      additionalProperties: false,
      properties: {
        minimumValue: {
          description: 'Minimum value for the collection access control .',
          type: 'number',
          minLength: 1,
          maxLength: 10
        },
        maximumValue: {
          description: 'Maximum value for the collection access control.',
          type: 'number',
          minLength: 1,
          maxLength: 10
        },
        includeUndefined: {
          type: 'boolean',
          title: 'Include Undefined'
        }
      },
      required: ['minimumValue', 'maximumValue']

    },
    granuleAccessConstraintType: {
      type: 'object',
      additionalProperties: false,
      properties: {
        minimumValue: {
          description: 'Minimum value for the granule access control.',
          type: 'number'
        },
        maximumValue: {
          description: 'Maximum value for the granule access control.',
          type: 'number'
        },
        includeUndefined: {
          type: 'boolean',
          title: 'Include Undefined'
        }
      },
      required: ['minimumValue', 'maximumValue']
    },
    collectionTemporalConstraintType: {
      type: 'object',
      additionalProperties: false,
      properties: {
        startDate: {
          description: 'Start date of the temporal collection constraint.',
          type: 'string',
          format: 'date-time'
        },
        stopDate: {
          description: 'Maximum value for the collection collection control.',
          type: 'string',
          format: 'date-time'
        },
        mask: {
          enum: ['intersect', 'contains', 'disjoint']
        }
      },
      required: ['startDate', 'stopDate']

    },
    granuleTemporalConstraintType: {
      type: 'object',
      additionalProperties: false,
      properties: {
        startDate: {
          description: 'Start date of the temporal granule constraint.',
          type: 'string',
          format: 'date-time'
        },
        stopDate: {
          description: 'Stop date of the temporal granule constraint.',
          type: 'string',
          format: 'date-time'
        },
        mask: {
          enum: ['intersect', 'contains', 'disjoint']
        }
      },
      required: ['startDate', 'stopDate']
    },
    accessPermissionType: {
      type: 'object',
      description: 'Type of permission to apply to',
      properties: {
        collection: {
          type: 'boolean',
          title: 'Collections',
          description: 'Apply collection permissions'
        },
        granule: {
          type: 'boolean',
          title: 'Granules',
          description: 'Apply granule permission'
        }
      }

    },
    permissionType: {
      properties: {
        collection: {
          type: 'boolean',
          title: 'Collections',
          description: 'Apply collection permissions'
        },
        granule: {
          type: 'boolean',
          title: 'Granules',
          description: 'Apply granule permission'
        }
      }
    }
  }
}

export default collectionPermission
