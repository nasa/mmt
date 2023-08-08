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
                    { 'ui:col': { md: 12, children: ['Name'] } }
                  ]
                },
                {
                  'ui:group': 'Size',
                  'ui:group-classname': 'h3-title',
                  'ui:group-box-classname': 'h2-box',
                  'ui:row': [
                    { 'ui:col': { md: 6, children: ['Size'] } }
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
