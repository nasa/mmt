const serviceOptionsUiSchema = {
  ServiceOptions: {
    'ui:field': 'layout',
    'ui:layout_grid': {
      'ui:row': [
        {
          'ui:col': {
            md: 12,
            children: [
              {
                'ui:group': 'Service Options',
                'ui:group-description': true,
                'ui:row': [
                  { 'ui:col': { md: 12, children: ['Subset'] } },
                  { 'ui:col': { md: 12, children: ['VariableAggregationSupportedMethods'] } },
                  { 'ui:col': { md: 12, children: ['SupportedInputProjections'] } },
                  { 'ui:col': { md: 12, children: ['SupportedOutputProjections'] } },
                  { 'ui:col': { md: 12, children: ['InterpolationTypes'] } },
                  { 'ui:col': { md: 12, children: ['SupportedReformattings'] } }
                ]
              }
            ]
          }
        }
      ]
    },
    SupportedInputProjections: {
      items: {
        'ui:header-classname': 'h3-title'
      }
    },
    SupportedOutputProjections: {
      items: {
        'ui:header-classname': 'h3-title'
      }
    },
    SupportedReformattings: {
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
                      { 'ui:col': { md: 12, children: ['SupportedInputFormat'] } },
                      { 'ui:col': { md: 12, children: ['SupportedOutputFormats'] } }
                    ]
                  }
                ]
              }
            }
          ]
        },
        SupportedOutputFormats: {
          'ui:header-classname': 'h3-title'
        }
      }
    },
    Subset: {
      'ui:field': 'layout',
      'ui:layout_grid': {
        'ui:group': 'Subset',
        'ui:group-description': true,
        'ui:group-classname': 'h2-title',
        'ui:group-box-classname': 'h2-box',
        'ui:row': [
          {
            'ui:col': {
              md: 12,
              children: [
                {
                  'ui:group-checkbox': 'Spatial',
                  'ui:row': [
                    { 'ui:col': { md: 12, children: ['SpatialSubset'] } }
                  ]
                },
                {
                  'ui:group-checkbox': 'Temporal',
                  'ui:row': [
                    { 'ui:col': { md: 12, children: ['TemporalSubset'] } }
                  ]
                },
                {
                  'ui:group-checkbox': 'Variable',
                  'ui:row': [
                    { 'ui:col': { md: 12, children: ['VariableSubset'] } }
                  ]
                }

              ]
            }
          }
        ]
      },
      SpatialSubset: {
        'ui:field': 'layout',
        'ui:layout_grid': {
          'ui:row': [
            {
              'ui:col': {
                md: 12,
                children: [
                  {
                    'ui:group-checkbox': 'Point',
                    'ui:row': [
                      { 'ui:col': { md: 12, children: ['Point'] } }
                    ]
                  },
                  {
                    'ui:group-checkbox': 'Circle',
                    'ui:row': [
                      { 'ui:col': { md: 12, children: ['Circle'] } }
                    ]
                  },
                  {
                    'ui:group-checkbox': 'Line',
                    'ui:row': [
                      { 'ui:col': { md: 12, children: ['Line'] } }
                    ]
                  },
                  {
                    'ui:group-checkbox': 'Bounding Box',
                    'ui:row': [
                      { 'ui:col': { md: 12, children: ['BoundingBox'] } }
                    ]
                  },
                  {
                    'ui:group-checkbox': 'Polygon',
                    'ui:row': [
                      { 'ui:col': { md: 12, children: ['Polygon'] } }
                    ]
                  },
                  {
                    'ui:group-checkbox': 'Shapefile',
                    'ui:row': [
                      { 'ui:col': { md: 12, children: ['Shapefile'] } }
                    ]
                  }
                ]
              }
            }
          ]
        },
        Point: {
          'ui:hide-header': true
        },
        Circle: {
          'ui:hide-header': true
        },
        Line: {
          'ui:hide-header': true
        },
        BoundingBox: {
          'ui:hide-header': true
        },
        Polygon: {
          'ui:hide-header': true
        },
        Shapefile: {
          'ui:hide-header': true,
          items: {
            'ui:header-classname': 'h3-title'
          }
        }
      },
      TemporalSubset: {
        'ui:hide-header': true
      },
      VariableSubset: {
        'ui:hide-header': true
      }
    }
  }

}
export default serviceOptionsUiSchema
