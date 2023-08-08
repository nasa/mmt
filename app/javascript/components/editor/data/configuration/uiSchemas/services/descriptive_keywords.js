const descriptiveKeywordsUiSchema = {
  'ui:field': 'layout',
  'ui:layout_grid': {
    'ui:row': [
      {
        'ui:group': 'Descriptive Keywords',
        'ui:col': {
          md: 12,
          children: [
            {
              'ui:row': [
                { 'ui:col': { md: 12, children: ['ServiceKeywords'] } },
                { 'ui:col': { md: 12, children: ['AncillaryKeywords'] } }
              ]
            }
          ]
        }
      }
    ]
  },
  ServiceKeywords: {
    'ui:title': 'Service Keyword',
    'ui:field': 'keywordPicker'
  },
  AncillaryKeywords: {
    'ui:default': ''
  }
}
export default descriptiveKeywordsUiSchema
