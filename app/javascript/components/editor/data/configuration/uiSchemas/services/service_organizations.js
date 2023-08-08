import CustomMultiSelectWidget from '../../../../components/widgets/CustomMultiSelectWidget'
import CustomTextWidget from '../../../../components/widgets/CustomTextWidget'

const organizationUiSchema = {
  ServiceOrganizations: {
    'ui:header-classname': 'h1-title',
    'ui:header-box-classname': 'h1-box',
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
      Roles: { 'ui:widget': CustomMultiSelectWidget },
      ShortName: { 'ui:title': 'Short Name' },
      LongName: { 'ui:widget': CustomTextWidget },
      OnlineResource: {
        'ui:field': 'layout',
        'ui:layout_grid': {
          'ui:row': [
            {
              'ui:group': 'Online Resource',
              'ui:group-description': true,
              'ui:group-classname': 'h3-title',
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
        Description: {
          'ui:widget': 'textarea'
        }
      }
    }
  }
}
export default organizationUiSchema
