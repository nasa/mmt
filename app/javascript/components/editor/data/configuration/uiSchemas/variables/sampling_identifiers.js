const SamplingIdentifiersUiSchema = {
  SamplingIdentifiers: {
    'ui:title': 'Sampling Identifiters',
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
        'ui:title': 'Sampling Method',
        'ui:widget': 'textarea'
      },
      MeasurementConditions: {
        'ui:title': 'Measurement Conditions',
        'ui:widget': 'textarea'
      },
      ReportingConditions: {
        'ui:title': 'Reporting Conditions',
        'ui:widget': 'textarea'
      }

    }

  }
}
export default SamplingIdentifiersUiSchema
