import CustomSelectWidget from '../../../../components/widgets/CustomSelectWidget'
import CustomTextareaWidget from '../../../../components/widgets/CustomTextareaWidget'
import CustomTextWidget from '../../../../components/widgets/CustomTextWidget'

const fillValuesUiSchema = {
  FillValues: {
    'ui:title': 'Fill Values',
    items: {
      'ui:title': 'Fill Value',
      'ui:field': 'layout',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:col': {
              md: 12,
              children: [
                {
                  'ui:row': [
                    { 'ui:col': { md: 6, children: ['Value'] } },
                    { 'ui:col': { md: 6, children: ['Type'] } }
                  ]
                },
                {
                  'ui:row': [
                    { 'ui:col': { md: 12, children: ['Description'] } }
                  ]
                }

              ]
            }
          }
        ]
      },
      Value: {
        'ui:title': 'Value',
        'ui:widget': CustomTextWidget
      },
      Type: {
        'ui:title': 'Type',
        'ui:widget': CustomSelectWidget

      },
      Description: {
        'ui:widget': CustomTextareaWidget
      }
    }
  }
}
export default fillValuesUiSchema
