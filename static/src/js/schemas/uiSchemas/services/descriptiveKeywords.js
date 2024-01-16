const descriptiveKeywordsUiSchema = {
  'ui:submitButtonOptions': {
    norender: true
  },
  'ui:heading-level': 'h3',
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
                {
                  'ui:col': {
                    md: 12,
                    children: ['ServiceKeywords']
                  }
                },
                {
                  'ui:col': {
                    md: 12,
                    children: ['AncillaryKeywords']
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  },
  ServiceKeywords: {
    'ui:title': 'Service Keyword',
    'ui:field': 'keywordPicker',
    'ui:keyword_scheme': 'science_keywords',
    'ui:picker_title': 'SERVICE KEYWORD',
    'ui:keyword_scheme_column_names': ['servicekeywords', 'category', 'topic', 'term', 'variable_level_1', 'variable_level_2', 'variable_level_3'],
    'ui:filter': 'EARTH SCIENCE SERVICES',
    'ui:scheme_values': ['ServiceCategory', 'ServiceTopic', 'ServiceTerm', 'ServiceSpecificTerm']
  },
  AncillaryKeywords: {
    'ui:heading-level': 'h4',
    'ui:default': ''
  }
}
export default descriptiveKeywordsUiSchema
