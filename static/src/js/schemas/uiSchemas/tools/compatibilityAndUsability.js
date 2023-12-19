import CustomMultiSelectWidget from '../../../components/CustomMultiSelectWidget/CustomMultiSelectWidget'
import CustomSelectWidget from '../../../components/CustomSelectWidget/CustomSelectWidget'

const compatibilityAndUsabilityUiSchema = {
  'ui:submitButtonOptions': {
    norender: true
  },
  'ui:field': 'layout',
  'ui:heading-level': 'h3',
  'ui:layout_grid': {
    'ui:row': [
      {
        'ui:group': 'Compatibility and Usability',
        'ui:col': {
          md: 12,
          children: [
            {
              'ui:group': 'Supported Formats',
              'ui:group-classname': 'h2-title',
              'ui:group-box-classname': 'h2-box',
              'ui:heading-level': 'h4',
              'ui:row': [
                {
                  'ui:col': {
                    md: 10,
                    children: ['SupportedInputFormats']
                  }
                },
                {
                  'ui:col': {
                    md: 10,
                    children: ['SupportedOutputFormats']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['SupportedOperatingSystems']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['SupportedBrowsers']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['SupportedSoftwareLanguages']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['Quality']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: [
                      {
                        'ui:group': 'Constraints',
                        'ui:group-classname': 'h2-title',
                        'ui:group-box-classname': 'h2-box',
                        'ui:group-description': false,
                        'ui:row': [
                          {
                            'ui:col': {
                              md: 12,
                              children: ['AccessConstraints']
                            }
                          },
                          {
                            'ui:col': {
                              md: 12,
                              children: ['UseConstraints']
                            }
                          }
                        ]
                      }
                    ]
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  },
  SupportedInputFormats: {
    'ui:widget': CustomMultiSelectWidget
  },
  SupportedOutputFormats: {
    'ui:widget': CustomMultiSelectWidget
  },
  SupportedOperatingSystems: {
    'ui:heading-level': 'h4',
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
                        children: ['OperatingSystemName']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['OperatingSystemVersion']
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
  SupportedBrowsers: {
    'ui:heading-level': 'h4',
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
                        children: ['BrowserName']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['BrowserVersion']
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
  SupportedSoftwareLanguages: {
    'ui:heading-level': 'h4',
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
                        children: ['SoftwareLanguageName']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['SoftwareLanguageVersion']
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
  Quality: {
    'ui:field': 'layout',
    'ui:layout_grid': {
      'ui:row': [
        {
          'ui:group': 'Quality',
          'ui:group-classname': 'h2-title',
          'ui:group-box-classname': 'h2-box',
          'ui:col': {
            children: [
              {
                'ui:row': [
                  {
                    'ui:col': {
                      md: 12,
                      children: ['QualityFlag']
                    }
                  }
                ]
              },
              {
                'ui:row': [
                  {
                    'ui:col': {
                      md: 12,
                      children: ['Traceability']
                    }
                  }
                ]
              },
              {
                'ui:row': [
                  {
                    'ui:col': {
                      md: 12,
                      children: ['Lineage']
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    QualityFlag: {
      'ui:widget': CustomSelectWidget
    },
    Lineage: {
      'ui:widget': 'textarea'
    }
  },
  UseConstraints: {
    'ui:header-classname': 'h3-title',
    LicenseText: {
      'ui:widget': 'textarea'
    }
  },
  AccessConstraints: {
    'ui:widget': 'textarea',
    'ui:header-classname': 'h3-title'
  }
}

export default compatibilityAndUsabilityUiSchema
