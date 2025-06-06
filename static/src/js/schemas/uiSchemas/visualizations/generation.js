const generationUiSchema = {
  'ui:heading-level': 'h3',
  'ui:field': 'layout',
  'ui:layout_grid': {
    'ui:row': [
      {
        'ui:group': 'Generation',
        'ui:required': true,
        'ui:col': {
          md: 12,
          children: [
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['Generation']
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  },
  Generation: {
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
                      md: 6,
                      children: ['SourceProjection']
                    }
                  },
                  {
                    'ui:col': {
                      style: { paddingTop: '15px' },
                      md: 6,
                      children: ['SourceResolution']
                    }
                  }
                ]
              },
              {
                'ui:row': [
                  {
                    'ui:col': {
                      md: 6,
                      children: ['SourceFormat']
                    }
                  },
                  {
                    'ui:col': {
                      md: 6,
                      children: ['SourceColorModel']
                    }
                  }
                ]
              },
              {
                'ui:row': [
                  {
                    'ui:col': {
                      md: 6,
                      children: ['SourceNoDataIndexOrRGB']
                    }
                  },
                  {
                    'ui:col': {
                      md: 6,
                      children: ['SourceCoverage']
                    }
                  }
                ]
              },
              {
                'ui:row': [
                  {
                    'ui:col': {
                      md: 6,
                      children: ['OutputProjection']
                    }
                  },
                  {
                    'ui:col': {
                      md: 6,
                      children: ['OutputResolution']
                    }
                  }
                ]
              },
              {
                'ui:row': [
                  {
                    'ui:col': {
                      md: 12,
                      children: ['OutputFormat']
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
                      children: ['SourceData']
                    }
                  }
                ]
              },
              {
                'ui:row': [
                  {
                    'ui:col': {
                      md: 12,
                      children: ['Reprojection']
                    }
                  }
                ]
              },
              {
                'ui:row': [
                  {
                    'ui:col': {
                      md: 12,
                      children: ['Regridding']
                    }
                  }
                ]
              },
              {
                'ui:row': [
                  {
                    'ui:col': {
                      md: 12,
                      children: ['Sampling']
                    }
                  }
                ]
              },
              {
                'ui:row': [
                  {
                    'ui:col': {
                      md: 12,
                      children: ['Resolution']
                    }
                  }
                ]
              },
              {
                'ui:row': [
                  {
                    'ui:col': {
                      md: 12,
                      children: ['QualityFlag']
                    }
                  }
                ]
              },
              {
                'ui:row': [
                  {
                    'ui:col': {
                      md: 12,
                      children: ['Range']
                    }
                  }
                ]
              },
              {
                'ui:row': [
                  {
                    'ui:col': {
                      md: 12,
                      children: ['Scale']
                    }
                  }
                ]
              },
              {
                'ui:row': [
                  {
                    'ui:col': {
                      md: 12,
                      children: ['PixelStyle']
                    }
                  }
                ]
              },
              {
                'ui:row': [
                  {
                    'ui:col': {
                      md: 6,
                      children: ['GenerationMap1']
                    }
                  },
                  {
                    'ui:col': {
                      md: 6,
                      children: ['GenerationMap2']
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    SourceData: {
      'ui:heading-level': 'h5'
    },
    Reprojection: {
      'ui:heading-level': 'h5',
      'ui:field': 'layout',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:group': 'Reprojection',
            'ui:group-description': true,
            'ui:col': {
              md: 12,
              children: [
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 6,
                        children: ['Source']
                      }
                    },
                    {
                      'ui:col': {
                        md: 6,
                        children: ['Output']
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
    Regridding: {
      'ui:heading-level': 'h5',
      'ui:field': 'layout',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:group': 'Regridding',
            'ui:group-description': true,
            'ui:col': {
              md: 12,
              children: [
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 6,
                        children: ['Source']
                      }
                    },
                    {
                      'ui:col': {
                        md: 6,
                        children: ['Output']
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
    Sampling: {
      'ui:heading-level': 'h5',
      'ui:field': 'layout',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:group': 'Sampling',
            'ui:group-description': true,
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
                        children: ['Method']
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
    Resolution: {
      'ui:heading-level': 'h5',
      'ui:field': 'layout',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:group': 'Resolution',
            'ui:group-description': true,
            'ui:col': {
              md: 12,
              children: [
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 6,
                        children: ['Source']
                      }
                    },
                    {
                      'ui:col': {
                        md: 6,
                        children: ['Output']
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
    Range: {
      'ui:heading-level': 'h5',
      'ui:field': 'layout',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:group': 'Range',
            'ui:group-description': true,
            'ui:col': {
              md: 12,
              children: [
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 6,
                        children: ['Min']
                      }
                    },
                    {
                      'ui:col': {
                        md: 6,
                        children: ['Max']
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
    Scale: {
      'ui:heading-level': 'h5',
      'ui:field': 'layout',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:group': 'Scale',
            'ui:group-description': true,
            'ui:col': {
              md: 12,
              children: [
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['Method']
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
    PixelStyle: {
      'ui:heading-level': 'h5',
      'ui:field': 'layout',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:group': 'Pixel Style',
            'ui:group-description': true,
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
                }
              ]
            }
          }
        ]
      }
    }
  }
}

export default generationUiSchema
