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
              'ui:group': 'Supported Format',
              'ui:row': [
                { 'ui:col': { style: { borderLeft: 'solid 5px rgb(240,240,240', marginLeft: '15px' }, md: 10, children: ['SupportedInputFormats'] } },
                { 'ui:col': { style: { borderLeft: 'solid 5px rgb(240,240,240', marginLeft: '15px', marginBottom: '30px' }, md: 10, children: ['SupportedOutputFormats'] } }

              ]
            },
            {
              'ui:row': [
                { 'ui:col': { style: { marginBottom: '30px' }, md: 12, children: ['SupportedOperatingSystems'] } }
              ]
            },
            {
              'ui:row': [
                { 'ui:col': { style: { marginBottom: '30px' }, md: 12, children: ['SupportedBrowsers'] } }
              ]
            },
            {
              'ui:row': [
                { 'ui:col': { style: { marginBottom: '30px' }, md: 12, children: ['SupportedSoftwareLanguages'] } }
              ]
            },
            {
              'ui:row': [
                { 'ui:col': { style: { borderLeft: 'solid 5px rgb(240,240,240)', marginBottom: '30px' }, md: 12, children: ['Quality'] } }
              ]
            },
            {
              'ui:row': [
                {

                  'ui:col': {
                    style: { borderLeft: 'solid 5px rgb(240,240,240)' },
                    md: 12,
                    children: [
                      {
                        'ui:group': 'Constraints',
                        'ui:group-description': false,
                        'ui:row': [

                          { 'ui:col': { md: 12, children: ['AccessConstraints'] } },
                          {
                            'ui:col': { style: { borderLeft: 'solid 5px rgb(240,240,240)', marginLeft: '10px', fontSize: 'bold' }, md: 12, children: ['UseConstraints'] }
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
    'ui:title': 'Supported Operating System',
    items: {
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
