import React from 'react'
import ControlledFields from '../../../../components/ControlledFields'
import CustomMultiSelectWidget from '../../../../components/widgets/CustomMultiSelectWidget'
import CustomTextWidget from '../../../../components/widgets/CustomTextWidget'

const organizationUiSchema = {
  Organizations: {
    items: {
      'ui:field': 'layout',
      'ui:keyword_scheme': 'providers',
      'ui:keyword_scheme_column_names': ['short_name', 'long_name', 'url'],
      'ui:controlledFields': ['ShortName', 'LongName', 'URLValue'],
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:col': {
              md: 12,
              children: [
                {
                  'ui:row': [
                    {
                      'ui:col': { md: 12, children: ['Roles'] }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        children: [
                          {
                            name: 'providers',
                            render: (props) => (
                              <ControlledFields {...props} />
                            )
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
      Description: {
        'ui:widget': 'textarea'
      },
      ShortName: { 'ui:title': 'Short Name' },
      LongName: { 'ui:title': 'Long Name', 'ui:widget': CustomTextWidget },
      URLValue: { 'ui:title': 'URL value', 'ui:widget': CustomTextWidget },
      Roles: { 'ui:title': 'Roles', 'ui:widget': CustomMultiSelectWidget }
    }
  }
}
export default organizationUiSchema
