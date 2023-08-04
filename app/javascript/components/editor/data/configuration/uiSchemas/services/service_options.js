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
    VariableAggregationSupportedMethods: {
      'ui:title': 'Variable Aggregation Supported Methods',
      items: {
        'ui:title': 'Variable Aggregation Supported Methods'
      }
    },
    SupportedInputProjections: {
      'ui:title': 'Supported Input Projections',
      items: {
        'ui:title': 'Supported Input Projection',
        'ui:header-classname': 'h3-title'
      }
    },
    SupportedOutputProjections: {
      'ui:title': 'Supported Output Projections',
      items: {
        'ui:title': 'Supported Output Projection',
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
      'ui:title': 'Subset',
      'ui:field': 'layout',
      'ui:layout_grid': {
        'ui:group': 'Subset',
        'ui:group-description': true,
        'ui:group-classname': 'h2-title',
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
        'ui:title': 'Spatial Subset',
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
        }
      }
    }
  }

}
export default serviceOptionsUiSchema
