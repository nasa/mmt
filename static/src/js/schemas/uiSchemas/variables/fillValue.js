import CustomSelectWidget from '../../../components/CustomSelectWidget/CustomSelectWidget'
import CustomTextareaWidget from '../../../components/CustomTextareaWidget/CustomTextareaWidget'
import CustomTextWidget from '../../../components/CustomTextWidget/CustomTextWidget'

const fillValuesUiSchema = {
  FillValues: {
    'ui:heading-level': 'h3',
    items: {
      'ui:field': 'layout',
      'ui:title': 'Fill Value',
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
                        children: ['Value']
                      }
                    },
                    {
                      'ui:col': {
                        md: 6,
                        children: ['Type']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['Description']
                      }
                    }
                  ]
                }

              ]
            }
          }
        ]
      },
      Value: {
        'ui:widget': CustomTextWidget
      },
      Type: {
        'ui:widget': CustomSelectWidget

      },
      Description: {
        'ui:widget': CustomTextareaWidget
      }
    }
  }
}
export default fillValuesUiSchema
