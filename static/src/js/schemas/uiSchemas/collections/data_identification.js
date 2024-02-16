import CustomSelectWidget from '../../../../components/widgets/CustomSelectWidget'
import CustomTextareaWidget from '../../../../components/widgets/CustomTextareaWidget'

const dataIdentificationUiSchema = {
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
            }
          ]
        }
      }
    ]
  },
  DataDates: {
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
  CollectionDataType: {
    'ui:header-classname': 'h3-title'
  },
  StandardProduct: {
    'ui:header-classname': 'h3-title'
  },
  ProcessingLevel: {
    'ui:field': 'layout',
    'ui:layout_grid': {
      'ui:row': [
        {
          'ui:group': 'Processing Level',
          'ui:group-classname': 'h2-title',
          'ui:group-description': true,
          'ui:group-box-classname': 'h2-box',
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
      'ui:widget': CustomSelectWidget
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
                      style: {
                        marginLeft: '10px',
                        marginBottom: '5px',
                        borderLeft: 'solid 5px rgb(240,240,240)'
                      },
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
                      style: {
                        marginLeft: '10px',
                        marginBottom: '5px',
                        borderLeft: 'solid 5px rgb(240,240,240)'
                      },
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
                      style: {
                        marginLeft: '10px',
                        marginBottom: '5px',
                        borderLeft: 'solid 5px rgb(240,240,240)'
                      },
                      md: 12,
                      children: ['EULAIdentifiers']
                    }
                  }
                ]
              },
              {
                'ui:row': [
                  {
                    'ui:col': {
                      style: {
                        marginLeft: '10px',
                        marginBottom: '5px',
                        borderLeft: 'solid 5px rgb(240,240,240)'
                      },
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
                      style: {
                        marginLeft: '10px',
                        marginBottom: '5px',
                        borderLeft: 'solid 5px rgb(240,240,240)'
                      },
                      md: 12,
                      children: ['LicenseText']
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
      'ui:field': 'layout',
      'ui:layout_grid': {
        'ui:group': 'License URL',
        'ui:group-classname': 'h3-title',
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
    },
    LicenseText: {
      'ui:widget': CustomTextareaWidget
    }
  },
  AccessConstraints: {
    'ui:field': 'layout',
    'ui:layout_grid': {
      'ui:row': [
        {
          'ui:group': 'Access Constraints',
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
                        style: {
                          marginLeft: '10px',
                          marginBottom: '10px',
                          borderLeft: 'solid 5px rgb(240,240,240)'
                        },
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
                        style: {
                          marginLeft: '10px',
                          marginBottom: '10px',
                          borderLeft: 'solid 5px rgb(240,240,240)'
                        },
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
        'ui:field': 'layout',
        'ui:layout_grid': {
          'ui:group': 'Online Resource',
          'ui:group-description': true,
          'ui:group-classname': 'h3-title',
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

export default dataIdentificationUiSchema
