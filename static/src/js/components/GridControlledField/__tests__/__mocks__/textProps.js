import CustomTextWidget from '../../../CustomTextWidget/CustomTextWidget'

export const textProps = {
  controlName: 'long_name',
  formData: {},
  idSchema: {
    $id: 'root_Organizations_0',
    Roles: {
      $id: 'root_Organizations_0_Roles'
    },
    ShortName: {
      $id: '_Organizations_0_ShortName'
    },
    LongName: {
      $id: '_Organizations_0_LongName'
    },
    URLValue: {
      $id: 'root_Organizations_0_URLValue'
    }
  },
  mapping: {
    name: 'providers',
    map: {
      ShortName: 'short_name',
      LongName: 'long_name',
      URLValue: 'url'
    }
  },
  name: 'LongName',
  onChange: jest.fn(),
  onSelectValue: null,
  registry: {
    formContext: {
      focusField: '',
      setFocusField: jest.fn()
    },
    schemaUtils: {
      retrieveSchema: jest.fn().mockReturnValue({
        type: 'object',
        additionalProperties: false,
        description: 'The organization or institution responsible for developing, archiving, and/or hosting the web user interface or downloadable tool.',
        properties: {
          Roles: {
            description: 'This is the roles of the organization.',
            type: 'array',
            items: {
              description: 'Defines the possible values of a service provider role.',
              type: 'string',
              enum: [
                'SERVICE PROVIDER',
                'DEVELOPER',
                'PUBLISHER',
                'AUTHOR',
                'ORIGINATOR'
              ]
            },
            minItems: 1
          },
          ShortName: {
            description: 'This is the short name of the organization.',
            type: 'string',
            minLength: 1,
            maxLength: 85,
            pattern: "[\\w\\-&'()\\[\\]/.\"#$%\\^@!*+=,][\\w\\-&'()\\[\\]/.\"#$%\\^@!*+=, ]{1,84}",
            enum: [
              'ESA/ED',
              'UCAR/NCAR/EOL/CEOPDM',
              'DOI/USGS/CMG/WHSC',
              'OR-STATE/EOARC',
              'AARHUS-HYDRO'
            ]
          },
          LongName: {
            description: 'This is the long name of the organization.',
            type: 'string',
            minLength: 1,
            maxLength: 1024
          },
          URLValue: {
            description: 'The URL of the organization.',
            type: 'string',
            minLength: 1,
            maxLength: 1024
          }
        },
        required: [
          'Roles',
          'ShortName'
        ]
      })
    }
  },
  schema: {
    type: 'object',
    additionalProperties: false,
    description: 'The organization or institution responsible for developing, archiving, and/or hosting the web user interface or downloadable tool.',
    properties: {
      Roles: {
        description: 'This is the roles of the organization.',
        type: 'array',
        items: {
          description: 'Defines the possible values of a service provider role.',
          type: 'string',
          enum: [
            'SERVICE PROVIDER',
            'DEVELOPER',
            'PUBLISHER',
            'AUTHOR',
            'ORIGINATOR'
          ]
        },
        minItems: 1
      },
      ShortName: {
        description: 'This is the short name of the organization.',
        type: 'string',
        minLength: 1,
        maxLength: 85,
        pattern: "[\\w\\-&'()\\[\\]/.\"#$%\\^@!*+=,][\\w\\-&'()\\[\\]/.\"#$%\\^@!*+=, ]{1,84}",
        enum: [
          'ESA/ED',
          'UCAR/NCAR/EOL/CEOPDM',
          'DOI/USGS/CMG/WHSC',
          'OR-STATE/EOARC',
          'AARHUS-HYDRO'
        ]
      },
      LongName: {
        description: 'This is the long name of the organization.',
        type: 'string',
        minLength: 1,
        maxLength: 1024
      },
      URLValue: {
        description: 'The URL of the organization.',
        type: 'string',
        minLength: 1,
        maxLength: 1024
      }
    },
    required: [
      'Roles',
      'ShortName'
    ]
  },
  uiSchema: {
    'ui:widget': CustomTextWidget
  }
}
