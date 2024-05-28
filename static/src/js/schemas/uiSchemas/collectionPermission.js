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
                },
                {
                  'ui:col': {
                    md: 4,
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
                    children: ['collectionSelection']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    style: {
                      marginLeft: '10px',
                      borderLeft: 'solid 5px rgb(240,240,240)'
                    },
                    md: 12,
                    children: ['accessConstraintFilter']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    style: {
                      marginLeft: '10px',
                      marginBottom: '5px',
                      borderLeft: 'solid 5px rgb(240,240,240)'
                    },
                    md: 12,
                    children: ['temporalConstraintFilter']
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  },
  collectionSelection: {
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
                      children: ['selectedCollection']
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    selectedCollection: {
      'ui:field': 'CollectionSelector'
    }
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
    'ui:field': 'layout',
    'ui:layout_grid': {
      'ui:row': [
        {
          'ui:group': 'Access Constraint Filter',
          'ui:group-description': true,

          'ui:col': {
            md: 12,
            children: [
              {
                'ui:row': [
                  {
                    'ui:col': {
                      md: 6,
                      children: ['collectionAssessConstraint']
                    }
                  },
                  {
                    'ui:col': {
                      md: 6,
                      children: ['granuleAssessConstraint']
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
      'ui:clear': true,
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:group': 'Collection',
            'ui:col': {
              md: 12,
              children: [
                {
                  'ui:row': [
                    {
                      'ui:col': {

                        md: 6,
                        children: ['minimumValue']
                      }
                    },
                    {
                      'ui:col': {
                        md: 6,
                        children: ['maximumValue']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 6,
                        children: ['includeUndefined']
                      }
                    }
                  ]
                }
              ]
            }
          }
        ]
      },
      includeUndefined: {
        'ui:widget': CustomCheckboxWidget
      }
    },
    granuleAssessConstraint: {
      'ui:disabled': true,
      'ui:clear': true,
      'ui:field': 'layout',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:group': 'Granule',
            'ui:col': {
              md: 12,
              children: [
                {
                  'ui:row': [
                    {
                      'ui:col': {

                        md: 6,
                        children: ['minimumValue']
                      }
                    },
                    {
                      'ui:col': {
                        md: 6,
                        children: ['maximumValue']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 6,
                        children: ['includeUndefined']
                      }
                    }
                  ]
                }
              ]
            }
          }
        ]
      },
      includeUndefined: {
        'ui:widget': CustomCheckboxWidget
      }
    }

  },
  temporalConstraintFilter: {
    'ui:field': 'layout',
    'ui:layout_grid': {
      'ui:row': [
        {
          'ui:group': 'Temporal Constraint Filter',
          'ui:group-description': true,

          'ui:col': {
            md: 12,
            children: [
              {
                'ui:row': [
                  {
                    'ui:col': {
                      md: 6,
                      children: ['collectionTemporalConstraint']
                    }
                  },
                  {
                    'ui:col': {
                      md: 6,
                      children: ['granuleTemporalConstraint']
                    }
                  }
                ]
              }
            ]
          }
        }

      ]
    },
    collectionTemporalConstraint: {
      'ui:field': 'layout',
      'ui:clear': true,
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:group': 'Collection',
            'ui:col': {
              md: 12,
              children: [
                {
                  'ui:row': [
                    {
                      'ui:col': {

                        md: 6,
                        children: ['startDate']
                      }
                    },
                    {
                      'ui:col': {
                        md: 6,
                        children: ['stopDate']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 6,
                        children: ['musk']
                      }
                    }
                  ]
                }
              ]
            }
          }
        ]
      },
      includeUndefined: {
        'ui:widget': CustomCheckboxWidget
      }
    },
    granuleTemporalConstraint: {
      'ui:disabled': true,
      'ui:clear': true,
      'ui:field': 'layout',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:group': 'Granule',
            'ui:col': {
              md: 12,
              children: [
                {
                  'ui:row': [
                    {
                      'ui:col': {

                        md: 6,
                        children: ['startDate']
                      }
                    },
                    {
                      'ui:col': {
                        md: 6,
                        children: ['stopDate']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 6,
                        children: ['musk']
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
