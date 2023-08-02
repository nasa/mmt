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
    'ui:title': 'Use Constraints',
    LicenseURL: {
      'ui:title': 'License URL'
    },
    LicenseText: {
      'ui:title': 'License Text',
      'ui:widget': 'textarea'
    }

  },
  AccessConstraints: {
    'ui:title': 'Access Constraints',
    'ui:widget': 'textarea',
    'ui:title-className': 'mediumTitle'
  }
}
export default serviceConstraintsUiSchema
