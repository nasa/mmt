import CustomSelectWidget from '../../../components/CustomSelectWidget/CustomSelectWidget'
import LanguageArray from '../../../utils/languageArray'

const metadataInformationUiSchema = {
  'ui:field': 'layout',
  'ui:layout_grid': {
    'ui:row': [
      {
        'ui:group': 'Metadata Information',
        'ui:col': {
          md: 12,
          children: [
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['MetadataLanguage']
                  }
                }
              ]
            },
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['MetadataDates']
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  },

  MetadataLanguage: {
    'ui:widget': CustomSelectWidget,
    'ui:options': {
      enumOptions: LanguageArray
    }
  },
  MetadataDates: {
    items: {
      'ui:field': 'layout',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:col': {
              children: [
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 6,
                        children: ['Type']
                      }
                    },
                    {
                      'ui:col': {
                        md: 6,
                        children: ['Date']
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

export default metadataInformationUiSchema
