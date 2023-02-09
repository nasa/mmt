import React from 'react'
import ControlledFields from '../../../../components/ControlledFields'

const relatedUrlsUiSchema = {
  RelatedURLs: {
    items: {
      'ui:field': 'layout',
      'ui:keyword_scheme': 'related-urls',
      'ui:keyword_scheme_column_names': ['url_content_type', 'type', 'subtype'],
      'ui:controlledFields': ['URLContentType', 'Type', 'Subtype'],
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:col': {
              md: 12,
              children: [
                {
                  'ui:row': [
                    { 'ui:col': { md: 12, children: ['Description'] } }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        children: [
                          {
                            name: 'related-urls',
                            render: (props) => (
                              <ControlledFields {...props} />
                            )
                          }
                        ]

                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    { 'ui:col': { md: 12, children: ['URL'] } }
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
