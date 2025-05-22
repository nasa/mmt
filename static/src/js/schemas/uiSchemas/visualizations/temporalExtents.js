const temporalExtentsUiSchema = {
  'ui:submitButtonOptions': {
    norender: true
  },
  'ui:heading-level': 'h3',
  'ui:field': 'layout',
  'ui:layout_grid': {
    'ui:row': [
      {
        'ui:group': 'Temporal Extents',
        'ui:col': {
          md: 12,
          children: [
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['TemporalExtents']
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  },
  TemporalExtents: {
    'ui:heading-level': 'h4',
    items: {
      'ui:field': 'layout',
      'ui:fieldReplacesAnyOrOneOf': true,
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:group': 'Temporal Range Type',
            'ui:col': {
              md: 12,
              children: [
                {
                  'ui:group-checkbox': 'Single',
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['SingleDateTimes']
                      }
                    }
                  ]
                },
                {
                  'ui:group-checkbox': 'Range',
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['RangeDateTimes']
                      }
                    }
                  ]
                },
                {
                  'ui:group-checkbox': 'Periodic',
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['PeriodicDateTimes']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        style: {
                          paddingBlockStart: '15px'
                        },
                        md: 12,
                        children: ['TemporalResolution']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        style: { paddingBlockStart: '15px' },
                        md: 12,
                        children: ['PrecisionOfSeconds']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['EndsAtPresentFlag']
                      }
                    }
                  ]
                }
              ]
            }
          }
        ]
      },
      TemporalResolution: {
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
                          children: ['Unit']
                        }
                      },
                      {
                        'ui:col': {
                          md: 12,
                          children: ['Value']
                        }
                      }
                    ]
                  }
                ]
              }
            }
          ]
        }
      },
      RangeDateTimes: {
        'ui:heading-level': 'h5',
        items: {
          'ui:field': 'layout',
          'ui:layout_grid': {
            'ui:row': [
              {
                'ui:hide-header': true,
                'ui:col': {
                  md: 12,
                  children: [
                    {
                      'ui:row': [
                        {
                          'ui:col': {
                            md: 12,
                            children: ['BeginningDateTime']
                          }
                        }
                      ]
                    },
                    {
                      'ui:row': [
                        {
                          'ui:col': {
                            md: 12,
                            children: ['EndingDateTime']
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
      },
      SingleDateTimes: {
        'ui:heading-level': 'h5',
        items: {
          'ui:widget': 'datetime'
        }
      },
      PeriodicDateTimes: {
        'ui:heading-level': 'h5',
        items: {
          'ui:field': 'layout',
          'ui:layout_grid': {
            'ui:row': [
              {
                'ui:hide-header': true,
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
                        }
                      ]
                    },
                    {
                      'ui:row': [
                        {
                          'ui:col': {
                            md: 12,
                            children: ['StartDate']
                          }
                        }
                      ]
                    },
                    {
                      'ui:row': [
                        {
                          'ui:col': {
                            md: 12,
                            children: ['EndDate']
                          }
                        }
                      ]
                    },
                    {
                      'ui:row': [
                        {
                          'ui:col': {
                            md: 12,
                            children: ['DurationUnit']
                          }
                        }
                      ]
                    },
                    {
                      'ui:row': [
                        {
                          'ui:col': {
                            md: 12,
                            children: ['DurationValue']
                          }
                        }
                      ]
                    },
                    {
                      'ui:row': [
                        {
                          'ui:col': {
                            md: 12,
                            children: ['PeriodCycleDurationUnit']
                          }
                        }
                      ]
                    },
                    {
                      'ui:row': [
                        {
                          'ui:col': {
                            md: 12,
                            children: ['PeriodCycleDurationValue']
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
  }
}

export default temporalExtentsUiSchema
