import CustomSelectWidget from '../../../../components/widgets/CustomSelectWidget'
import CustomTextWidget from '../../../../components/widgets/CustomTextWidget'

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
      'ui:widget': CustomSelectWidget,
      'ui:title': 'Type'
    },
    Target: {
      'ui:field': 'layout',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:group': 'Target',
            'ui:group-description': true,
            'ui:col': {
              style: { borderBottom: 'solid 5px rgb(240,240,240', paddingBottom: 10 },
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
      Type: {
        'ui:widget': CustomSelectWidget,
        'ui:title': 'Type'
      },
      Description: {
        'ui:widget': 'textarea'
      },
      UrlTemplate: {
        'ui:title': 'URL Template',
        'ui:widget': 'textarea'
      },
      ResponseContentType: {
        'ui:title': 'Response Content Type',
        'ui:classNames': 'smallBoldTitle',
        items: {
          'ui:title': 'Response Content Type',
          'ui:widget': CustomTextWidget
        }
      },
      HttpMethod: {
        'ui:title': 'HTTP Method',
        'ui:classNames': 'smallBoldTitle',
        items: {
          'ui:title': 'HTTP Method',
          'ui:widget': CustomSelectWidget
        }
      }

    },
    QueryInput: {
      'ui:title': 'Query Input',
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
