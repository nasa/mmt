const citationScienceKeywordsUiSchema = {
  'ui:heading-level': 'h3',
  'ui:field': 'layout',
  'ui:layout_grid': {
    'ui:row': [
      {
        'ui:group': 'Science Keywords',
        'ui:required': true,
        'ui:col': {
          md: 12,
          children: [
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['ScienceKeywords']
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  },
  ScienceKeywords: {
    'ui:field': 'keywordPicker',
    'ui:keyword_scheme': 'science_keywords',
    'ui:picker_title': 'SERVICE KEYWORD',
    'ui:keyword_scheme_column_names': ['sciencekeywords', 'category', 'topic', 'term', 'variable_level_1', 'variable_level_2', 'variable_level_3'],
    'ui:filter': 'EARTH SCIENCE',
    'ui:scheme_values': ['Category', 'Topic', 'Term', 'VariableLevel1', 'VariableLevel2', 'VariableLevel3']
  }
}

export default citationScienceKeywordsUiSchema
