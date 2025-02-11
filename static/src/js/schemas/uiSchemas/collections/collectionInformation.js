import CustomSelectWidget from '../../../components/CustomSelectWidget/CustomSelectWidget'
import LanguageArray from '../../../constants/languageArray'

const collectionInformationUiSchema = {
  'ui:submitButtonOptions': {
    norender: true
  },
  'ui:field': 'layout',
  'ui:heading-level': 'h4',
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
                    children: ['TemplateName']
                  }
                }
              ]
            },
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
                    className: 'grid-layout__field-left-border',
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
    'ui:title': 'DOI',
    'ui:heading-level': 'h5',
    'ui:field': 'layout',
    'ui:layout_grid': {
      'ui:row': [
        {
          'ui:group': 'DOI',
          'ui:group-description': true,
          'ui:col': {
            style: {
              padding: '1.25rem 1.5rem',
              borderInlineStart: '4px solid #cad4d8'
            },
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
                      children: ['Authority']
                    }
                  }
                ]
              },
              {
                'ui:row': [
                  {
                    'ui:col': {
                      md: 12,
                      children: ['PreviousVersion']
                    }
                  }
                ]
              },
              {
                'ui:row': [
                  {
                    'ui:col': {
                      md: 12,
                      children: ['MissingReason']
                    }
                  }
                ]
              },
              {
                'ui:row': [
                  {
                    'ui:col': {
                      md: 12,
                      children: ['Explanation']
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    DOI: {
      'ui:widget': 'textarea'
    },
    Authority: {},
    PreviousVersion: {
      'ui:heading-level': 'h5',
      'ui:field': 'layout',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:group': 'Previous Version',
            'ui:group-description': true,
            'ui:col': {
              md: 12,
              children: [
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
                        children: ['Published']
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
      },
      DOI: {
        'ui:widget': 'textarea'
      }
    },
    MissingReason: {},
    Explanation: {
      'ui:widget': 'textarea'
    }
  },
  AssociatedDOIs: {
    'ui:title': 'Associated DOIs',
    'ui:heading-level': 'h4',
    'ui:hide-header': true,
    items: {
      'ui:hide-header': true,
      'ui:title': 'Associated DOIs',
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
                        children: ['DescriptionOfOtherType']
                      }
                    }
                  ]
                }
              ]
            }
          }
        ]
      },
      DOI: {
        'ui:widget': 'textarea'
      },
      Title: {
        'ui:widget': 'textarea'
      },
      DescriptionOfOtherType: {
        'ui:widget': 'textarea'
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
    'ui:widget': CustomSelectWidget,
    'ui:options': {
      enumOptions: LanguageArray
    }
  }
}

export default collectionInformationUiSchema
