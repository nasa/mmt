import CustomSelectWidget from '../../../components/CustomSelectWidget/CustomSelectWidget'

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
                {
                  'ui:col': {
                    md: 12,
                    children: ['Dimensions']
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  },
  Dimensions: {
    'ui:heading-level': 'h3',
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
                    {
                      'ui:col': {
                        md: 12,
                        children: ['Name']
                      }
                    }
                  ]
                },
                {
                  'ui:group': 'Size',
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 6,
                        children: ['Size']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['Type']
                      }
                    }
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
