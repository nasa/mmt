import CustomSelectWidget from '../../../../components/widgets/CustomSelectWidget'

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
    'ui:widget': CustomSelectWidget
  },
  MetadataDates: {
    'ui:header-classname': 'field-label',
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
