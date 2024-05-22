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
    accessConstraintFilter: {
      $ref: '#/definitions/accessConstraintFilterType'
    },
    accessPermission: {
      $ref: '#/definitions/accessPermissionType'
    }
  },
  required: ['name'],

  definitions: {
    accessConstraintFilterType: {
      type: 'object',
      additionalProperties: false,
      description: 'This object describes a store for a variable instance. A variable instance is when the variable is extracted from the original data files and stored somewhere.',
      properties: {
        collectionAssessConstraint: {
          description: 'This element allows end users to get direct access to data products that are stored in the Amazon Web Service (AWS) S3 buckets. The sub elements include S3 credentials end point and a documentation URL as well as bucket prefix names and an AWS region.',
          $ref: '#/definitions/collectionAssessConstraintType'
        }
      }
    },
    collectionAssessConstraintType: {
      type: 'object',
      additionalProperties: false,
      description: 'This element allows end users to get direct access to data products that are stored in the Amazon Web Service (AWS) S3 buckets. The sub elements include S3 credentials end point and a documentation URL as well as bucket prefix names and an AWS region.',
      properties: {
        minValue: {
          description: 'Defines the URL where the credentials are stored.',
          type: 'number',
          minLength: 1,
          maxLength: 10
        },
        maxValue: {
          description: 'Defines the URL where the credential documentation are stored.',
          type: 'number',
          minLength: 1,
          maxLength: 10
        }
      }
    },
    accessPermissionType: {
      type: 'object',
      additionalProperties: false,
      description: 'Type of permission to apply to',
      properties: {
        permission: {
          $ref: '#/definitions/permissionType'
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
