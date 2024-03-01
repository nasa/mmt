import CustomTextWidget from '../../../components/CustomTextWidget/CustomTextWidget'
import CustomTextareaWidget from '../../../components/CustomTextareaWidget/CustomTextareaWidget'

const archiveDistributionInformationUiSchema = {
  'ui:submitButtonOptions': {
    norender: true
  },
  'ui:field': 'layout',
  'ui:heading-level': 'h3',
  'ui:layout_grid': {
    'ui:row': [
      {
        'ui:group': 'Archive and Distribution Information',
        'ui:group-description': true,
        'ui:col': {
          md: 12,
          children: [
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['ArchiveAndDistributionInformation']
                  }
                },
                {
                  'ui:col': {
                    md: 12,
                    children: ['DirectDistributionInformation']
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  },
  ArchiveAndDistributionInformation: {
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
                      children: ['FileArchiveInformation']
                    }
                  },
                  {
                    'ui:col': {
                      md: 12,
                      children: ['FileDistributionInformation']
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    FileArchiveInformation: {
      'ui:required': 'true',
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
                          children: ['TotalCollectionFileSize']
                        }
                      },
                      {
                        'ui:col': {
                          md: 12,
                          children: ['TotalCollectionFileSizeUnit']
                        }
                      },
                      {
                        'ui:col': {
                          md: 12,
                          children: ['TotalCollectionFileSizeBeginDate']
                        }
                      },
                      {
                        'ui:col': {
                          md: 6,
                          children: ['Format']
                        }
                      },
                      {
                        'ui:col': {
                          md: 6,
                          children: ['FormatType']
                        }
                      },
                      {
                        'ui:col': {
                          md: 12,
                          children: ['FormatDescription']
                        }
                      },
                      {
                        'ui:col': {
                          md: 6,
                          children: ['AverageFileSize']
                        }
                      },
                      {
                        'ui:col': {
                          md: 6,
                          children: ['AverageFileSizeUnit']
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
        FormatDescription: {
          'ui:widget': CustomTextareaWidget
        },
        Description: {
          'ui:widget': CustomTextareaWidget
        }
      }
    },
    FileDistributionInformation: {
      'ui:required': 'true',
      items: {
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
                          children: ['TotalCollectionFileSize']
                        }
                      },
                      {
                        'ui:col': {
                          md: 12,
                          children: ['TotalCollectionFileSizeUnit']
                        }
                      },
                      {
                        'ui:col': {
                          md: 12,
                          children: ['TotalCollectionFileSizeBeginDate']
                        }
                      },
                      {
                        'ui:col': {
                          md: 6,
                          children: ['Format']
                        }
                      },
                      {
                        'ui:col': {
                          md: 6,
                          children: ['FormatType']
                        }
                      },
                      {
                        'ui:col': {
                          md: 12,
                          children: ['FormatDescription']
                        }
                      },
                      {
                        'ui:col': {
                          md: 12,
                          children: ['Media']
                        }
                      },
                      {
                        'ui:col': {
                          md: 12,
                          children: ['AverageFileSize']
                        }
                      },
                      {
                        'ui:col': {
                          md: 12,
                          children: ['AverageFileSizeUnit']
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
                          children: ['Fees']
                        }
                      }
                    ]
                  }
                ]
              }
            }
          ]
        },
        FormatDescription: {
          'ui:widget': CustomTextareaWidget
        },
        Description: {
          'ui:widget': CustomTextareaWidget
        }
      }
    }
  },
  DirectDistributionInformation: {
    'ui:field': 'layout',
    'ui:layout_grid': {
      'ui:row': [
        {
          'ui:group': 'Direct Distribution Information',
          'ui:group-description': true,
          'ui:group-classname': 'h2-title',
          'ui:group-box-classname': 'h2-box',
          'ui:col': {
            children: [
              {
                'ui:row': [
                  {
                    'ui:col': {
                      md: 12,
                      children: ['Region']
                    }
                  },
                  {
                    'ui:col': {
                      md: 12,
                      children: ['S3BucketAndObjectPrefixNames']
                    }
                  },
                  {
                    'ui:col': {
                      md: 12,
                      children: ['S3CredentialsAPIEndpoint']
                    }
                  },
                  {
                    'ui:col': {
                      md: 12,
                      children: ['S3CredentialsAPIDocumentationURL']
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    S3BucketAndObjectPrefixNames: {
      'ui:title': 'S3 Bucket and Object Prefix Name',
      'ui:header-classname': 'h3-title',
      items: {
        'ui:title': 'S3 Bucket and Object Prefix Name'
      }
    },
    S3CredentialsAPIEndpoint: {
      'ui:title': 'S3 Credentials API Endpoint',
      'ui:widget': CustomTextWidget
    },
    S3CredentialsAPIDocumentationURL: {
      'ui:title': 'S3 Credentials API Documentation URL',
      'ui:widget': CustomTextWidget
    }
  }
}
export default archiveDistributionInformationUiSchema
