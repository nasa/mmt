import CustomMultiSelectWidget from '../../../components/CustomMultiSelectWidget/CustomMultiSelectWidget'

const operationMetadataUiSchema = {
  'ui:submitButtonOptions': {
    norender: true
  },
  OperationMetadata: {
    'ui:heading-level': 'h3',
    'ui:title': 'Operation Metadata',
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
                        children: ['OperationName']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['OperationDescription']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['DistributedComputingPlatform']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['InvocationName']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['ConnectPoint']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['OperationChainedMetadata']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['CoupledResource']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['Parameters']
                      }
                    }
                  ]
                }
              ]
            }
          }
        ]
      },
      OperationDescription: {
        'ui:widget': 'textarea'
      },
      DistributedComputingPlatform: {
        'ui:widget': CustomMultiSelectWidget
      },
      ConnectPoint: {
        'ui:field': 'layout',
        'ui:layout_grid': {
          'ui:row': [
            {
              'ui:group': 'Connect Point',
              'ui:group-description': true,
              'ui:group-classname': 'h2-title',
              'ui:group-box-classname': 'h2-box',
              'ui:col': {
                className: 'field-left-border',
                md: 12,
                children: [
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 12,
                          children: ['ResourceName']
                        }
                      }
                    ]
                  },
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 12,
                          children: ['ResourceLinkage']
                        }
                      }
                    ]
                  },
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 12,
                          children: ['ResourceDescription']
                        }
                      }
                    ]
                  }
                ]
              }
            }
          ]
        },
        ResourceDescription: {
          'ui:widget': 'textarea'
        }
      },
      OperationChainedMetadata: {
        'ui:field': 'layout',
        'ui:layout_grid': {
          'ui:row': [
            {
              'ui:group': 'Operation Chained Metadata',
              'ui:group-description': true,
              'ui:group-classname': 'h2-title',
              'ui:group-box-classname': 'h2-box',
              'ui:col': {
                className: 'field-left-border',
                md: 12,
                children: [
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 12,
                          children: ['OperationChainName']
                        }
                      }
                    ]
                  },
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 12,
                          children: ['OperationChainDescription']
                        }
                      }
                    ]
                  }
                ]
              }
            }
          ]
        },
        OperationChainDescription: {
          'ui:widget': 'textarea'
        }
      },
      CoupledResource: {
        'ui:field': 'layout',
        'ui:layout_grid': {
          'ui:row': [
            {
              'ui:group': 'Coupled Resource',
              'ui:group-description': true,
              'ui:group-classname': 'h2-title',
              'ui:group-box-classname': 'h2-box',
              'ui:col': {
                className: 'field-left-border',
                md: 12,
                children: [
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 6,
                          children: ['ScopedName']
                        }
                      },
                      {
                        'ui:col': {
                          md: 6,
                          children: ['DataResourceDOI']
                        }
                      }
                    ]
                  },
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 12,
                          children: ['DataResource']
                        }
                      }
                    ]
                  },
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 12,
                          children: ['CouplingType']
                        }
                      }
                    ]
                  }
                ]
              }
            }
          ]
        },
        DataResource: {
          'ui:field': 'layout',
          'ui:layout_grid': {
            'ui:row': [
              {
                'ui:group': 'Data Resource',
                'ui:group-description': true,
                'ui:group-classname': 'h2-title',
                'ui:group-box-classname': 'h2-box',
                'ui:col': {
                  children: [
                    {
                      'ui:row': [
                        {
                          'ui:col': {
                            md: 6,
                            children: ['DataResourceIdentifier']
                          }
                        },
                        {
                          'ui:col': {
                            md: 6,
                            children: ['DataResourceSourceType']
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
                              marginBottom: '10px',
                              borderLeft: 'solid 5px rgb(240,240,240)'
                            },
                            md: 12,
                            children: ['DataResourceSpatialExtent']
                          }
                        }
                      ]
                    },
                    {
                      'ui:row': [
                        {
                          'ui:col': {
                            md: 6,
                            children: ['SpatialResolution']
                          }
                        },
                        {
                          'ui:col': {
                            md: 6,
                            children: ['SpatialResolutionUnit']
                          }
                        }
                      ]
                    },
                    {
                      'ui:group': 'Data  Resource Temporal Type',
                      'ui:group-classname': 'h2-title',
                      'ui:group-box-classname': 'h2-box',
                      'ui:row': [
                        {
                          'ui:col': {
                            md: 12,
                            children: ['DataResourceTemporalType']
                          }
                        }
                      ]
                    },
                    {
                      'ui:row': [
                        {
                          'ui:col': {
                            md: 12,
                            children: ['DataResourceTemporalExtent']
                          }
                        }
                      ]
                    },
                    {
                      'ui:row': [
                        {
                          'ui:col': {
                            md: 6,
                            children: ['TemporalResolution']
                          }
                        },
                        {
                          'ui:col': {
                            md: 6,
                            children: ['TemporalResolutionUnit']
                          }
                        }
                      ]
                    },
                    {
                      'ui:row': [
                        {
                          'ui:col': {
                            md: 12,
                            children: ['RelativePath']
                          }
                        }
                      ]
                    }
                  ]
                }
              }
            ]
          },
          DataResourceSpatialExtent: {
            'ui:hide-header': true,
            'ui:field': 'layout',
            'ui:layout_grid': {
              'ui:row': [
                {
                  'ui:group': 'Data Resource Spatial Extent',
                  'ui:group-classname': 'h2-title',
                  'ui:group-box-classname': 'h2-box',
                  className: 'field-left-border',
                  md: 12,
                  'ui:col': {
                    children: [
                      {
                        'ui:row': [
                          {
                            'ui:col': {
                              md: 12,
                              children: ['SpatialPoints']
                            }
                          }
                        ]
                      },
                      {
                        'ui:row': [
                          {
                            'ui:col': {
                              md: 12,
                              children: ['SpatialLineStrings']
                            }
                          }
                        ]
                      },
                      {
                        'ui:row': [
                          {
                            'ui:col': {
                              md: 12,
                              children: ['SpatialBoundingBox']
                            }
                          }
                        ]
                      },
                      {
                        'ui:row': [
                          {
                            'ui:col': {
                              md: 12,
                              children: ['GeneralGrid']
                            }
                          }
                        ]
                      },
                      {
                        'ui:row': [
                          {
                            'ui:col': {
                              md: 12,
                              children: ['SpatialPolygons']
                            }
                          }
                        ]
                      }
                    ]
                  }
                }
              ]
            },
            SpatialPoints: {
              items: {
                'ui:field': 'layout',
                'ui:layout_grid': {
                  'ui:row': [
                    {
                      'ui:col': {
                        children: [
                          {
                            'ui:row': [
                              {
                                'ui:col': {
                                  md: 6,
                                  children: ['Latitude']
                                }
                              },
                              {
                                'ui:col': {
                                  md: 6,
                                  children: ['Longitude']
                                }
                              }
                            ]
                          }
                        ]
                      }
                    }
                  ]
                },
                Latitude: {
                  'ui:type': 'number'
                },
                Longitude: {
                  'ui:type': 'number'
                }
              }
            },
            SpatialLineStrings: {
              'ui:hide-header': true,
              items: {
                'ui:field': 'layout',
                'ui:layout_grid': {
                  'ui:row': [
                    {
                      'ui:col': {
                        children: [
                          {
                            'ui:row': [
                              {
                                'ui:col': {
                                  md: 12,
                                  children: ['StartPoint']
                                }
                              }
                            ]
                          },
                          {
                            'ui:row': [
                              {
                                'ui:col': {
                                  md: 12,
                                  children: ['EndPoint']
                                }
                              }
                            ]
                          }
                        ]
                      }
                    }
                  ]
                },
                StartPoint: {
                  'ui:field': 'layout',
                  'ui:layout_grid': {
                    'ui:row': [
                      {
                        'ui:group': 'Start Point',
                        'ui:group-description': true,
                        'ui:group-classname': 'h3-title',
                        'ui:col': {
                          children: [
                            {
                              'ui:row': [
                                {
                                  'ui:col': {
                                    md: 6,
                                    children: ['Latitude']
                                  }
                                },
                                {
                                  'ui:col': {
                                    md: 6,
                                    children: ['Longitude']
                                  }
                                }
                              ]
                            }
                          ]
                        }
                      }
                    ]
                  },
                  Latitude: {
                    'ui:type': 'number'
                  },
                  Longitude: {
                    'ui:type': 'number'
                  }
                },
                EndPoint: {
                  'ui:field': 'layout',
                  'ui:layout_grid': {
                    'ui:row': [
                      {
                        'ui:col': {
                          children: [
                            {
                              'ui:group': 'End Point',
                              'ui:group-description': true,
                              'ui:group-classname': 'h3-title',
                              'ui:row': [
                                {
                                  'ui:col': {
                                    md: 6,
                                    children: ['Latitude']
                                  }
                                },
                                {
                                  'ui:col': {
                                    md: 6,
                                    children: ['Longitude']
                                  }
                                }
                              ]
                            }
                          ]
                        }
                      }
                    ]
                  },
                  Latitude: {
                    'ui:type': 'number'
                  },
                  Longitude: {
                    'ui:type': 'number'
                  }
                }
              }
            },
            SpatialBoundingBox: {
              'ui:field': 'layout',
              'ui:layout_grid': {
                'ui:row': [
                  {
                    'ui:col': {
                      children: [
                        {
                          'ui:group': 'Bounding Box',
                          'ui:group-description': true,
                          'ui:group-classname': 'h3-title',
                          'ui:row': [
                            {
                              'ui:col': {
                                md: 12,
                                children: ['CRSIdentifier']
                              }
                            }
                          ]
                        },
                        {
                          'ui:row': [
                            {
                              'ui:col': {
                                md: 6,
                                children: ['WestBoundingCoordinate']
                              }
                            },
                            {
                              'ui:col': {
                                md: 6,
                                children: ['SouthBoundingCoordinate']
                              }
                            }
                          ]
                        },
                        {
                          'ui:row': [
                            {
                              'ui:col': {
                                md: 6,
                                children: ['EastBoundingCoordinate']
                              }
                            },
                            {
                              'ui:col': {
                                md: 6,
                                children: ['NorthBoundingCoordinate']
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
            GeneralGrid: {
              'ui:field': 'layout',
              'ui:layout_grid': {
                'ui:row': [
                  {
                    'ui:col': {
                      children: [
                        {
                          'ui:group': 'General Grid',
                          'ui:group-description': true,
                          'ui:group-classname': 'h3-title',
                          'ui:row': [
                            {
                              'ui:col': {
                                md: 12,
                                children: ['CRSIdentifier']
                              }
                            }
                          ]
                        },
                        {
                          'ui:row': [
                            {
                              'ui:col': {
                                md: 12,
                                children: ['Axis']
                              }
                            }
                          ]
                        }
                      ]
                    }
                  }
                ]
              },
              Axis: {
                'ui:title': 'Axis',
                items: {
                  'ui:field': 'layout',
                  'ui:layout_grid': {
                    'ui:row': [
                      {
                        'ui:col': {
                          children: [
                            {
                              'ui:row': [
                                {
                                  'ui:col': {
                                    md: 12,
                                    children: ['AxisLabel']
                                  }
                                }
                              ]
                            },
                            {
                              'ui:row': [
                                {
                                  'ui:col': {
                                    md: 12,
                                    children: ['GridResolution']
                                  }
                                }
                              ]
                            },
                            {
                              'ui:row': [
                                {
                                  'ui:col': {
                                    md: 12,
                                    children: ['Extent']
                                  }
                                }
                              ]
                            }
                          ]
                        }
                      }
                    ]
                  },
                  Extent: {
                    'ui:field': 'layout',
                    'ui:layout_grid': {
                      'ui:row': [
                        {
                          'ui:group': 'Extent',
                          'ui:group-description': true,
                          'ui:group-classname': 'h3-title',
                          'ui:col': {
                            children: [
                              {
                                'ui:row': [
                                  {
                                    'ui:col': {
                                      md: 12,
                                      children: ['ExtentLabel']
                                    }
                                  }
                                ]
                              },
                              {
                                'ui:row': [
                                  {
                                    'ui:col': {
                                      md: 6,
                                      children: ['LowerBound']
                                    }
                                  },
                                  {
                                    'ui:col': {
                                      md: 6,
                                      children: ['UpperBound']
                                    }
                                  }
                                ]
                              },
                              {
                                'ui:row': [
                                  {
                                    'ui:col': {
                                      md: 12,
                                      children: ['UOMLabel']
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
            SpatialPolygons: {
              'ui:hide-header': true,
              items: {
                'ui:field': 'layout',
                'ui:layout_grid': {
                  'ui:row': [
                    {
                      'ui:col': {
                        children: [
                          {
                            'ui:group-classname': 'h3-title',
                            'ui:row': [
                              {
                                'ui:col': {
                                  md: 6,
                                  children: ['Latitude']
                                }
                              },
                              {
                                'ui:col': {
                                  md: 6,
                                  children: ['Longitude']
                                }
                              }
                            ]
                          }
                        ]
                      }
                    }
                  ]
                },
                Latitude: {
                  'ui:type': 'number'
                },
                Longitude: {
                  'ui:type': 'number'
                }
              }
            }
          },
          DataResourceTemporalExtent: {
            'ui:group-classname': 'h2-title',
            items: {
              'ui:field': 'layout',
              'ui:layout_grid': {
                'ui:row': [
                  {
                    children: [
                      {
                        'ui:row': [
                          {
                            'ui:col': {
                              md: 1,
                              children: ['DataResourceTimePoints']
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            }
          }
        }
      },
      Parameters: {
        items: {
          'ui:field': 'layout',
          'ui:layout_grid': {
            'ui:row': [
              {
                'ui:group-classname': 'h2-title',
                'ui:group-box-classname': 'h2-box',
                'ui:col': {
                  children: [
                    {
                      'ui:row': [
                        {
                          'ui:col': {
                            md: 12,
                            children: ['ParameterName']
                          }
                        }
                      ]
                    },
                    {
                      'ui:row': [
                        {
                          'ui:col': {
                            md: 12,
                            children: ['ParameterDescription']
                          }
                        }
                      ]
                    },
                    {
                      'ui:row': [
                        {
                          'ui:col': {
                            md: 12,
                            children: ['ParameterDirection']
                          }
                        }
                      ]
                    },
                    {
                      'ui:row': [
                        {
                          'ui:col': {
                            md: 12,
                            children: ['ParameterOptionality']
                          }
                        }
                      ]
                    },
                    {
                      'ui:row': [
                        {
                          'ui:col': {
                            md: 12,
                            children: ['ParameterRepeatability']
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
export default operationMetadataUiSchema
