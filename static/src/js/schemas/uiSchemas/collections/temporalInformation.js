import CustomSelectWidget from '../../../components/CustomSelectWidget/CustomSelectWidget'
import temporalKeywords from '../../../utils/temporalKeywords'

const temporalInformationUiSchema = {
  'ui:field': 'layout',
  'ui:layout_grid': {
    'ui:row': [
      {
        'ui:group': 'Temporal Information',
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
                },
                {
                  'ui:col': {
                    md: 12,
                    children: ['TemporalKeywords']
                  }
                },
                {
                  'ui:col': {
                    md: 12,
                    children: ['PaleoTemporalCoverages']
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
    items: {
      'ui:field': 'layout',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:group': 'Temporal Range Type',
            'ui:group-classname': 'h3-title',
            'ui:group-box-classname': 'h2-box',
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
                        style: { paddingTop: '15px' },
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
      SingleDateTimes: {
        'ui:header-classname': 'h3-title'
      },
      RangeDateTimes: {
        'ui:header-classname': 'h3-title',
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
      PeriodicDateTimes: {
        'ui:header-classname': 'h3-title',
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
  },
  TemporalKeywords: {
    items: {
      'ui:widget': CustomSelectWidget,
      'ui:options': {
        enumOptions: temporalKeywords
      }
    }

  },
  PaleoTemporalCoverages: {
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
                        md: 6,
                        children: ['StartDate']
                      }
                    },
                    {
                      'ui:col': {
                        md: 6,
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
                        children: ['ChronostratigraphicUnits']
                      }
                    }
                  ]
                }
              ]
            }
          }
        ]
      },
      ChronostratigraphicUnits: {
        'ui:header-classname': 'h3-title',
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
                            children: ['Eon']
                          }
                        }
                      ]
                    },
                    {
                      'ui:row': [
                        {
                          'ui:col': {
                            md: 12,
                            children: ['Era']
                          }
                        }
                      ]
                    },
                    {
                      'ui:row': [
                        {
                          'ui:col': {
                            md: 12,
                            children: ['Epoch']
                          }
                        }
                      ]
                    },
                    {
                      'ui:row': [
                        {
                          'ui:col': {
                            md: 12,
                            children: ['Stage']
                          }
                        }
                      ]
                    },
                    {
                      'ui:row': [
                        {
                          'ui:col': {
                            md: 12,
                            children: ['DetailedClassification']
                          }
                        }
                      ]
                    },
                    {
                      'ui:row': [
                        {
                          'ui:col': {
                            md: 12,
                            children: ['Period']
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

export default temporalInformationUiSchema
