import CustomSelectWidget from '../../../components/CustomSelectWidget/CustomSelectWidget'
import CustomTextareaWidget from '../../../components/CustomTextareaWidget/CustomTextareaWidget'
import processingLevel from '../../../constants/processingLevel'

const dataIdentificationUiSchema = {
  'ui:submitButtonOptions': {
    norender: true
  },
  'ui:heading-level': 'h3',
  'ui:field': 'layout',
  'ui:layout_grid': {
    'ui:row': [
      {
        'ui:group': 'Data Identification',
        'ui:col': {
          md: 12,
          children: [
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['DataDates']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['CollectionDataType']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['StandardProduct']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['ProcessingLevel']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['CollectionProgress']
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
                    children: ['UseConstraints']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['AccessConstraints']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['MetadataAssociations']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['PublicationReferences']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['DataMaturity']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['OtherIdentifiers']
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  },
  OtherIdentifiers: {
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
                        children: ['Identifier']
                      }
                    },
                    {
                      'ui:col': {
                        md: 12,
                        children: ['Type']
                      }
                    },
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
      Identifier: {
        'ui:widget': 'textarea'
      },
      DescriptionOfOtherType: {
        'ui:widget': 'textarea'
      }
    }
  },
  DataDates: {
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
                        md: 6,
                        children: ['Type']
                      }
                    },
                    {
                      'ui:col': {
                        md: 6,
                        children: ['Date']
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
  ProcessingLevel: {
    'ui:heading-level': 'h4',
    'ui:field': 'layout',
    'ui:layout_grid': {
      'ui:row': [
        {
          'ui:group': 'Processing Level',
          'ui:group-classname': 'h2-title',
          'ui:group-description': true,
          'ui:col': {
            md: 12,
            children: [
              {
                'ui:row': [
                  {
                    'ui:col': {
                      md: 12,
                      children: ['Id']
                    }
                  },
                  {
                    'ui:col': {
                      md: 12,
                      children: ['ProcessingLevelDescription']
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    Id: {
      'ui:title': 'ID',
      'ui:widget': CustomSelectWidget,
      'ui:options': {
        enumOptions: processingLevel
      }
    },
    ProcessingLevelDescription: {
      'ui:widget': CustomTextareaWidget
    }
  },
  Quality: {
    'ui:widget': CustomTextareaWidget
  },
  UseConstraints: {
    'ui:widget': CustomSelectWidget,
    'ui:heading-level': 'h4',
    'ui:field': 'layout',
    'ui:layout_grid': {
      'ui:row': [
        {
          'ui:col': {
            children: [
              {
                'ui:row': [
                  {
                    'ui:col': {
                      md: 12,
                      children: ['LicenseURL']
                    }
                  }
                ]
              },
              {
                'ui:row': [
                  {
                    'ui:col': {
                      md: 12,
                      children: ['LicenseText']
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
                      children: ['FreeAndOpenData']
                    }
                  }
                ]
              },
              {
                'ui:row': [
                  {
                    'ui:col': {
                      md: 12,
                      children: ['EULAIdentifiers']
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
    LicenseURL: {
      'ui:heading-level': 'h4',
      'ui:field': 'layout',
      'ui:layout_grid': {
        'ui:group': 'License URL',
        'ui:required': false,
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
    },
    LicenseText: {
      'ui:widget': CustomTextareaWidget
    }
  },
  AccessConstraints: {
    'ui:heading-level': 'h4',
    'ui:field': 'layout',
    'ui:layout_grid': {
      'ui:row': [
        {
          'ui:group': 'Access Constraints',
          'ui:group-description': true,
          'ui:col': {
            md: 12,
            children: [
              {
                'ui:row': [
                  {
                    'ui:col': {
                      md: 12,
                      children: ['Value']
                    }
                  },
                  {
                    'ui:col': {
                      md: 12,
                      children: ['Description']
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
    }
  },
  MetadataAssociations: {
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
                        md: 6,
                        children: ['Type']
                      }
                    },
                    {
                      'ui:col': {
                        md: 6,
                        children: ['EntryId']
                      }
                    },
                    {
                      'ui:col': {
                        md: 12,
                        children: ['Description']
                      }
                    },
                    {
                      'ui:col': {
                        md: 12,
                        children: ['Version']
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
      }
    }
  },
  PublicationReferences: {
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
                        children: ['Title']
                      }
                    },
                    {
                      'ui:col': {
                        md: 12,
                        children: ['Publisher']
                      }
                    },
                    {
                      'ui:col': {
                        md: 12,
                        children: ['DOI']
                      }
                    },
                    {
                      'ui:col': {
                        md: 12,
                        children: ['Author']
                      }
                    },
                    {
                      'ui:col': {
                        md: 12,
                        children: ['PublicationDate']
                      }
                    },
                    {
                      'ui:col': {
                        md: 12,
                        children: ['Series']
                      }
                    },
                    {
                      'ui:col': {
                        md: 12,
                        children: ['Edition']
                      }
                    },
                    {
                      'ui:col': {
                        md: 4,
                        children: ['Volume']
                      }
                    },
                    {
                      'ui:col': {
                        md: 4,
                        children: ['Issue']
                      }
                    },
                    {
                      'ui:col': {
                        md: 4,
                        children: ['ReportNumber']
                      }
                    },
                    {
                      'ui:col': {
                        md: 12,
                        children: ['PublicationPlace']
                      }
                    },
                    {
                      'ui:col': {
                        md: 6,
                        children: ['Pages']
                      }
                    },
                    {
                      'ui:col': {
                        md: 6,
                        children: ['ISBN']
                      }
                    },
                    {
                      'ui:col': {
                        md: 12,
                        children: ['OtherReferenceDetails']
                      }
                    },
                    {
                      'ui:col': {
                        md: 12,
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
      Publisher: {
        'ui:widget': CustomTextareaWidget
      },
      DOI: {
        'ui:heading-level': 'h5',
        'ui:field': 'layout',
        'ui:layout_grid': {
          'ui:row': [
            {
              'ui:group': 'DOI',
              'ui:group-classname': 'h2-title',
              'ui:group-description': true,
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
                      },
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
        },
        DOI: {
          'ui:widget': CustomTextareaWidget
        }
      },
      Author: {
        'ui:widget': CustomTextareaWidget
      },
      Series: {
        'ui:widget': CustomTextareaWidget
      },
      Edition: {
        'ui:widget': CustomTextareaWidget
      },
      PublicationPlace: {
        'ui:widget': CustomTextareaWidget
      },
      OtherReferenceDetails: {
        'ui:widget': CustomTextareaWidget
      },
      OnlineResource: {
        'ui:heading-level': 'h5',
        'ui:field': 'layout',
        'ui:layout_grid': {
          'ui:group': 'Online Resource',
          'ui:group-description': true,
          'ui:required': false,
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

export default dataIdentificationUiSchema
