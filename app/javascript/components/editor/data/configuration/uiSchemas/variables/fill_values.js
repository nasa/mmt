import CustomSelectWidget from '../../../../components/widgets/CustomSelectWidget'
import CustomTextareaWidget from '../../../../components/widgets/CustomTextareaWidget'
import CustomTextWidget from '../../../../components/widgets/CustomTextWidget'

const fillValuesUiSchema = {
  FillValues: {
    'ui:header-classname': 'h1-title',
    'ui:header-box-classname': 'h1-box',
    items: {
      'ui:title': 'Fill Values',
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
