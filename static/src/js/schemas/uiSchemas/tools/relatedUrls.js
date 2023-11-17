const relatedUrlsUiSchema = {
  RelatedURLs: {
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
      }
      // TODO: Waiting for keywords from CMR.

      // Format: {
      //   'ui:widget': CustomSelectWidget,
      //   'ui:controlled': {
      //     name: 'granule-data-format',
      //     controlName: 'short_name'
      //   }
      // },
      // MimeType: {
      //   'ui:widget': CustomSelectWidget,
      //   'ui:controlled': {
      //     name: 'mime-type',
      //     controlName: 'mime_type'
      //   }
      // }
    }
  }
}

export default relatedUrlsUiSchema
