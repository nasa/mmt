import CustomMultiSelectWidget from '../../../../components/widgets/CustomMultiSelectWidget'
import CustomSelectWidget from '../../../../components/widgets/CustomSelectWidget'

const compatibilityAndUsabilityUiSchema = {
  'ui:field': 'layout',
  'ui:layout_grid': {
    'ui:row': [
      {
        'ui:col': {
          md: 12,
          children: [
            {
              'ui:group': 'Supported Formats',
              'ui:row': [
                { 'ui:col': { className: 'field-left-border', md: 10, children: ['SupportedInputFormats'] } },
                { 'ui:col': { className: 'field-left-border', md: 10, children: ['SupportedOutputFormats'] } }
              ]
            },
            {
              'ui:row': [
                { 'ui:col': { md: 12, children: ['SupportedOperatingSystems'] } }
              ]
            },
            {
              'ui:row': [
                { 'ui:col': { md: 12, children: ['SupportedBrowsers'] } }
              ]
            },
            {
              'ui:row': [
                { 'ui:col': { md: 12, children: ['SupportedSoftwareLanguages'] } }
              ]
            },
            {
              'ui:group': 'Quality',
              'ui:row': [
                { 'ui:col': { className: 'field-left-border', md: 12, children: ['Quality'] } }
              ]
            },
            {
              'ui:row': [
                {

                  'ui:col': {
                    className: 'field-left-border',
                    md: 12,
                    children: [
                      {
                        'ui:group': 'Constraints',
                        'ui:group-description': false,
                        'ui:row': [

                          { 'ui:col': { md: 12, children: ['AccessConstraints'] } },
                          {
                            'ui:col': { md: 12, children: ['UseConstraints'] }
                          }
                        ]
                      }
                    ]
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  },
  SupportedInputFormats: {
    'ui:widget': CustomMultiSelectWidget
  },
  SupportedOutputFormats: {
    'ui:widget': CustomMultiSelectWidget
  },
  SupportedOperatingSystems: {
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
                    { 'ui:col': { md: 12, children: ['OperatingSystemName'] } }
                  ]
                },
                {
                  'ui:row': [
                    { 'ui:col': { md: 12, children: ['OperatingSystemVersion'] } }
                  ]
                }
              ]
            }
          }
        ]
      }
    }
  },
  SupportedBrowsers: {
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
                    { 'ui:col': { md: 12, children: ['BrowserName'] } }
                  ]
                },
                {
                  'ui:row': [
                    { 'ui:col': { md: 12, children: ['BrowserVersion'] } }
                  ]
                }
              ]
            }
          }
        ]
      }
    }
  },
  SupportedSoftwareLanguages: {
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
                    { 'ui:col': { md: 12, children: ['SoftwareLanguageName'] } }
                  ]
                },
                {
                  'ui:row': [
                    { 'ui:col': { md: 12, children: ['SoftwareLanguageVersion'] } }
                  ]
                }
              ]
            }
          }
        ]
      }
    }
  },
  Quality: {
    QualityFlag: {
      'ui:widget': CustomSelectWidget
    },
    Lineage: {
      'ui:widget': 'textarea'
    }
  },
  UseConstraints: {
    LicenseText: {
      'ui:widget': 'textarea'
    }
  },
  AccessConstraints: {
    'ui:widget': 'textarea'
  }
}
export default compatibilityAndUsabilityUiSchema
