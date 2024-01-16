import CustomMultiSelectWidget from '../../../components/CustomMultiSelectWidget/CustomMultiSelectWidget'
import CustomTextWidget from '../../../components/CustomTextWidget/CustomTextWidget'

const organizationUiSchema = {
  'ui:submitButtonOptions': {
    norender: true
  },
  Organizations: {
    'ui:title': 'Tool Organizations',
    'ui:heading-level': 'h3',
    items: {
      'ui:field': 'layout',
      'ui:controlled': {
        name: 'providers',
        map: {
          ShortName: 'short_name',
          LongName: 'long_name',
          URLValue: 'url'
        }
      },
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:col': {
              md: 12,
              children: [
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['Roles']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        controlName: 'short_name',
                        md: 12,
                        children: ['ShortName']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        controlName: 'long_name',
                        md: 12,
                        children: ['LongName']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        controlName: 'url',
                        md: 12,
                        children: ['URLValue']
                      }
                    }
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
      Roles: { 'ui:widget': CustomMultiSelectWidget },
      ShortName: { 'ui:title': 'Short Name' },
      LongName: { 'ui:widget': CustomTextWidget },
      URLValue: { 'ui:widget': CustomTextWidget }
    }
  }
}

export default organizationUiSchema
