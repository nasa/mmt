const SamplingIdentifiersUiSchema = {
  SamplingIdentifiers: {
    'ui:heading-level': 'h3',
    items: {
      'ui:field': 'layout',
      'ui:title': 'Sampling Identifier',
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
                        children: ['SamplingMethod']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['MeasurementConditions']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['ReportingConditions']
                      }
                    }
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
