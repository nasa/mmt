import CustomRadioWidget from '../../components/CustomRadioWidget/CustomRadioWidget'

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
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 2,
                    children: ['deprecated']
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
  deprecated: {
    'ui:widget': CustomRadioWidget,
    'ui:options': {
      showClear: false
    }
  },
  form: {
    'ui:title': 'Form XML',
    'ui:widget': 'textarea'
  }
}

export default orderOptionUiSchema
