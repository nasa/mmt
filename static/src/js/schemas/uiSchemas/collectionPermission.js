import CustomCheckboxWidget from '@/js/components/CustomCheckboxWidget/CustomCheckboxWidget'

const collectionPermissionUiSchema = {
  'ui:submitButtonOptions': {
    norender: true
  },
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
                    md: 4,
                    children: ['name']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['accessPermission']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['accessConstraintFilter']
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  },
  accessPermission: {
    'ui:title': 'Access to permission',
    'ui:required': true,
    'ui:heading-level': 'h4',
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
                      children: ['permission']
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    permission: {
      'ui:field': 'layout',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:col': {
              md: 6,
              children: [
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 6,
                        children: ['collection']
                      }
                    },
                    {
                      'ui:col': {
                        md: 6,
                        children: ['granule']
                      }
                    }
                  ]
                }
              ]
            }
          }
        ]
      },
      collection: {
        'ui:widget': CustomCheckboxWidget
      },
      granule: {
        'ui:widget': CustomCheckboxWidget
      }
    }

  },
  accessConstraintFilter: {
    'ui:title': 'Access Constraint Filter',
    'ui:heading-level': 'h4',
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
                      children: ['collectionAssessConstraint']
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    collectionAssessConstraint: {
      'ui:field': 'layout',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:group': 'Collection',
            'ui:col': {
              md: 6,
              children: [
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['minValue']
                      }
                    },
                    {
                      'ui:col': {
                        md: 12,
                        children: ['maxValue']
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
}

export default collectionPermissionUiSchema
