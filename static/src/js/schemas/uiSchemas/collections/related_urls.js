import CustomSelectWidget from '../../../../components/widgets/CustomSelectWidget'

const { shouldHideGetData, shouldHideGetService } = require('../../../../utils/collections_utils')

const relatedUrlsUiSchema = {
  RelatedUrls: {
    'ui:title': 'Related URLs',
    'ui:header-classname': 'h1-title',
    'ui:header-box-classname': 'h1-box',
    items: {
      'ui:field': 'layout',
      'ui:controlled': {
        name: 'related-urls',
        map: {
          URLContentType: 'url_content_type',
          Type: 'type',
          Subtype: 'subtype'
        }
      },
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
                        children: ['Description']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        controlName: 'url_content_type',
                        md: 12,
                        children: ['URLContentType']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        controlName: 'type',
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
                        controlName: 'subtype',
                        md: 12,
                        children: ['Subtype']
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
                },
                {
                  'ui:hide': (formData) => shouldHideGetData(formData),
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['GetData']
                      }
                    }
                  ]
                },
                {
                  'ui:hide': (formData) => shouldHideGetService(formData),
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['GetService']
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
      GetData: {
        'ui:field': 'layout',
        'ui:layout_grid': {
          'ui:row': [
            {
              'ui:group': 'Get Data',
              'ui:group-description': true,
              'ui:group-classname': 'h3-title',
              'ui:group-box-classname': 'h2-box',
              'ui:col': {
                md: 12,
                children: [
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 12,
                          children: ['Format']
                        }
                      }
                    ]
                  },
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 12,
                          children: ['MimeType']
                        }
                      }
                    ]
                  },
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 12,
                          children: ['Size']
                        }
                      }
                    ]
                  },
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 12,
                          children: ['Unit']
                        }
                      }
                    ]
                  },
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 12,
                          children: ['Fees']
                        }
                      }
                    ]
                  },
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 12,
                          children: ['Checksum']
                        }
                      }
                    ]
                  }
                ]
              }
            }
          ]
        },
        Format: {
          'ui:widget': CustomSelectWidget,
          'ui:controlled': {
            name: 'granule-data-format',
            controlName: 'short_name'
          }
        },
        MimeType: {
          'ui:widget': CustomSelectWidget,
          'ui:controlled': {
            name: 'mime-type',
            controlName: 'mime_type'
          }
        }
      },
      GetService: {
        'ui:field': 'layout',
        'ui:layout_grid': {
          'ui:row': [
            {
              'ui:group': 'Get Service',
              'ui:group-description': true,
              'ui:group-classname': 'h3-title',
              'ui:group-box-classname': 'h2-box',
              'ui:col': {
                md: 12,
                children: [
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 12,
                          children: ['Format']
                        }
                      }
                    ]
                  },
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 12,
                          children: ['MimeType']
                        }
                      }
                    ]
                  },
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 12,
                          children: ['Protocol']
                        }
                      }
                    ]
                  },
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 12,
                          children: ['FullName']
                        }
                      }
                    ]
                  },
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 12,
                          children: ['DataID']
                        }
                      }
                    ]
                  },
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 12,
                          children: ['DataType']
                        }
                      }
                    ]
                  },
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 12,
                          children: ['URI']
                        }
                      }

                    ]
                  }
                ]
              }
            }
          ]
        },
        Format: {
          'ui:widget': CustomSelectWidget,
          'ui:controlled': {
            name: 'granule-data-format',
            controlName: 'short_name'
          }
        },
        MimeType: {
          'ui:widget': CustomSelectWidget,
          'ui:controlled': {
            name: 'mime-type',
            controlName: 'mime_type'
          }
        },
        URI: {
          'ui:header-classname': 'h3-title'
        }
      }
    }
  }
}
export default relatedUrlsUiSchema
