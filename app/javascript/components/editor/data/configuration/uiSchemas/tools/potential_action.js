import CustomSelectWidget from '../../../../components/widgets/CustomSelectWidget'
import CustomTextWidget from '../../../../components/widgets/CustomTextWidget'
import CustomRadioWidget from '../../../../components/widgets/CustomRadioWidget'

const potentialActionUiSchema = {
  PotentialAction: {
    'ui:field': 'layout',
    'ui:layout_grid': {
      'ui:row': [
        {
          'ui:col': {
            md: 12,
            children: [
              {
                'ui:group': 'Potential Action',
                'ui:group-description': true,
                'ui:row': [
                  { 'ui:col': { md: 12, children: ['Type'] } }
                ]
              },
              {
                'ui:row': [
                  { 'ui:col': { md: 12, children: ['Target'] } }
                ]
              },
              {
                'ui:row': [
                  { 'ui:col': { md: 12, children: ['QueryInput'] } }
                ]
              }
            ]
          }
        }
      ]
    },
    Type: {
      'ui:widget': CustomSelectWidget
    },
    Target: {
      'ui:field': 'layout',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:group': 'Target',
            'ui:group-description': true,
            'ui:col': {
              className: 'field-left-border',
              md: 12,
              children: [
                {
                  'ui:row': [
                    { 'ui:col': { md: 12, children: ['Type'] } }
                  ]
                },
                {
                  'ui:row': [
                    { 'ui:col': { md: 12, children: ['Description'] } }
                  ]
                },
                {
                  'ui:row': [
                    { 'ui:col': { md: 12, children: ['UrlTemplate'] } }
                  ]
                },
                {
                  'ui:row': [
                    { 'ui:col': { md: 12, children: ['ResponseContentType'] } }
                  ]
                },
                {
                  'ui:row': [
                    { 'ui:col': { md: 12, children: ['HttpMethod'] } }
                  ]
                }
              ]
            }
          }
        ]
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
          'ui:widget': CustomTextWidget
        }
      },
      HttpMethod: {
        'ui:title': 'HTTP Method',
        items: {
          'ui:title': 'HTTP Method',
          'ui:widget': CustomSelectWidget
        }
      }
    },
    QueryInput: {
      items: {
        'ui:field': 'layout',
        'ui:layout_grid': {
          'ui:row': [
            {
              'ui:col': {
                md: 12,
                children: [
                  {
                    'ui:row': [
                      { 'ui:col': { md: 12, children: ['ValueType'] } }
                    ]
                  },
                  {
                    'ui:row': [
                      { 'ui:col': { md: 12, children: ['Description'] } }
                    ]
                  },
                  {
                    'ui:row': [
                      { 'ui:col': { md: 12, children: ['ValueName'] } }
                    ]
                  },
                  {
                    'ui:row': [
                      { 'ui:col': { md: 12, children: ['ValueRequired'] } }
                    ]
                  }
                ]
              }
            }
          ]
        },
        ValueType: {
          'ui:widget': CustomTextWidget
        },
        ValueName: {
          'ui:widget': CustomTextWidget
        },
        ValueRequired: {
          'ui:widget': CustomRadioWidget
        }
      }
    }
  }
}
export default potentialActionUiSchema
