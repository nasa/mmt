import CustomTextWidget from '../../../components/CustomTextWidget/CustomTextWidget'
import CustomSelectWidget from '../../../components/CustomSelectWidget/CustomSelectWidget'

const instanceInformationUiSchema = {
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
                    children: ['InstanceInformation']
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  },
  InstanceInformation: {
    'ui:title': 'Instance Information',
    'ui:heading-level': 'h3',
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
                      children: ['URL']
                    }
                  },
                  {
                    'ui:col': {
                      md: 12,
                      children: ['Format']
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
                      children: ['DirectDistributionInformation']
                    }
                  },
                  {
                    'ui:col': {
                      md: 12,
                      children: ['ChunkingInformation']
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
    Description: {
      'ui:widget': 'textarea'
    },
    DirectDistributionInformation: {
      'ui:field': 'layout',
      'ui:heading-level': 'h4',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:group': 'Direct Distribution Information',
            'ui:group-description': true,
            'ui:col': {
              md: 12,
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
        'ui:heading-level': 'h4',
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
}
export default instanceInformationUiSchema
