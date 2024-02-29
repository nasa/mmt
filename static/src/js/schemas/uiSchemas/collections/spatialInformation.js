/* eslint-disable react/react-in-jsx-scope */
import PreviewMapLink from '../../../components/PreviewMapLink/PreviewMapLink'
import '../../../components/PreviewMapLink/PreviewMapLink.scss'
import CustomSelectWidget from '../../../components/CustomSelectWidget/CustomSelectWidget'

const spatialInformationUiSchema = {
  'ui:field': 'layout',
  'ui:layout_grid': {
    'ui:row': [
      {
        'ui:group': 'Spatial Information',
        'ui:group-description': true,
        'ui:col': {
          md: 12,
          children: [
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['SpatialExtent']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['TilingIdentificationSystems']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['SpatialInformation']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['LocationKeywords']
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  },
  SpatialExtent: {
    'ui:field': 'layout',
    'ui:layout_grid': {
      'ui:group': 'Spatial Extent',
      'ui:group-classname': 'h2-title',
      'ui:group-box-classname': 'h2-box',
      'ui:group-description': true,
      'ui:row': [
        {
          'ui:group-box-checkbox': 'h1-box',
          'ui:col': {
            md: 12,
            children: [
              {
                'ui:group-checkbox': 'Horizontal',
                'ui:row': [
                  {
                    'ui:col': {
                      md: 12,
                      children: ['HorizontalSpatialDomain']
                    }
                  }
                ]
              },
              {
                'ui:group-checkbox': 'Vertical',
                'ui:row': [
                  {
                    'ui:col': {
                      md: 12,
                      children: ['VerticalSpatialDomains']
                    }
                  }
                ]
              },
              {
                'ui:group-checkbox': 'Orbital',
                'ui:group-box-classname': 'h2-box',
                'ui:row': [
                  {
                    'ui:col': {
                      md: 12,
                      children: ['OrbitParameters']
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
                      children: ['GranuleSpatialRepresentation']
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    HorizontalSpatialDomain: {
      'ui:field': 'layout',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:group': 'Horizontal Spatial Domain',
            'ui:group-classname': 'h3-title',
            'ui:group-box-classname': 'h2-box',
            'ui:col': {
              md: 12,
              children: [
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['ZoneIdentifier']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['Geometry']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['ResolutionAndCoordinateSystem']
                      }
                    }
                  ]
                }
              ]
            }
          }
        ]
      },
      Geometry: {
        'ui:field': 'layout',
        'ui:layout_grid': {
          'ui:row': [
            {
              'ui:group': 'Geometry',
              'ui:group-classname': 'h3-title',
              'ui:group-box-classname': 'h2-box',
              'ui:col': {
                style: { 'margin-bottom': '15px' },
                md: 12,
                children: [
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          className: 'field-left-border',
                          md: 12,
                          children: ['CoordinateSystem']
                        }
                      }
                    ]
                  },
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          className: 'field-left-border',
                          md: 12,
                          children: ['Points']
                        }
                      }
                    ]
                  },
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          className: 'field-left-border',
                          md: 12,
                          children: ['BoundingRectangles']
                        }
                      }
                    ]
                  },
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          className: 'field-left-border',
                          md: 12,
                          children: ['GPolygons']
                        }
                      }
                    ]
                  },
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          className: 'field-left-border',
                          md: 12,
                          children: ['Lines']
                        }
                      }
                    ]
                  }
                ]
              }
            }
          ]
        },
        Points: {
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
                              md: 6,
                              children: ['Longitude']
                            }
                          }
                        ]
                      },
                      {
                        'ui:row': [
                          {
                            'ui:col': {
                              md: 12,
                              children: ['Latitude']
                            }
                          }
                        ]
                      }
                      // {
                      //   'ui:row': [
                      //     {
                      //       md: 12,
                      //       render: (props) => (
                      //         <div className="preview-map-link__icon-label">
                      //           <PreviewMapLink {...props} type="point" />
                      //         </div>
                      //       )
                      //     }]
                      // }
                    ]
                  }
                }
              ]
            }
          }
        },
        BoundingRectangles: {
          'ui:header-classname': 'h3-title',
          items: {
            'ui:field': 'boundingRectangle'
          }
        },
        GPolygons: {
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
                              children: ['Boundary']
                            }
                          }
                        ]
                      },
                      // {
                      //   'ui:row': [
                      //     {
                      //       md: 12,
                      //       render: (props) => (
                      //         <div className="preview-map-link__icon-label pb-4 pl-3">
                      //           <PreviewMapLink {...props} type="polygon" />
                      //         </div>
                      //       )
                      //     }]
                      // },
                      {
                        'ui:row': [
                          {
                            'ui:col': {
                              md: 12,
                              children: ['ExclusiveZone']
                            }
                          }
                        ]
                      }
                    ]
                  }
                }
              ]
            },
            ExclusiveZone: {
              'ui:field': 'layout',
              'ui:layout_grid': {
                'ui:row': [
                  {
                    'ui:group': 'Exclusive Zone',
                    'ui:group-classname': 'h3-title',
                    'ui:group-box-classname': 'h2-box',
                    'ui:group-description': true,
                    'ui:col': {
                      md: 12,
                      children: [
                        {
                          'ui:row': [
                            {
                              'ui:col': {
                                md: 12,
                                children: ['Boundaries']
                              }
                            }
                          ]
                        }
                      ]
                    }
                  }
                ]
              },
              Boundaries: {
                'ui:title': 'Boundary',
                'ui:header-classname': 'h3-title',
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
                                    children: ['Points']
                                  }
                                }
                              ]
                            }
                          ]
                        }
                      }
                    ]
                  },
                  Points: {
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
                                        children: ['Longitude']
                                      }
                                    }
                                  ]
                                },
                                {
                                  'ui:row': [
                                    {
                                      'ui:col': {
                                        md: 12,
                                        children: ['Latitude']
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
            },
            Boundary: {
              'ui:header-classname': 'h3-title',
              Points: {
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
                                    children: ['Longitude']
                                  }
                                }
                              ]
                            },
                            {
                              'ui:row': [
                                {
                                  'ui:col': {
                                    md: 12,
                                    children: ['Latitude']
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
        },
        Lines: {
          'ui:header-classname': 'h3-title',
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
                              children: ['Points']
                            }
                          }
                        ]
                      }
                    ]
                  }
                }
              ]
            },
            Points: {
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
                                  children: ['Longitude']
                                }
                              }
                            ]
                          },
                          {
                            'ui:row': [
                              {
                                'ui:col': {
                                  md: 12,
                                  children: ['Latitude']
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
      },
      ResolutionAndCoordinateSystem: {
        'ui:widget': CustomSelectWidget,
        'ui:field': 'layout',
        'ui:layout_grid': {
          'ui:row': [
            {
              'ui:group-classname': 'h3-title',
              'ui:group-box-classname': 'h2-box',
              'ui:group-description': true,
              'ui:col': {
                md: 12,
                children: [
                  {
                    'ui:row': [{
                      'ui:col': {
                        md: 12,
                        children: ['Description']
                      }
                    }]
                  },
                  {
                    'ui:row': [{
                      'ui:col': {
                        md: 12,
                        children: ['GeodeticModel']
                      }
                    }]
                  },
                  {
                    'ui:row': [{
                      'ui:col': {
                        md: 12,
                        children: ['HorizontalDataResolution']
                      }
                    }]
                  },
                  {
                    'ui:row': [{
                      'ui:col': {
                        md: 12,
                        children: ['LocalCoordinateSystem']
                      }
                    }]
                  }
                ]
              }
            }
          ]
        },
        GeodeticModel: {
          'ui:header-classname': 'h3-title'
        },
        HorizontalDataResolution: {
          'ui:field': 'layout',
          'ui:layout_grid': {
            'ui:row': [
              {
                'ui:group': 'Horizontal Data Resolution',
                'ui:group-classname': 'h3-title',
                'ui:group-box-classname': 'h2-box',
                'ui:col': {
                  md: 12,
                  children: [
                    {
                      'ui:row': [{
                        'ui:col': {
                          md: 12,
                          children: ['VariesResolution']
                        }
                      }]
                    },
                    {
                      'ui:row': [{
                        'ui:col': {
                          md: 12,
                          children: ['PointResolution']
                        }
                      }]
                    },
                    {
                      'ui:row': [{
                        'ui:col': {
                          md: 12,
                          children: ['NonGriddedResolutions']
                        }
                      }]
                    },
                    {
                      'ui:row': [{
                        'ui:col': {
                          md: 12,
                          children: ['NonGriddedRangeResolutions']
                        }
                      }]
                    },
                    {
                      'ui:row': [{
                        'ui:col': {
                          md: 12,
                          children: ['GriddedResolutions']
                        }
                      }]
                    },
                    {
                      'ui:row': [{
                        'ui:col': {
                          md: 12,
                          children: ['GriddedRangeResolutions']
                        }
                      }]
                    },
                    {
                      'ui:row': [{
                        'ui:col': {
                          md: 12,
                          children: ['GenericResolutions']
                        }
                      }]
                    }
                  ]
                }
              }
            ]
          },
          NonGriddedResolutions: {
            'ui:header-classname': 'h3-title',
            'ui:header-box-classname': 'h2-box',
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
                          'ui:row': [{
                            'ui:col': {
                              md: 12,
                              children: ['XDimension']
                            }
                          }]
                        },
                        {
                          'ui:row': [{
                            'ui:col': {
                              md: 12,
                              children: ['YDimension']
                            }
                          }]
                        },
                        {
                          'ui:row': [{
                            'ui:col': {
                              md: 12,
                              children: ['Unit']
                            }
                          }]
                        },
                        {
                          'ui:row': [{
                            'ui:col': {
                              md: 12,
                              children: ['ViewingAngleType']
                            }
                          }]
                        },
                        {
                          'ui:row': [{
                            'ui:col': {
                              md: 12,
                              children: ['ScanDirection']
                            }
                          }]
                        }
                      ]
                    }
                  }
                ]
              }
            }
          },
          NonGriddedRangeResolutions: {
            'ui:header-classname': 'h3-title',
            'ui:header-box-classname': 'h2-box',
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
                          'ui:row': [{
                            'ui:col': {
                              md: 12,
                              children: ['MinimumXDimension']
                            }
                          }]
                        },
                        {
                          'ui:row': [{
                            'ui:col': {
                              md: 12,
                              children: ['MinimumYDimension']
                            }
                          }]
                        },
                        {
                          'ui:row': [{
                            'ui:col': {
                              md: 12,
                              children: ['MaximumXDimension']
                            }
                          }]
                        },
                        {
                          'ui:row': [{
                            'ui:col': {
                              md: 12,
                              children: ['MaximumYDimension']
                            }
                          }]
                        },
                        {
                          'ui:row': [{
                            'ui:col': {
                              md: 12,
                              children: ['Unit']
                            }
                          }]
                        },
                        {
                          'ui:row': [{
                            'ui:col': {
                              md: 12,
                              children: ['ViewingAngleType']
                            }
                          }]
                        },
                        {
                          'ui:row': [{
                            'ui:col': {
                              md: 12,
                              children: ['ScanDirection']
                            }
                          }]
                        }
                      ]
                    }
                  }
                ]
              }
            }
          },
          GriddedResolutions: {
            'ui:header-classname': 'h3-title',
            'ui:header-box-classname': 'h2-box',
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
                          'ui:row': [{
                            'ui:col': {
                              md: 12,
                              children: ['XDimension']
                            }
                          }]
                        },
                        {
                          'ui:row': [{
                            'ui:col': {
                              md: 12,
                              children: ['YDimension']
                            }
                          }]
                        },
                        {
                          'ui:row': [{
                            'ui:col': {
                              md: 12,
                              children: ['Unit']
                            }
                          }]
                        }
                      ]
                    }
                  }
                ]
              }
            }
          },
          GriddedRangeResolutions: {
            'ui:header-classname': 'h3-title',
            'ui:header-box-classname': 'h2-box',
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
                          'ui:row': [{
                            'ui:col': {
                              md: 12,
                              children: ['MinimumXDimension']
                            }
                          }]
                        },
                        {
                          'ui:row': [{
                            'ui:col': {
                              md: 12,
                              children: ['MinimumYDimension']
                            }
                          }]
                        },
                        {
                          'ui:row': [{
                            'ui:col': {
                              md: 12,
                              children: ['MaximumXDimension']
                            }
                          }]
                        },
                        {
                          'ui:row': [{
                            'ui:col': {
                              md: 12,
                              children: ['MaximumYDimension']
                            }
                          }]
                        },
                        {
                          'ui:row': [{
                            'ui:col': {
                              md: 12,
                              children: ['Unit']
                            }
                          }]
                        }
                      ]
                    }
                  }
                ]
              }
            }
          },
          GenericResolutions: {
            'ui:header-classname': 'h3-title',
            'ui:header-box-classname': 'h2-box',
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
                          'ui:row': [{
                            'ui:col': {
                              md: 12,
                              children: ['XDimension']
                            }
                          }]
                        },
                        {
                          'ui:row': [{
                            'ui:col': {
                              md: 12,
                              children: ['YDimension']
                            }
                          }]
                        },
                        {
                          'ui:row': [{
                            'ui:col': {
                              md: 12,
                              children: ['Unit']
                            }
                          }]
                        }
                      ]
                    }
                  }
                ]
              }
            }
          }
        },
        LocalCoordinateSystem: {
          'ui:header-classname': 'h3-title'
        }
      }
    },
    VerticalSpatialDomains: {
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
                          md: 6,
                          children: ['Type']
                        }
                      }
                    ]
                  },
                  {
                    'ui:row': [
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
      }
    },
    OrbitParameters: {
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
                        children: ['Footprints']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        style: {
                          borderLeft: 'solid 6px rgb(240, 240, 240)',
                          marginLeft: '15px',
                          marginTop: '15px'
                        },
                        md: 12,
                        children: ['SwathWidth']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        style: {
                          borderLeft: 'solid 6px rgb(240, 240, 240)',
                          marginLeft: '15px'
                        },
                        md: 12,
                        children: ['SwathWidthUnit']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        style: { marginTop: '15px' },
                        md: 12,
                        children: ['OrbitPeriod']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['OrbitPeriodUnit']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['InclinationAngle']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['InclinationAngleUnit']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['NumberOfOrbits']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['StartCircularLatitude']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['StartCircularLatitudeUnit']
                      }
                    }
                  ]
                }

              ]
            }
          }
        ]
      },
      Footprints: {
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
                            children: ['Footprint']
                          }
                        }
                      ]
                    },
                    {
                      'ui:row': [
                        {
                          'ui:col': {
                            md: 12,
                            children: ['FootprintUnit']
                          }
                        }
                      ]
                    },
                    {
                      'ui:row': [
                        {
                          'ui:col': {
                            md: 12,
                            children: ['Description']
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
  TilingIdentificationSystems: {
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
                        children: ['TilingIdentificationSystemName']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 6,
                        children: ['Coordinate1']
                      }
                    },
                    {
                      'ui:col': {
                        md: 6,
                        children: ['Coordinate2']
                      }
                    }
                  ]
                }
              ]
            }
          }
        ]
      },
      Coordinate1: {
        'ui:header-classname': 'h3-title'
      },
      Coordinate2: {
        'ui:header-classname': 'h3-title'
      }
    }
  },
  SpatialInformation: {
    'ui:field': 'layout',
    'ui:layout_grid': {
      'ui:row': [
        {
          'ui:group': 'Spatial Representation Information',
          'ui:group-description': true,
          'ui:group-classname': 'h2-title',
          'ui:group-box-classname': 'h2-box',
          'ui:col': {
            md: 12,
            children: [
              {
                'ui:row': [
                  {
                    'ui:col': {
                      className: 'field-left-border',
                      md: 12,
                      children: ['SpatialCoverageType']
                    }
                  }
                ]
              },
              {
                'ui:row': [
                  {
                    'ui:col': {
                      className: 'field-left-border',
                      md: 12,
                      children: ['VerticalCoordinateSystem']
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    VerticalCoordinateSystem: {
      'ui:field': 'layout',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:group': 'Vertical Coordinate System',
            'ui:group-classname': 'h3-title',
            'ui:group-box-classname': 'h2-box',
            'ui:col': {
              md: 12,
              children: [
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        className: 'field-left-border',
                        md: 12,
                        children: ['AltitudeSystemDefinition']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        className: 'field-left-border',
                        md: 12,
                        children: ['DepthSystemDefinition']
                      }
                    }
                  ]
                }
              ]
            }
          }
        ]
      },
      AltitudeSystemDefinition: {
        'ui:field': 'layout',
        'ui:layout_grid': {
          'ui:row': [
            {
              'ui:group': 'Altitude System Definition',
              'ui:group-classname': 'h3-title',
              'ui:group-box-classname': 'h2-box',
              'ui:col': {
                md: 12,
                children: [
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 12,
                          children: ['DatumName']
                        }
                      }
                    ]
                  },
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 12,
                          children: ['DistanceUnits']
                        }
                      }
                    ]
                  },
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 12,
                          children: ['Resolutions']
                        }
                      }
                    ]
                  }
                ]
              }
            }
          ]
        },
        Resolutions: {
          'ui:header-classname': 'h3-title'
        }
      },
      DepthSystemDefinition: {
        'ui:field': 'layout',
        'ui:layout_grid': {
          'ui:row': [
            {
              'ui:group': 'Depth System Definition',
              'ui:group-classname': 'h3-title',
              'ui:group-box-classname': 'h2-box',
              'ui:col': {
                md: 12,
                children: [
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 12,
                          children: ['DatumName']
                        }
                      }
                    ]
                  },
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 12,
                          children: ['DistanceUnits']
                        }
                      }
                    ]
                  },
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 12,
                          children: ['Resolutions']
                        }
                      }
                    ]
                  }
                ]
              }
            }
          ]
        },
        Resolutions: {
          'ui:header-classname': 'h3-title'
        }
      }
    }
  },
  LocationKeywords: {
    'ui:title': 'Location Keywords',
    'ui:field': 'keywordPicker'
  }
}

export default spatialInformationUiSchema
