const relatedUrlsUiSchema = {
  'ui:submitButtonOptions': {
    norender: true
  },
  RelatedURLs: {
    'ui:title': 'Related URLs',
    'ui:heading-level': 'h3',
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
        'ui:title': 'Description',
        'ui:widget': 'textarea'
      }
    }
  }
}

export default relatedUrlsUiSchema
