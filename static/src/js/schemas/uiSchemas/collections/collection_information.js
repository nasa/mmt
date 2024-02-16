import CustomSelectWidget from '../../../../components/widgets/CustomSelectWidget'

const collectionInformationUiSchema = {
  'ui:field': 'layout',
  'ui:layout_grid': {
    'ui:row': [
      {
        'ui:group': 'Collection Information',
        'ui:required': true,
        'ui:col': {
          md: 12,
          children: [
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['ShortName']
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
                    children: ['EntryTitle']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    className: 'field-left-border',
                    md: 12,
                    children: ['DOI']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['AssociatedDOIs']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['Abstract']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['Purpose']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['DataLanguage']
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
  DOI: {
    'ui:required': true,
    'ui:hide-header': true
  },
  AssociatedDOIs: {
    'ui:title': 'Associated DOIs',
    'ui:header-classname': 'h2-title',
    items: {
      'ui:field': 'layout',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:col': {
              md: 12,
              children: [
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['DOI']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['Title']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['Authority']
                      }
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    }
  },
  Abstract: {
    'ui:widget': 'textarea'
  },
  Purpose: {
    'ui:widget': 'textarea'
  },
  DataLanguage: {
    'ui:widget': CustomSelectWidget
  }
}

export default collectionInformationUiSchema
