const serviceInformationUiSchema = {
  'ui:submitButtonOptions': {
    norender: true
  },
  'ui:field': 'layout',
  'ui:heading-level': 'h3',
  'ui:layout_grid': {
    'ui:row': [
      {
        'ui:group': 'Service Information',
        'ui:required': true,
        'ui:col': {
          md: 12,
          children: [
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['Name']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['LongName']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['Version']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['VersionDescription']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['Type']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['LastUpdatedDate']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['Description']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['URL']
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  },
  VersionDescription: {
    'ui:widget': 'textarea'
  },
  Description: {
    'ui:widget': 'textarea'
  },
  URL: {
    'ui:heading-level': 'h4',
    'ui:root': 'URL',
    'ui:field': 'layout',
    'ui:layout_grid': {
      'ui:row': [
        {
          'ui:group': 'URL',
          'ui:group-description': true,
          'ui:col': {
            md: 12,
            children: [
              {
                'ui:row': [
                  {
                    'ui:col': {
                      md: 12,
                      children: ['Description']
                    }
                  },
                  {
                    'ui:col': {
                      md: 12,
                      children: ['URLValue']
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    Description: {
      'ui:widget': 'textarea'
    }
  }
}

export default serviceInformationUiSchema
