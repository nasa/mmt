import CustomSelectWidget from '@/js/components/CustomSelectWidget/CustomSelectWidget'

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
  },
  ServiceField: {
    'ui:options': {
      enumOptions: ['Service 1', 'Service 2'] // Overwritten by CollectionAssociationForm.jsx
    },
    'ui:required': true,
    'ui:title': 'Service',
    'ui:widget': CustomSelectWidget
  }
}

export default collectionAssociationUiSchema
