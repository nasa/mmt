const serviceConstraintsUiSchema = {
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
                { 'ui:col': { md: 12, children: ['AccessConstraints'] } },
                { 'ui:col': { md: 12, children: ['UseConstraints'] } }
              ]
            }
          ]
        }
      }
    ]
  },
  UseConstraints: {
    LicenseText: {
      'ui:widget': 'textarea'
    }

  },
  AccessConstraints: {
    'ui:widget': 'textarea',
    'ui:header-classname': 'h2-title'
  }
}
export default serviceConstraintsUiSchema
