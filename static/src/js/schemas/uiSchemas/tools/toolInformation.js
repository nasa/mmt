import CustomSelectWidget from '../../../components/CustomSelectWidget/CustomSelectWidget'
import urlTypes from '../../kms/urlTypeTool'

const toolInformationUiSchema = {
  'ui:field': 'layout',
  'ui:heading-level': 'h3',
  'ui:layout_grid': {
    'ui:row': [
      {
        'ui:group': 'Tool Information',
        'ui:required': true,
        'ui:col': {
          md: 12,
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
                    children: ['LongName']
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
                    children: ['LastUpdatedDate']
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
                    children: ['URL']
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
  Description: {
    'ui:widget': 'textarea'
  },
  Type: {
    'ui:widget': CustomSelectWidget
  },
  URL: {
    'ui:root': 'URL',
    'ui:field': 'layout',
    'ui:controlled': {
      keywords: urlTypes,
      map: {
        URLContentType: 'url_content_type',
        Type: 'type',
        Subtype: 'subtype'
      }
    },
    'ui:layout_grid': {
      'ui:row': [
        {
          'ui:group': 'URL',
          'ui:group-description': true,
          'ui:group-classname': 'h2-title',
          'ui:group-box-classname': 'h2-box',
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
                      children: ['URLValue']
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
      'ui:title': 'URL Description',
      'ui:widget': 'textarea'
    },
    URLContentType: { 'ui:title': 'URL Content Type' },
    URLValue: { 'ui:title': 'URL Value' },
    Type: { 'ui:title': ' Type' }
  }
}

export default toolInformationUiSchema
