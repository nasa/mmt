import CustomSelectWidget from '../../../../components/widgets/CustomSelectWidget'

const variableInformationUiSchema = {
  'ui:field': 'layout',
  'ui:layout_grid': {
    'ui:row': [
      {
        'ui:group': 'Variable Information',
        'ui:required': true,
        'ui:col': {
          md: 12,
          children: [
            {
              'ui:row': [
                { 'ui:col': { md: 6, children: ['Name'] } },
                { 'ui:col': { md: 6, children: ['StandardName'] } }
              ]
            },
            {
              'ui:row': [
                { 'ui:col': { md: 12, children: ['LongName'] } }
              ]
            },
            {
              'ui:row': [
                { 'ui:col': { md: 12, children: ['Definition'] } }
              ]
            },
            {
              'ui:row': [
                { 'ui:col': { md: 12, children: ['AdditionalIdentifiers'] } }
              ]
            },
            {
              'ui:row': [
                { 'ui:col': { md: 6, children: ['VariableType'] } },
                { 'ui:col': { md: 6, children: ['VariableSubType'] } }
              ]
            },
            {
              'ui:row': [
                { 'ui:col': { md: 6, children: ['Units'] } },
                { 'ui:col': { md: 6, children: ['DataType'] } }
              ]
            },
            {
              'ui:row': [
                { 'ui:col': { md: 6, children: ['Scale'] } },
                { 'ui:col': { md: 6, children: ['Offset'] } }
              ]
            },
            {
              'ui:row': [
                { 'ui:col': { md: 12, children: ['ValidRanges'] } }
              ]
            },
            {
              'ui:row': [
                { 'ui:col': { md: 12, children: ['IndexRanges'] } }
              ]
            }
          ]
        }
      }
    ]
  },
  Scale: {
    'ui:type': 'number'
  },
  Offset: {
    'ui:type': 'number'
  },
  Definition: {
    'ui:widget': 'textarea'
  },
  AdditionalIdentifiers: {
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
                    { 'ui:col': { md: 12, children: ['Identifier'] } }
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
      Description: {
        'ui:widget': 'textarea'
      }
    }
  },
  VariableType: {
    'ui:widget': CustomSelectWidget
  },
  VariableSubType: {
    'ui:widget': CustomSelectWidget
  },
  DataType: {
    'ui:widget': CustomSelectWidget
  },
  ValidRanges: {
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
                    { 'ui:col': { md: 6, children: ['Min'] } },
                    { 'ui:col': { md: 6, children: ['Max'] } }
                  ]
                },
                {
                  'ui:row': [
                    { 'ui:col': { md: 12, children: ['CodeSystemIdentifierMeaning'] } }
                  ]
                },
                {
                  'ui:row': [
                    { 'ui:col': { md: 12, children: ['CodeSystemIdentifierValue'] } }
                  ]
                }
              ]
            }
          }
        ]
      }
    }
  },
  IndexRanges: {
    'ui:title': 'Index Ranges',
    'ui:field': 'layout',
    'ui:layout_grid': {
      'ui:group': 'Index Ranges',
      'ui:group-classname': 'h2-title',
      'ui:group-box-classname': 'h2-box',
      'ui:group-description': true,
      'ui:group-single-panel': true,
      'ui:row': [
        {
          'ui:col': {
            md: 12,
            children: [
              {
                'ui:row': [
                  { 'ui:col': { md: 12, children: ['LatRange'] } }
                ]
              },
              {
                'ui:row': [
                  { 'ui:col': { md: 12, children: ['LonRange'] } }
                ]
              }
            ]
          }
        }
      ]
    },
    LatRange: {
      'ui:canAdd': false,
      items: {
        'ui:type': 'number'
      }
    },
    LonRange: {
      'ui:canAdd': false,
      items: {
        'ui:type': 'number'
      }
    }
  }
}
export default variableInformationUiSchema
