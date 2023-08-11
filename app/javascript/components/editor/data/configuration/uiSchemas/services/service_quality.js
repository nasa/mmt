const serviceQualityUiSchema = {
  'ui:field': 'layout',
  'ui:layout_grid': {
    'ui:row': [
      {
        'ui:col': {
          md: 12,
          children: [
            {
              'ui:row': [
                { 'ui:col': { md: 12, children: ['ServiceQuality'] } }
              ]
            }
          ]
        }
      }
    ]
  },
  ServiceQuality: {
    'ui:field': 'layout',
    'ui:layout_grid': {
      'ui:row': [
        {
          'ui:group': 'Service Quality',
          'ui:col': {
            children: [
              {
                'ui:row': [
                  { 'ui:col': { md: 12, children: ['QualityFlag'] } }
                ]
              },
              {
                'ui:row': [
                  { 'ui:col': { md: 12, children: ['Traceability'] } }
                ]
              },
              {
                'ui:row': [
                  { 'ui:col': { md: 12, children: ['Lineage'] } }
                ]
              }
            ]
          }
        }
      ]
    }
  }
}

export default serviceQualityUiSchema
