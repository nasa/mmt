/* eslint-disable react/react-in-jsx-scope */
import React from 'react'
import CustomSelectWidget from '../../../components/CustomSelectWidget/CustomSelectWidget'
import '../../../components/PreviewMapTemplate/PreviewMapTemplate.scss'
import PreviewMapTemplate from '../../../components/PreviewMapTemplate/PreviewMapTemplate'

const spatialInformationUiSchema = {
  'ui:submitButtonOptions': {
    norender: true
  },
  'ui:heading-level': 'h3',
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
    'ui:heading-level': 'h4',
    'ui:field': 'layout',
    'ui:layout_grid': {
      'ui:group': 'Spatial Extent',
      'ui:group-classname': 'h2-title',
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
      'ui:heading-level': 'h5',
      'ui:field': 'layout',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:group': 'Horizontal Spatial Domain',
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
        'ui:heading-level': 'h6',
        'ui:field': 'layout',
        'ui:layout_grid': {
          'ui:row': [
            {
              'ui:group': 'Geometry',
              'ui:col': {
                style: { 'margin-bottom': '15px' },
                md: 12,
                children: [
                  {
                    'ui:row': [
                      {
                        'ui:col': {
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
          'ui:heading-level': 'h6',
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
                      },
                      {
                        'ui:row': [
                          {
                            md: 12,
                            render: (props) => (
                              <div className="preview-map-link__icon-label">
                                <PreviewMapTemplate {...props} type="point" />
                              </div>
                            )
                          }]
                      }
                    ]
                  }
                }
              ]
            }
          }
        },
        BoundingRectangles: {
          'ui:heading-level': 'h6',
          items: {
            'ui:field': 'boundingRectangle'
          }
        },
        GPolygons: {
          'ui:heading-level': 'h6',
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
                      {
                        'ui:row': [
                          {
                            md: 12,
                            render: (props) => (
                              <div className="preview-map-link__icon-label pb-4 pl-3">
                                <PreviewMapTemplate {...props} type="polygon" />
                              </div>
                            )
                          }]
                      },
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
              'ui:heading-level': 'h6',
              'ui:field': 'layout',
              'ui:layout_grid': {
                'ui:row': [
                  {
                    'ui:group': 'Exclusive Zone',
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
                'ui:heading-level': 'h6',
                'ui:title': 'Boundary',
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
                    'ui:heading-level': 'h6',
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
              Points: {
                'ui:heading-level': 'h6',
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
          'ui:heading-level': 'h6',
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
              'ui:heading-level': 'h6',
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
        'ui:heading-level': 'h6',
        'ui:field': 'layout',
        'ui:layout_grid': {
          'ui:row': [
            {
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
          'ui:heading-level': 'h6'
        },
        HorizontalDataResolution: {
          'ui:heading-level': 'h6',
          'ui:field': 'layout',
          'ui:layout_grid': {
            'ui:row': [
              {
                'ui:group': 'Horizontal Data Resolution',
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
            'ui:heading-level': 'h6',
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
            'ui:heading-level': 'h6',
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
            'ui:heading-level': 'h6',
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
            'ui:heading-level': 'h6',
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
            'ui:heading-level': 'h6',
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
          'ui:heading-level': 'h6'
        }
      }
    },
    VerticalSpatialDomains: {
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
      'ui:heading-level': 'h5',
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
        'ui:heading-level': 'h6',
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
    'ui:heading-level': 'h5',
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
        'ui:heading-level': 'h6'
      },
      Coordinate2: {
        'ui:heading-level': 'h6'
      }
    }
  },
  SpatialInformation: {
    'ui:heading-level': 'h5',
    'ui:field': 'layout',
    'ui:layout_grid': {
      'ui:row': [
        {
          'ui:group': 'Spatial Representation Information',
          'ui:group-description': true,
          'ui:group-classname': 'h2-title',
          'ui:col': {
            md: 12,
            children: [
              {
                'ui:row': [
                  {
                    'ui:col': {
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
      'ui:heading-level': 'h6',
      'ui:field': 'layout',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:group': 'Vertical Coordinate System',
            'ui:col': {
              md: 12,
              children: [
                {
                  'ui:row': [
                    {
                      'ui:col': {
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
        'ui:heading-level': 'h6',
        'ui:field': 'layout',
        'ui:layout_grid': {
          'ui:row': [
            {
              'ui:group': 'Altitude System Definition',
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
        }
      },
      DepthSystemDefinition: {
        'ui:heading-level': 'h6',
        'ui:field': 'layout',
        'ui:layout_grid': {
          'ui:row': [
            {
              'ui:group': 'Depth System Definition',
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
          'ui:heading-level': 'h6'
        }
      }
    }
  },
  LocationKeywords: {
    'ui:title': 'Location Keywords',
    'ui:field': 'keywordPicker',
    'ui:keyword_scheme': 'location_keywords',
    'ui:picker_title': 'LOCATION KEYWORD',
    'ui:keyword_scheme_column_names': ['locationkeywords', 'category', 'type', 'sub_region_1', 'sub_region_2', 'sub_region_3', 'detailed_location'],
    'ui:scheme_values': ['Category', 'Type', 'Subregion 1', 'Subregion 2', 'Subregion 3', 'Detailed Location'
    ]
  }
}

export default spatialInformationUiSchema
