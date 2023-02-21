import CustomTextWidget from '../../../../components/widgets/CustomTextWidget'

const descriptiveKeywordsUiSchema = {
  ToolKeywords: {
    'ui:title': 'Tool Keyword',
    'ui:field': 'keywordPicker'
  },
  AncillaryKeywords: {
    'ui:title': 'Ancillary Keywords',
    items: {
      'ui:title': 'Ancillary Keyword',
      'ui:widget': CustomTextWidget
    }
  }
}
export default descriptiveKeywordsUiSchema
