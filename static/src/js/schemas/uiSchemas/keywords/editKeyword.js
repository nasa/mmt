import CustomSelectWidget from '@/js/components/CustomSelectWidget/CustomSelectWidget'
import CustomTextareaWidget from '@/js/components/CustomTextareaWidget/CustomTextareaWidget'
import CustomTextWidget from '@/js/components/CustomTextWidget/CustomTextWidget'
import KmsConceptSelectionWidget from '@/js/components/KmsConceptSelectionWidget/KmsConceptSelectionWidget'

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
                    children: ['PreferredLabel']
                  }
                },
                {
                  'ui:col': {
                    md: 12,
                    children: ['BroaderKeywords']
                  }
                },
                {
                  'ui:col': {
                    md: 12,
                    children: ['NarrowerKeywords']
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
    'ui:disabled': true
  },
  BroaderKeywords: {
    items: {
      'ui:field': 'layout',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:col': {
              md: 12,
              children: ['BroaderUUID']
            }
          }
        ]
      },
      BroaderUUID: {
        'ui:widget': KmsConceptSelectionWidget,
        'ui:title': 'Keyword'
      }
    }
  },
  NarrowerKeywords: {
    items: {
      'ui:field': 'layout',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:col': {
              md: 12,
              children: ['NarrowerUUID']
            }
          }
        ]
      },
      NarrowerUUID: {
        'ui:widget': KmsConceptSelectionWidget,
        'ui:title': 'Keyword'
      }
    }
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
              md: 4,
              children: ['LabelType']
            }
          },
          {
            'ui:col': {
              md: 8,
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
              md: 4,
              children: ['ResourceType']
            }
          },
          {
            'ui:col': {
              md: 8,
              children: ['ResourceUri']
            }
          }
        ]
      },
      ResourceType: {
        'ui:widget': CustomSelectWidget
      },
      ResourceUri: {
        'ui:widget': CustomTextWidget
      }
    }
  },
  Definition: {
    'ui:widget': CustomTextareaWidget
  },
  DefinitionReference: {
    'ui:widget': CustomTextareaWidget
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
        'ui:widget': KmsConceptSelectionWidget,
        'ui:title': 'Keyword'
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
