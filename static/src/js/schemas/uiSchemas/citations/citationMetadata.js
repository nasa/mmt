const citationMetadataUiSchema = {
  'ui:heading-level': 'h3',
  'ui:field': 'layout',
  'ui:layout_grid': {
    'ui:row': [
      {
        'ui:group': 'Citation Metadata',
        'ui:required': false,
        'ui:col': {
          md: 12,
          children: [
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['CitationMetadata']
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  },
  CitationMetadata: {
    'ui:heading-level': 'lead',
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
                    'ui:group-classname': 'h2-title',
                    'ui:group': 'Basic Information',
                    'ui:col': {
                      md: 12,
                      children: ['Title']
                    }
                  },
                  {
                    'ui:col': {
                      md: 12,
                      children: ['Year']
                    }
                  },
                  {
                    'ui:col': {
                      md: 12,
                      children: ['Type']
                    }
                  },
                  {
                    'ui:group-classname': 'h2-title',
                    'ui:group': 'Publication Details',
                    'ui:col': {
                      md: 12,
                      children: ['Publisher']
                    }
                  },
                  {
                    'ui:col': {
                      md: 12,
                      children: ['Container']
                    }
                  },
                  {
                    'ui:col': {
                      md: 12,
                      children: ['Volume']
                    }
                  },
                  {
                    'ui:col': {
                      md: 12,
                      children: ['Number']
                    }
                  },
                  {
                    'ui:col': {
                      md: 12,
                      children: ['Pages']
                    }
                  },
                  {
                    'ui:group-classname': 'h2-title',
                    'ui:group': 'Addition Information',
                    'ui:col': {
                      md: 12,
                      children: ['Address']
                    }
                  },
                  {
                    'ui:col': {
                      md: 12,
                      children: ['Institution']
                    }
                  },
                  {
                    'ui:group-classname': 'h2-title',
                    'ui:group': 'Authorship',
                    'ui:col': {
                      md: 12,
                      children: ['Author']
                    }
                  }

                ]
              }

            ]
          }
        }
      ]
    }
  }
}

export default citationMetadataUiSchema
