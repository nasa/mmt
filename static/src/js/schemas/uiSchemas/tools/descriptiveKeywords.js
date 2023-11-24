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
                {
                  'ui:col': {
                    md: 12,
                    children: ['ToolKeywords']
                  }
                }
              ]
            },
            {
              'ui:row': [
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
  ToolKeywords: {
    'ui:title': 'Tool Keyword',
    'ui:field': 'keywordPicker',
    'ui:keyword_scheme': 'science_keywords',
    'ui:picker_title': 'TOOL KEYWORD',
    'ui:keyword_scheme_column_names': ['toolkeywords', 'category', 'topic', 'term', 'variable_level_1', 'variable_level_2', 'variable_level_3'],
    'ui:filter': 'EARTH SCIENCE SERVICES',
    'ui:scheme_values': ['ToolCategory', 'ToolTopic', 'ToolTerm', 'ToolSpecificTerm']
  },
  AncillaryKeywords: {
    'ui:default': ''
  }
}

export default descriptiveKeywordsUiSchema
