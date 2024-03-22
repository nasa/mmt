import CustomTextareaWidget from '../../../components/CustomTextareaWidget/CustomTextareaWidget'

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
                    children: ['ScienceKeywords']
                  }
                },
                {
                  'ui:col': {
                    md: 12,
                    children: ['AncillaryKeywords']
                  }
                },
                {
                  'ui:col': {
                    md: 12,
                    children: ['AdditionalAttributes']
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
    'ui:title': 'Science Keyword',
    'ui:field': 'keywordPicker',
    'ui:keyword_scheme': 'science_keywords',
    'ui:picker_title': 'SCIENCE KEYWORD',
    'ui:keyword_scheme_column_names': ['science_keywords', 'category', 'topic', 'term', 'variable_level_1', 'variable_level_2', 'variable_level_3'],
    'ui:filter': 'EARTH SCIENCE',
    'ui:scheme_values': ['Category', 'Topic', 'Term', 'VariableLevel1', 'VariableLevel2', 'VariableLevel3', 'DetailedVariable'],
    'ui:includeRecommendedKeywords': true
  },
  AncillaryKeywords: {
    'ui:heading-level': 'h4',
    'ui:default': ''
  },
  AdditionalAttributes: {
    'ui:heading-level': 'h4',
    items: {
      'ui:field': 'layout',
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
                        children: ['Name']
                      }
                    },
                    {
                      'ui:col': {
                        md: 12,
                        children: ['Description']
                      }
                    },
                    {
                      'ui:col': {
                        md: 12,
                        children: ['Value']
                      }
                    },
                    {
                      'ui:col': {
                        md: 6,
                        children: ['DataType']
                      }
                    },
                    {
                      'ui:col': {
                        md: 6,
                        children: ['MeasurementResolution']
                      }
                    },
                    {
                      'ui:col': {
                        md: 6,
                        children: ['ParameterRangeBegin']
                      }
                    },
                    {
                      'ui:col': {
                        md: 6,
                        children: ['ParameterRangeEnd']
                      }
                    },
                    {
                      'ui:col': {
                        md: 6,
                        children: ['ParameterUnitsOfMeasure']
                      }
                    },
                    {
                      'ui:col': {
                        md: 6,
                        children: ['ParameterValueAccuracy']
                      }
                    },
                    {
                      'ui:col': {
                        md: 12,
                        children: ['ValueAccuracyExplanation']
                      }
                    },
                    {
                      'ui:col': {
                        md: 6,
                        children: ['Group']
                      }
                    },
                    {
                      'ui:col': {
                        md: 6,
                        children: ['UpdateDate']
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
        'ui:widget': CustomTextareaWidget
      },
      Value: {
        'ui:widget': CustomTextareaWidget
      },
      ValueAccuracyExplanation: {
        'ui:widget': CustomTextareaWidget
      }
    }
  }
}
export default descriptiveKeywordsUiSchema
