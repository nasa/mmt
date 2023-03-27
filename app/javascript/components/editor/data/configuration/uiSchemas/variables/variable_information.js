import CustomSelectWidget from '../../../../components/widgets/CustomSelectWidget'

const variableInformationUiSchema = {
  'ui:field': 'layout',
  'ui:layout_grid': {
    'ui:row': [
      {
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
  StandardName: {
    'ui:title': 'Standard Name'
  },
  LongName: {
    'ui:title': 'Long Name'
  },
  Definition: {
    'ui:widget': 'textarea'
  },
  AdditionalIdentifiers: {
    'ui:title': 'Additional Identifiers',
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
    'ui:title': 'Variable Type',
    'ui:widget': CustomSelectWidget
  },
  VariableSubType: {
    'ui:title': 'Variable Sub Type',
    'ui:widget': CustomSelectWidget
  },
  DataType: {
    'ui:title': 'Data Type',
    'ui:widget': CustomSelectWidget
  },
  ValidRanges: {
    'ui:title': 'Valid Ranges',
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
      },
      CodeSystemIdentifierMeaning: {
        'ui:title': 'Code System Identifier Meaning',
        items: {
          'ui:title': 'Code System Identifier Meaning'
        }
      },
      CodeSystemIdentifierValue: {
        'ui:title': 'Code System Identifier Value',
        items: {
          'ui:title': 'Code System Identifier Value'
        }
      }
    }
  },
  IndexRanges: {
    'ui:title': 'Index Ranges',
    'ui:field': 'layout',
    'ui:layout_grid': {
      'ui:group': 'Index Ranges',
      'ui:group-description': true,
      'ui:row': [
        {
          'ui:col': {
            md: 12,
            className: 'field-left-border',
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
      'ui:title': 'Lat Range',
      items: {
        'ui:type': 'number',
        'ui:title': 'Lat Range'
      }
    },
    LonRange: {
      'ui:title': 'Lon Range',
      items: {
        'ui:type': 'number',
        'ui:title': 'Lon Range'
      }
    }
  }
}
export default variableInformationUiSchema
