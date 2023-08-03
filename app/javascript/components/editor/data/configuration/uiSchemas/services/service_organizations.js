import CustomMultiSelectWidget from '../../../../components/widgets/CustomMultiSelectWidget'
import CustomTextWidget from '../../../../components/widgets/CustomTextWidget'

const organizationUiSchema = {
  ServiceOrganizations: {
    'ui:title': 'Service Organizations',
    items: {
      'ui:field': 'layout',
      'ui:controlled': {
        name: 'providers',
        map: {
          ShortName: 'short_name',
          LongName: 'long_name'
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
                      'ui:col': { md: 12, children: ['Roles'] }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': { controlName: 'short_name', md: 12, children: ['ShortName'] }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': { controlName: 'long_name', md: 12, children: ['LongName'] }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': { md: 12, children: ['OnlineResource'] }
                    }
                  ]
                }
              ]
            }
          }
        ]
      },
      ShortName: { 'ui:title': 'Short Name' },
      LongName: { 'ui:title': 'Long Name', 'ui:widget': CustomTextWidget },
      Roles: { 'ui:title': 'Roles', 'ui:widget': CustomMultiSelectWidget },
      OnlineResource: {
        'ui:field': 'layout',
        'ui:layout_grid': {
          'ui:row': [
            {
              'ui:group': 'Online Resource',
              'ui:className': 'custom-title',
              style: { fontSize: '1px' },
              'ui:group-description': true,
              'ui:col': {
                md: 12,
                children: [
                  {
                    'ui:row': [
                      { 'ui:col': { md: 6, children: ['Name'] } },
                      { 'ui:col': { md: 6, children: ['Protocol'] } }

                    ]
                  },
                  {
                    'ui:row': [
                      { 'ui:col': { md: 12, children: ['Linkage'] } }
                    ]
                  },
                  {
                    'ui:row': [
                      { 'ui:col': { md: 12, children: ['Description'] } }
                    ]
                  },
                  {
                    'ui:row': [
                      { 'ui:col': { md: 12, children: ['ApplicationProfile'] } }
                    ]
                  },
                  {
                    'ui:row': [
                      { 'ui:col': { md: 12, children: ['Function'] } }
                    ]
                  }
                ]
              }
            }
          ]
        },
        ApplicationProfile: {
          'ui:title': 'Application Profile'
        },
        Description: {
          'ui:widget': 'textarea'
        }
      }
    }
  }
}
export default organizationUiSchema
