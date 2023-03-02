import CustomSelectWidget from '../../../../components/widgets/CustomSelectWidget'
import CustomTextWidget from '../../../../components/widgets/CustomTextWidget'

const potentialActionUiSchema = {
  PotentialAction: {
    Type: {
      'ui:widget': CustomSelectWidget,
      'ui:title': 'Type',
      classNames: 'shortWidget'
    },
    Target: {
      Type: {
        'ui:widget': CustomSelectWidget,
        classNames: 'shortWidget'
      },
      Description: {
        'ui:widget': 'textarea'
      },
      UrlTemplate: {
        'ui:title': 'URL Template',
        'ui:widget': 'textarea'
      },
      ResponseContentType: {
        items: {
          'ui:title': 'Response Content Type',
          'ui:widget': CustomTextWidget
        }
      },
      HttpMethod: {
        items: {
          'ui:title': 'HTTP Method',
          'ui:widget': CustomSelectWidget,
          classNames: 'shortWidget'
        }
      }
    },
    QueryInput: {
      'ui:title': 'Query Input',
      items: {
        ValueType: {
          'ui:title': 'Value Type',
          'ui:widget': CustomTextWidget
        },
        ValueName: {
          'ui:title': 'Value Name',
          'ui:widget': CustomTextWidget
        },
        ValueRequired: {
          'ui:title': 'Value Required',
          'ui:widget': 'radio'
        }
      }
    }
  }
}
export default potentialActionUiSchema
