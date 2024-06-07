const collectionAssociationUiSchema = {
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
                    md: 12,
                    children: ['SearchField']
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  },
  SearchField: {
    'ui:required': true
  }
}

export default collectionAssociationUiSchema
