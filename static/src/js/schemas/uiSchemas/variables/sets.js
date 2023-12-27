const SetsUiSchema = {
  Sets: {
    'ui:heading-level': 'h3',
    items: {
      'ui:field': 'layout',
      'ui:title': 'Set',
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
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['Type']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 6,
                        children: ['Size']
                      }
                    },
                    {
                      'ui:col': {
                        md: 6,
                        children: ['Index']
                      }
                    }
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
export default SetsUiSchema
