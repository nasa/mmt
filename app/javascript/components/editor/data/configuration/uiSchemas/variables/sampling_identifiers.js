const SamplingIdentifiersUiSchema = {
  SamplingIdentifiers: {
    'ui:header-classname': 'h1-title',
    'ui:header-box-classname': 'h1-box',
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
                    { 'ui:col': { md: 12, children: ['SamplingMethod'] } }
                  ]
                },
                {
                  'ui:row': [
                    { 'ui:col': { md: 12, children: ['MeasurementConditions'] } }
                  ]
                },
                {
                  'ui:row': [
                    { 'ui:col': { md: 12, children: ['ReportingConditions'] } }
                  ]
                }
              ]
            }
          }
        ]
      },
      SamplingMethod: {
        'ui:widget': 'textarea'
      },
      MeasurementConditions: {
        'ui:widget': 'textarea'
      },
      ReportingConditions: {
        'ui:widget': 'textarea'
      }

    }

  }
}
export default SamplingIdentifiersUiSchema
