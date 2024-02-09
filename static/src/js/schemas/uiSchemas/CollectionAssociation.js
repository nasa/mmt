import CustomRadioWidget from '../../components/CustomRadioWidget/CustomRadioWidget'

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
                },
                {
                  'ui:col': {
                    md: 12,
                    children: ['ProviderFilter']
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  },
  ProviderFilter: {
    'ui:widget': CustomRadioWidget,
    'ui:options': {
      trueOption: 'Search only my collections',
      falseOption: 'Search all collections',
      showClear: false
    }
  }
}

export default collectionAssociationUiSchema
