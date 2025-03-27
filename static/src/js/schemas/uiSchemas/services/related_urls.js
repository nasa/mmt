const relatedUrlsUiSchema = {
  'ui:submitButtonOptions': {
    norender: true
  },
  RelatedURLs: {
    'ui:heading-level': 'h3',
    'ui:title': 'Related URLs',
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
                }
              ]
            }
          }
        ]
      },
      Description: {
        'ui:widget': 'textarea'
      },
      URLContentType: {
        'ui:title': 'URL Content Type'
      }
    }
  }
}
export default relatedUrlsUiSchema
