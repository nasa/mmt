const relatedIdentifiersUiSchema = {
  'ui:heading-level': 'h3',
  'ui:field': 'layout',
  'ui:layout_grid': {
    'ui:row': [
      {
        'ui:group': 'Related Identifiers',
        'ui:required': false,
        'ui:col': {
          md: 12,
          children: [
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['RelatedIdentifiers']
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  },
  RelatedIdentifiers: {
    items: {
      RelatedResolutionAuthority: {
        'ui:widget': 'TextWidget'
      }
    }
  }
}

export default relatedIdentifiersUiSchema
