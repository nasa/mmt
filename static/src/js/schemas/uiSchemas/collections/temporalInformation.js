import CustomSelectWidget from '../../../components/CustomSelectWidget/CustomSelectWidget'

const temporalInformationUiSchema = {
  'ui:submitButtonOptions': {
    norender: true
  },
  'ui:heading-level': 'h3',
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
                        style: { paddingTop: '15px' },
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
  },
  TemporalKeywords: {
    'ui:heading-level': 'h4',
    items: {
      'ui:widget': CustomSelectWidget,
      'ui:controlled': {
        name: 'temporal_keywords',
        controlName: 'temporal_resolution_range'
      }
    }

  },
  PaleoTemporalCoverages: {
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
