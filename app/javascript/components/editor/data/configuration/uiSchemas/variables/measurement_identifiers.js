import CustomSelectWidget from '../../../../components/widgets/CustomSelectWidget'
import CustomTextWidget from '../../../../components/widgets/CustomTextWidget'

const measurementIdentifiersUiSchema = {
  MeasurementIdentifiers: {
    'ui:title': 'Measurement Identifiers',
    items: {
      'ui:field': 'layout',
      'ui:controlled': {
        name: 'measurement_name',
        map: { MeasurementContextMedium: 'context_medium', MeasurementObject: 'object' },
        clearAdditions: ['MeasurementQuantities.Value']
      },
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:col': {
              md: 12,
              children: [
                {
                  'ui:row': [
                    { 'ui:col': { md: 12, controlName: 'context_medium', children: ['MeasurementContextMedium'] } }
                  ]
                },
                {
                  'ui:row': [
                    { 'ui:col': { md: 12, children: ['MeasurementContextMediumURI'] } }
                  ]
                },
                {
                  'ui:row': [
                    { 'ui:col': { md: 12, controlName: 'object', children: ['MeasurementObject'] } }
                  ]
                },
                {
                  'ui:row': [
                    { 'ui:col': { md: 12, children: ['MeasurementObjectURI'] } }
                  ]
                },
                {
                  'ui:row': [
                    { 'ui:col': { md: 12, children: ['MeasurementQuantities'] } }
                  ]
                }

              ]
            }
          }
        ]
      },
      MeasurementContextMedium: {
        'ui:widget': CustomSelectWidget
      },
      MeasurementContextMediumURI: {
        'ui:widget': CustomTextWidget
      },
      MeasurementObject: {
        'ui:title': 'Measurement Object',
        'ui:widget': CustomSelectWidget
      },
      MeasurementObjectURI: {
        'ui:widget': CustomTextWidget
      },
      MeasurementQuantities: {
        'ui:className': 'small-bold-title',
        items: {
          'ui:title': 'Measurement Quantity',
          'ui:field': 'layout',
          'ui:controlled': {
            name: 'measurement_name',
            map: { MeasurementContextMedium: 'context_medium', MeasurementObject: 'object', Value: 'quantity' },
            includeParentFormData: true
          },
          'ui:layout_grid': {
            'ui:row': [
              {
                'ui:col': {
                  md: 12,
                  children: [
                    {
                      'ui:row': [
                        { 'ui:col': { md: 12, controlName: 'quantity', children: ['Value'] } }
                      ]
                    },
                    {
                      'ui:row': [
                        { 'ui:col': { md: 12, children: ['MeasurementQuantityURI'] } }
                      ]
                    }
                  ]
                }
              }
            ]
          },
          Value: {
            'ui:widget': CustomSelectWidget
          },
          MeasurementQuantityURI: {
            'ui:widget': CustomTextWidget
          }
        }
      }
    }
  }
}
export default measurementIdentifiersUiSchema
