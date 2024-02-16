import CustomSelectWidget from '../../../../components/widgets/CustomSelectWidget'
import CustomTextareaWidget from '../../../../components/widgets/CustomTextareaWidget'

const collectionCitationUiSchema = {
  CollectionCitations: {
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
                        children: ['Creator']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['Editor']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['SeriesName']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['ReleaseDate']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['ReleasePlace']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['Publisher']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 6,
                        children: ['IssueIdentification']
                      }
                    },
                    {
                      'ui:col': {
                        md: 6,
                        children: ['DataPresentationForm']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['OtherCitationDetails']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        className: 'field-left-border',
                        children: ['OnlineResource']
                      }
                    }
                  ]
                }
              ]
            }
          }
        ]
      },
      Title: {
        'ui:widget': CustomTextareaWidget
      },
      Creator: {
        'ui:widget': CustomTextareaWidget
      },
      Editor: {
        'ui:widget': CustomTextareaWidget
      },
      SeriesName: {
        'ui:widget': CustomTextareaWidget
      },
      ReleasePlace: {
        'ui:widget': CustomTextareaWidget
      },
      Publisher: {
        'ui:widget': CustomTextareaWidget
      },
      OtherCitationDetails: {
        'ui:widget': CustomTextareaWidget
      },
      OnlineResource: {
        'ui:field': 'layout',
        'ui:layout_grid': {
          'ui:group': 'Online Resource',
          'ui:group-description': true,
          'ui:group-classname': 'h2-title',
          'ui:required': 'false',
          'ui:row': [
            {
              'ui:col': {
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
                          children: ['Linkage']
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
                          children: ['ApplicationProfile']
                        }
                      }
                    ]
                  },
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 12,
                          children: ['Function']
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
                  }
                ]
              }
            }
          ]
        },
        Description: {
          'ui:widget': CustomTextareaWidget
        },
        MimeType: {
          'ui:widget': CustomSelectWidget,
          'ui:controlled': {
            name: 'mime-type',
            controlName: 'mime_type'
          }
        }
      }
    }
  }
}

export default collectionCitationUiSchema
