import CustomMultiSelectWidget from '../../../../components/widgets/CustomMultiSelectWidget'
import CustomSelectWidget from '../../../../components/widgets/CustomSelectWidget'

const compatibilityAndUsabilityUiSchema = {
  'ui:field': 'layout',
  'ui:layout_grid': {
    'ui:row': [
      {
        'ui:group': 'Compatability and Usability',
        'ui:col': {
          md: 12,
          children: [
            {
              'ui:group': 'Supported Formats',
              'ui:group-classname': 'h2-title',
              'ui:group-box-classname': 'h2-box',
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
