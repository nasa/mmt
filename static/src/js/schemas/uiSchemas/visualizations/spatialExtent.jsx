import React from 'react'

import CustomSelectWidget from '@/js/components/CustomSelectWidget/CustomSelectWidget'
import PreviewMapTemplate from '@/js/components/PreviewMapTemplate/PreviewMapTemplate'

const spatialExtentUiSchema = {
  'ui:heading-level': 'h3',
  'ui:field': 'layout',
  'ui:layout_grid': {
    'ui:row': [
      {
        'ui:group': 'Spatial Extent',
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
                      children: ['SpatialCoverageType']
                    }
                  }
                ]
              },
              {
                'ui:group-checkbox': 'Horizontal',
                'ui:row': [
                  {
                    'ui:col': {
                      className: 'grid-layout__field-left-border',
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
                      className: 'grid-layout__field-left-border',
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
        'ui:heading-level': 'h6',
        'ui:field': 'layout',
        'ui:fieldReplacesAnyOrOneOf': true,
        'ui:layout_grid': {
          'ui:row': [
            {
              'ui:group': 'Geometry',
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
                          children: ['CoordinateSystem']
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
                          },
                          {
                            'ui:col': {
                              md: 6,
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
                              <div className="preview-map-template__icon-label">
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
            'ui:field': 'BoundingRectangle'
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
        Description: {
          'ui:widget': 'textarea'
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
            'ui:fieldReplacesAnyOrOneOf': true,
            'ui:heading-level': 'h6',
            items: {
              'ui:fieldReplacesAnyOrOneOf': true,

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
                                children: ['XDimension']
                              }
                            },
                            {
                              'ui:col': {
                                md: 6,
                                children: ['YDimension']
                              }
                            }
                          ]
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
                          'ui:row': [
                            {
                              'ui:col': {
                                md: 6,
                                children: ['ViewingAngleType']
                              }
                            },
                            {
                              'ui:col': {
                                md: 6,
                                children: ['ScanDirection']
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
          NonGriddedRangeResolutions: {
            'ui:heading-level': 'h6',
            items: {
              'ui:field': 'layout',
              'ui:fieldReplacesAnyOrOneOf': true,
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
                                children: ['MinimumXDimension']
                              }
                            },
                            {
                              'ui:col': {
                                md: 6,
                                children: ['MaximumXDimension']
                              }
                            }
                          ]
                        },
                        {
                          'ui:row': [
                            {
                              'ui:col': {
                                md: 6,
                                children: ['MinimumYDimension']
                              }
                            },
                            {
                              'ui:col': {
                                md: 6,
                                children: ['MaximumYDimension']
                              }
                            }
                          ]
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
                              md: 6,
                              children: ['ViewingAngleType']
                            }
                          },
                          {
                            'ui:col': {
                              md: 6,
                              children: ['ScanDirection']
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
          GriddedResolutions: {
            'ui:heading-level': 'h6',
            items: {
              'ui:field': 'layout',
              'ui:fieldReplacesAnyOrOneOf': true,
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
                                children: ['XDimension']
                              }
                            },
                            {
                              'ui:col': {
                                md: 6,
                                children: ['YDimension']
                              }
                            }
                          ]
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
              'ui:fieldReplacesAnyOrOneOf': true,
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
                              md: 6,
                              children: ['MinimumXDimension']
                            }
                          },
                          {
                            'ui:col': {
                              md: 6,
                              children: ['MaximumXDimension']
                            }
                          }
                          ]
                        },
                        {
                          'ui:row': [{
                            'ui:col': {
                              md: 6,
                              children: ['MinimumYDimension']
                            }
                          },
                          {
                            'ui:col': {
                              md: 6,
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
              'ui:fieldReplacesAnyOrOneOf': true,
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
                                children: ['XDimension']
                              }
                            },
                            {
                              'ui:col': {
                                md: 12,
                                children: ['YDimension']
                              }
                            },
                            {
                              'ui:col': {
                                md: 12,
                                children: ['Unit']
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
        },
        LocalCoordinateSystem: {
          'ui:heading-level': 'h6',
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
                            children: ['GeoReferenceInformation']
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
          },
          GeoReferenceInformation: {
            'ui:widget': 'textarea'
          },
          Description: {
            'ui:widget': 'textarea'
          }
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
                      },
                      {
                        'ui:col': {
                          md: 6,
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
                        style: { paddingTop: '15px' },
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
                        style: { paddingTop: '15px' },
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
    },
    GranuleSpatialRepresentation: {
      'ui:heading-level': 'h5'
    }
  }
}

export default spatialExtentUiSchema
