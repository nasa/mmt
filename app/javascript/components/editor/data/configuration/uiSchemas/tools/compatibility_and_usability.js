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
                        'ui:group': 'UseConstraints',
                        'ui:group-description': false,
                        'ui:row': [

                          { 'ui:col': { md: 12, children: ['AccessConstraints'] } },
                          {
                            'ui:col': { className: 'field-left-border-padded', md: 12, children: ['UseConstraints'] }
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
    'ui:title': 'Supported Input Formats',
    'ui:widget': CustomMultiSelectWidget
  },
  SupportedOutputFormats: {
    'ui:title': 'Supported Output Formats',
    'ui:widget': CustomMultiSelectWidget
  },
  SupportedOperatingSystems: {
    'ui:title': 'Supported Operating Systems',
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
      },
      OperatingSystemName: {
        'ui:title': 'Operating System Name'
      },
      OperatingSystemVersion: {
        'ui:title': 'Operating System Version'
      }
    }
  },
  SupportedBrowsers: {
    'ui:title': 'Supported Browsers',
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
      },
      BrowserName: {
        'ui:title': 'Browser Name'
      },
      BrowserVersion: {
        'ui:title': 'Browser Version'
      }
    }
  },
  SupportedSoftwareLanguages: {
    'ui:title': 'Supported Software Languages',
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
      },
      SoftwareLanguageName: {
        'ui:title': 'Software Language Name'
      },
      SoftwareLanguageVersion: {
        'ui:title': 'Software Language Version'
      }
    }
  },
  Quality: {
    QualityFlag: {
      'ui:title': 'Quality Flag',
      'ui:widget': CustomSelectWidget
    },
    Lineage: {
      'ui:widget': 'textarea'
    }
  },
  UseConstraints: {
    'ui:title': 'Use Constraints',
    LicenseURL: {
      'ui:title': 'License URL'
    },
    LicenseText: {
      'ui:title': 'License Text',
      'ui:widget': 'textarea'
    }

  },
  AccessConstraints: {
    'ui:title': 'Access Constraints',
    'ui:classNames': 'mediumTitle',
    'ui:widget': 'textarea'
  }

}
export default compatibilityAndUsabilityUiSchema
