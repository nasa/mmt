import React from 'react'
import CustomTextareaWidget from '../../../components/CustomTextareaWidget/CustomTextareaWidget'
import CustomTextWidget from '../../../components/CustomTextWidget/CustomTextWidget'
import PlatformField from '../../../components/PlatformField/PlatformField'
import InstrumentField from '../../../components/InstrumentField/InstrumentField'

const acquisitionInformationUiSchema = {
  'ui:submitButtonOptions': {
    norender: true
  },
  'ui:heading-level': 'h3',
  'ui:field': 'layout',
  'ui:layout_grid': {
    'ui:row': [
      {
        'ui:group': 'Acquisition Information',
        'ui:col': {
          md: 12,
          children: [
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['Platforms']
                  }
                },
                {
                  'ui:col': {
                    md: 12,
                    children: ['Projects']
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  },
  Platforms: {
    'ui:heading-level': 'h4',
    items: {
      'ui:field': 'layout',
      'ui:controlled': {
        name: 'platforms',
        controlName: ['basis', 'category', 'short_name', 'long_name']
      },
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:col': {
              md: 12,
              children: [
                {
                  'ui:row': [
                    {
                      md: 12,
                      // Rendering custom component for ShortName, Type and LongName
                      render: (props) => (
                        <div>
                          <PlatformField {...props} />
                        </div>
                      )
                    },
                    {
                      'ui:col': {
                        md: 12,
                        children: ['Characteristics']
                      }
                    },
                    {
                      'ui:col': {
                        md: 12,
                        children: ['Instruments']
                      }
                    }
                  ]
                }
              ]
            }
          }
        ]
      },
      Characteristics: {
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
                            md: 12,
                            children: ['Unit']
                          }
                        },
                        {
                          'ui:col': {
                            md: 12,
                            children: ['DataType']
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
          }
        }
      },
      Instruments: {
        'ui:heading-level': 'h4',
        items: {
          'ui:field': 'layout',
          'ui:controlled': {
            name: 'instruments',
            controlName: ['category', 'class', 'type', 'subtype', 'short_name', 'long_name']
          },
          'ui:layout_grid': {
            'ui:row': [
              {
                'ui:col': {
                  md: 12,
                  children: [
                    {
                      md: 12,
                      // Rendering custom component for ShortName and LongName
                      render: (props) => (
                        <div>
                          <InstrumentField {...props} />
                        </div>
                      )
                    },
                    {
                      'ui:row': [
                        {
                          'ui:col': {
                            style: {
                              marginLeft: '10px',
                              marginBottom: '10px',
                              borderLeft: 'solid 5px rgb(240,240,240)'
                            },
                            md: 12,
                            children: ['Characteristics']
                          }
                        }
                      ]
                    },
                    {
                      'ui:row': [
                        {
                          'ui:col': {
                            md: 12,
                            children: ['Technique']
                          }
                        }
                      ]
                    },
                    {
                      'ui:row': [
                        {
                          'ui:col': {
                            md: 12,
                            children: ['NumberOfInstruments']
                          }
                        }
                      ]
                    },
                    {
                      'ui:row': [
                        {
                          'ui:col': {
                            md: 12,
                            children: ['OperationalModes']
                          }
                        }
                      ]
                    },
                    {
                      'ui:row': [
                        {
                          'ui:col': {
                            md: 12,
                            children: ['ComposedOf']
                          }
                        }
                      ]
                    }
                  ]
                }
              }
            ]
          },
          LongName: {
            'ui:widget': CustomTextWidget,
            'ui:place-holder': 'No available Long Name'
          },
          Characteristics: {
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
                                md: 12,
                                children: ['Unit']
                              }
                            },
                            {
                              'ui:col': {
                                md: 12,
                                children: ['DataType']
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
              }
            }
          },
          Technique: {
            'ui:widget': CustomTextareaWidget
          },
          ComposedOf: {
            'ui:heading-level': 'h4',
            items: {
              'ui:field': 'layout',
              'ui:controlled': {
                name: 'instruments',
                controlName: ['category', 'class', 'type', 'subtype', 'short_name', 'long_name']
              },
              'ui:layout_grid': {
                'ui:row': [
                  {
                    'ui:col': {
                      md: 12,
                      children: [
                        {
                          md: 12,
                          // Rendering custom component for ShortName and LongName
                          render: (props) => (
                            <div>
                              <InstrumentField {...props} />
                            </div>
                          )
                        },
                        {
                          'ui:row': [
                            {
                              'ui:col': {
                                md: 12,
                                children: ['Characteristics']
                              }
                            }
                          ]
                        },
                        {
                          'ui:row': [
                            {
                              'ui:col': {
                                md: 12,
                                children: ['Technique']
                              }
                            }
                          ]
                        },
                        {
                          'ui:row': [
                            {
                              'ui:col': {
                                md: 12,
                                children: ['NumberOfInstruments']
                              }
                            }
                          ]
                        },
                        {
                          'ui:row': [
                            {
                              'ui:col': {
                                md: 12,
                                children: ['OperationalModes']
                              }
                            }
                          ]
                        },
                        {
                          'ui:row': [
                            {
                              'ui:col': {
                                md: 12,
                                children: ['ComposedOf']
                              }
                            }
                          ]
                        }
                      ]
                    }
                  }
                ]
              },
              LongName: {
                'ui:widget': CustomTextWidget,
                'ui:place-holder': 'No available Long Name'
              },
              Characteristics: {
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
                                    md: 12,
                                    children: ['Unit']
                                  }
                                },
                                {
                                  'ui:col': {
                                    md: 12,
                                    children: ['DataType']
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
                  }
                }
              },
              Technique: {
                'ui:widget': CustomTextareaWidget
              }
            }
          }
        }
      }
    }
  },
  Projects: {
    'ui:heading-level': 'h4',
    items: {
      'ui:field': 'layout',
      'ui:controlled': {
        name: 'projects',
        map: {
          ShortName: 'short_name',
          LongName: 'long_name'
        }
      },
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
                        controlName: 'short_name',
                        md: 6,
                        children: ['ShortName']
                      }
                    },
                    {
                      'ui:col': {
                        controlName: 'long_name',
                        md: 6,
                        children: ['LongName']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['Campaigns']
                      }
                    }
                  ]
                },
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
                }
              ]
            }
          }
        ]
      },
      LongName: {
        'ui:widget': CustomTextWidget,
        'ui:place-holder': 'No available Long Name'
      }
    }
  }
}
export default acquisitionInformationUiSchema
