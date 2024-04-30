const orderOptionUiSchema = {
  'ui:submitButtonOptions': {
    norender: true
  },
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
                    md: 6,
                    children: ['name']
                  }
                },
                {
                  'ui:col': {
                    md: 6,
                    children: ['sortKey']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['description']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['form']
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  },
  description: {
    'ui:widget': 'textarea'
  },
  form: {
    'ui:title': 'Form XML',
    'ui:widget': 'textarea'
  }
}

export default orderOptionUiSchema
