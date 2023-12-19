const serviceConstraintsUiSchema = {
  'ui:submitButtonOptions': {
    norender: true
  },
  'ui:heading-level': 'h3',
  'ui:field': 'layout',
  'ui:layout_grid': {
    'ui:row': [
      {
        'ui:group': 'Service Constraints',
        'ui:col': {
          md: 12,
          children: [
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['AccessConstraints']
                  }
                },
                {
                  'ui:col': {
                    md: 12,
                    children: ['UseConstraints']
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  },
  UseConstraints: {
    'ui:heading-level': 'h4',
    LicenseText: {
      'ui:widget': 'textarea'
    }

  },
  AccessConstraints: {
    'ui:heading-level': 'h3',
    'ui:widget': 'textarea'
  }
}
export default serviceConstraintsUiSchema
