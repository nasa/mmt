const specificationUiSchema = {
  'ui:heading-level': 'h3',
  'ui:field': 'layout',
  'ui:layout_grid': {
    'ui:row': [
      {
        'ui:group': 'Specification',
        'ui:required': true,
        'ui:col': {
          md: 12,
          children: [
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['Specification']
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  },
  Specification: {
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
                      children: ['ProductIdentification']
                    }
                  }
                ]
              },
              {
                'ui:row': [
                  {
                    'ui:col': {
                      md: 12,
                      children: ['ProductMetadata']
                    }
                  }
                ]
              },
              {
                'ui:row': [
                  {
                    'ui:col': {
                      md: 12,
                      children: ['SpecificationMap1']
                    }
                  }
                ]
              },
              {
                'ui:row': [
                  {
                    'ui:col': {
                      md: 12,
                      children: ['SpecificationMap2']
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    ProductIdentification: {
      'ui:heading-level': 'h5',
      'ui:field': 'layout',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:group': 'Product Identification',
            'ui:group-description': true,
            'ui:col': {
              md: 12,
              children: [
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 6,
                        children: ['InternalIdentifier']
                      }
                    },
                    {
                      'ui:col': {
                        md: 6,
                        children: ['StandardOrNRTExternalIdentifier']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 6,
                        children: ['BestAvailableExternalIdentifier']
                      }
                    },
                    {
                      'ui:col': {
                        md: 6,
                        children: ['GIBSTitle']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 6,
                        children: ['WorldviewTitle']
                      }
                    },
                    {
                      'ui:col': {
                        md: 6,
                        children: ['WorldviewSubtitle']
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
    ProductMetadata: {
      'ui:heading-level': 'h5',
      'ui:field': 'layout',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:group': 'Product Metadata',
            'ui:group-description': true,
            'ui:col': {
              md: 12,
              children: [
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['InternalIdentifier']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['SourceDatasets']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['RepresentingDatasets']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['ScienceParameters']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['ParameterUnits']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['Measurement']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 6,
                        children: ['DataResolution']
                      }
                    },
                    {
                      'ui:col': {
                        md: 6,
                        children: ['GranuleOrComposite']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 6,
                        children: ['DataDayBreak']
                      }
                    },
                    {
                      'ui:col': {
                        md: 6,
                        children: ['UpdateInterval']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['TemporalCoverage']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['VisualizationLatency']
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
                        children: ['WGS84SpatialCoverage']
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
                        children: ['NativeSpatialCoverage']
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
                        children: ['AscendingOrDescending']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        style: { paddingTop: '15px' },
                        md: 6,
                        children: ['ColorMap']
                      }
                    },
                    {
                      'ui:col': {
                        style: { paddingTop: '15px' },
                        md: 6,
                        children: ['VectorStyle']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        style: { paddingTop: '15px' },
                        md: 6,
                        children: ['VectorMetadata']
                      }
                    },
                    {
                      'ui:col': {
                        style: { paddingTop: '15px' },
                        md: 6,
                        children: ['LayerPeriod']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        style: { paddingTop: '15px' },
                        md: 6,
                        children: ['TransAntiMeridian']
                      }
                    },
                    {
                      'ui:col': {
                        style: { paddingTop: '15px' },
                        md: 6,
                        children: ['Daynight']
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
                        children: ['OrbitTracks']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['OrbitDirection']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['ResolutionAtNadir']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        style: { paddingTop: '15px' },
                        md: 6,
                        children: ['Ongoing']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 4,
                        children: ['RetentionPeriod']
                      }
                    },
                    {
                      'ui:col': {
                        md: 4,
                        children: ['Latency']
                      }
                    },
                    {
                      'ui:col': {
                        md: 4,
                        children: ['UpdateFrequency']
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
                        children: ['ows:Title']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['ows:Abstract']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['ows:Keywords']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['ows:WGS84BoundingBox']
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
                        children: ['ows:Identifier']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['ows:BoundingBox']
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
                        children: ['ows:Metadata']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['ows:DatasetDescriptionSummary']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['wmts:Style']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['wmts:Format']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['wmts:InfoFormat']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['wmts:Dimension']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['wmts:TileMatrixSetLink']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['wmts:ResourceURL']
                      }
                    }
                  ]
                }
              ]
            }
          }
        ]
      },
      Daynight: {
        'ui:widget': 'UniqueItemsArrayWidget'
      },
      WGS84SpatialCoverage: {
        'ui:title': 'World Geodetic System (WGS84) Spatial Coverage'
      },
      'ows:Title': {
        'ui:title': 'OGC Web Services (OWS) Title'
      },
      'ows:Abstract': {
        'ui:title': 'OGC Web Services (OWS) Abstract',
        'ui:widget': 'textarea'
      },
      'ows:Keywords': {
        'ui:title': 'OGC Web Services (OWS) Keywords'
      },
      'ows:WGS84BoundingBox': {
        'ui:title': 'OGC Web Services (OWS) WGS84 Bounding Box'
      },
      'ows:Identifier': {
        'ui:title': 'OGC Web Services (OWS) Identifier'
      },
      'ows:BoundingBox': {
        'ui:title': 'OGC Web Services (OWS) Bounding Box'
      },
      'ows:Metadata': {
        'ui:title': 'OGC Web Services (OWS) Metadata'
      },
      'ows:DatasetDescriptionSummary': {
        'ui:title': 'OGC Web Services (OWS) Dataset Description Summary'
      },
      'wmts:Style': {
        'ui:title': 'Web Map Tile Service (WMTS) Style'
      },
      'wmts:Format': {
        'ui:title': 'Web Map Tile Service (WMTS) Format'
      },
      'wmts:InfoFormat': {
        'ui:title': 'Web Map Tile Service (WMTS) Info Format'
      },
      'wmts:Dimension': {
        'ui:title': 'Web Map Tile Service (WMTS) Dimension'
      },
      'wmts:TileMatrixSetLink': {
        'ui:title': 'Web Map Tile Service (WMTS) Tile Matrix Set Link'
      },
      'wmts:ResourceURL': {
        'ui:title': 'Web Map Tile Service (WMTS) Resource URL'
      }
    }
  }
}

export default specificationUiSchema
