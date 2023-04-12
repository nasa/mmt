import CustomSelectWidget from '../../../../components/widgets/CustomSelectWidget'

const dimensionsUiSchema = {
  'ui:field': 'layout',
  'ui:layout_grid': {
    'ui:row': [
      {
        'ui:col': {
          md: 12,
          children: [
            {
              'ui:row': [
                { 'ui:col': { md: 12, children: ['Dimensions'] } }
              ]
            }
          ]
        }
      }
    ]
  },
  Dimensions: {
    'ui:title': 'Dimensions',
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
                    { 'ui:col': { md: 12, children: ['Name'] } }
                  ]
                },
                {
                  'ui:group': 'Size',
                  'ui:group-className': 'field-title',
                  'ui:row': [
                    { 'ui:col': { md: 6, className: 'field-left-border-padded field-bottom-padded', children: ['Size'] } }
                  ]
                },
                {
                  'ui:row': [
                    { 'ui:col': { md: 12, children: ['Type'] } }
                  ]
                }
              ]
            }
          }
        ]
      },
      Type: {
        'ui:widget': CustomSelectWidget
      }
    }
  }
}
export default dimensionsUiSchema
