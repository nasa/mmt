import CustomSelectWidget from '@/js/components/CustomSelectWidget/CustomSelectWidget'
import CustomTextareaWidget from '@/js/components/CustomTextareaWidget/CustomTextareaWidget'
import CustomTextWidget from '@/js/components/CustomTextWidget/CustomTextWidget'

const editKeywordsUiSchema = {
  'ui:submitButtonOptions': {
    norender: true
  },
  'ui:field': 'layout',
  'ui:heading-level': 'h3',
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
                    children: ['KeywordUUID']
                  }
                },
                {
                  'ui:col': {
                    md: 12,
                    children: ['BroaderKeyword']
                  }
                },
                {
                  'ui:col': {
                    md: 12,
                    children: ['NarrowerKeyword']
                  }
                },
                {
                  'ui:col': {
                    md: 12,
                    children: ['PreferredLabel']
                  }
                },
                {
                  'ui:col': {
                    md: 12,
                    children: ['AlternateLabels']
                  }
                },
                {
                  'ui:col': {
                    md: 12,
                    children: ['Resources']
                  }
                },
                {
                  'ui:col': {
                    md: 12,
                    children: ['Definition']
                  }
                },
                {
                  'ui:col': {
                    md: 12,
                    children: ['DefinitionReference']
                  }
                },
                {
                  'ui:col': {
                    md: 12,
                    children: ['RelatedKeywords']
                  }
                },
                {
                  'ui:col': {
                    md: 12,
                    children: ['ChangeLogs']
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  },
  KeywordUUID: {
    'ui:widget': CustomTextWidget,
    'ui:readonly': true
  },
  BroaderKeyword: {
    'ui:widget': CustomTextWidget
  },
  PreferredLabel: {
    'ui:widget': CustomTextWidget
  },
  AlternateLabels: {
    items: {
      'ui:field': 'layout',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:col': {
              md: 6,
              children: ['LabelType']
            }
          },
          {
            'ui:col': {
              md: 6,
              children: ['LabelName']
            }
          }
        ]
      },
      LabelType: {
        'ui:widget': CustomSelectWidget
      },
      LabelName: {
        'ui:widget': CustomTextWidget
      }
    }
  },
  Resources: {
    items: {
      'ui:field': 'layout',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:col': {
              md: 6,
              children: ['ResourceType']
            }
          },
          {
            'ui:col': {
              md: 6,
              children: ['ResourceLabel']
            }
          }
        ]
      },
      ResourceType: {
        'ui:widget': CustomSelectWidget
      },
      ResourceLabel: {
        'ui:widget': CustomTextWidget
      }
    }
  },
  Definition: {
    'ui:widget': CustomTextareaWidget
  },
  DefinitionReference: {
    'ui:widget': CustomTextWidget
  },
  RelatedKeywords: {
    items: {
      'ui:field': 'layout',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:col': {
              md: 6,
              children: ['RelationshipType']
            }
          },
          {
            'ui:col': {
              md: 6,
              children: ['UUID']
            }
          }
        ]
      },
      RelationshipType: {
        'ui:widget': CustomSelectWidget
      },
      UUID: {
        'ui:widget': CustomTextWidget,
        'ui:readonly': true
      }
    }
  },
  ChangeLogs: {
    'ui:widget': CustomTextareaWidget,
    'ui:disabled': true,
    'ui:collapsible': true
  }
}

export default editKeywordsUiSchema
