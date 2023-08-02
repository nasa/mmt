const serviceInformationUiSchema = {
  'ui:field': 'layout',
  'ui:layout_grid': {
    'ui:row': [
      {
        'ui:col': {
          md: 12,
          children: [
            {
              'ui:row': [
                { 'ui:col': { md: 12, children: ['Name'] } }
              ]
            },
            {
              'ui:row': [
                { 'ui:col': { md: 12, children: ['LongName'] } }
              ]
            },
            {
              'ui:row': [
                { 'ui:col': { md: 12, children: ['Version'] } }
              ]
            },
            {
              'ui:row': [
                { 'ui:col': { md: 12, children: ['VersionDescription'] } }
              ]
            },
            {
              'ui:row': [
                { 'ui:col': { md: 12, children: ['Type'] } }
              ]
            },
            {
              'ui:row': [
                { 'ui:col': { md: 12, children: ['LastUpdatedDate'] } }
              ]
            },
            {
              'ui:row': [
                { 'ui:col': { md: 12, children: ['Description'] } }
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
  LongName: {
    'ui:title': 'Long Name'
  },
  LastUpdatedDate: {
    'ui:title': 'Last Updated Date'
  },
  VersionDescription: {
    'ui:title': 'Version Description',
    'ui:widget': 'textarea'
  },
  Description: {
    'ui:widget': 'textarea'
  },
  URL: {
    'ui:root': 'URL',
    'ui:title': 'URL',
    'ui:field': 'layout',
    'ui:layout_grid': {
      'ui:row': [
        {
          'ui:group': 'URL',
          'ui:col': {
            children: [
              {
                'ui:row': [
                  { 'ui:col': { md: 12, children: ['Description'] } }
                ]
              },
              {
                'ui:row': [
                  { 'ui:col': { md: 12, children: ['URLValue'] } }
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
    URLValue: {
      'ui:title': 'URL Value'
    }
  }

}
export default serviceInformationUiSchema
