import CustomSelectWidget from '../../../../components/widgets/CustomSelectWidget'
import CustomTextWidget from '../../../../components/widgets/CustomTextWidget'
import CustomMultiSelectWidget from '../../../../components/widgets/CustomMultiSelectWidget'
import CustomCountrySelectWidget from '../../../../components/widgets/CustomCountrySelectWidget'

const toolContactsUiSchema = {
  ContactGroups: {
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
                    { 'ui:col': { md: 12, children: ['GroupName'] } }
                  ]
                },
                {
                  'ui:row': [
                    { 'ui:col': { md: 12, children: ['Roles'] } }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        className: 'field-left-border field-bottom-border',
                        md: 12,
                        children: ['ContactInformation']
                      }
                    }
                  ]
                }
              ]
            }
          }
        ]
      },
      Roles: {
        'ui:group': 'ContactGroups',
        'ui:widget': CustomMultiSelectWidget
      },
      GroupName: {
        'ui:widget': CustomTextWidget
      },
      ContactInformation: {
        'ui:field': 'layout',
        'ui:layout_grid': {
          'ui:row': [
            {
              'ui:col': {
                md: 12,
                children: [
                  {
                    'ui:group': 'Contact Information',
                    'ui:group-description': true,
                    'ui:row': [
                      { 'ui:col': { md: 6, children: ['ServiceHours'] } },
                      { 'ui:col': { md: 6, children: ['ContactInstruction'] } }
                    ]
                  },
                  {
                    'ui:row': [
                      { 'ui:col': { md: 12, children: ['ContactMechanisms'] } }
                    ]
                  },
                  {
                    'ui:row': [
                      { 'ui:col': { md: 12, children: ['Addresses'] } }
                    ]
                  }
                ]
              }
            }
          ]
        },
        ContactMechanisms: {
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
                          { 'ui:col': { md: 6, children: ['Type'] } },
                          { 'ui:col': { md: 6, children: ['Value'] } }
                        ]
                      }
                    ]
                  }
                }
              ]
            },
            Type: {
              'ui:widget': CustomSelectWidget
            }
          }
        },
        Addresses: {
          'ui:title': 'Address',
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
                          { 'ui:col': { md: 6, children: ['Country'] } }

                        ]
                      },
                      {
                        'ui:group': 'Street Addresses',
                        'ui:row': [
                          { 'ui:col': { md: 12, children: ['StreetAddresses'] } }
                        ]
                      },
                      {
                        'ui:row': [
                          { 'ui:col': { md: 4, children: ['City'] } },
                          { 'ui:col': { md: 4, children: ['StateProvince'] } },
                          { 'ui:col': { md: 4, children: ['PostalCode'] } }
                        ]
                      }
                    ]
                  }
                }
              ]
            },
            StreetAddresses: {
              'ui:field': 'streetAddresses'
            },
            StateProvince: {
              'ui:title': 'State / Province'
            },
            Country: {
              'ui:widget': CustomCountrySelectWidget
            }
          }
        }
      }
    }
  },
  ContactPersons: {
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
                    { 'ui:col': { md: 12, children: ['Roles'] } }
                  ]
                },
                {
                  'ui:row': [
                    { 'ui:col': { md: 4, children: ['FirstName'] } },
                    { 'ui:col': { md: 4, children: ['MiddleName'] } },
                    { 'ui:col': { md: 4, children: ['LastName'] } }
                  ]
                },
                {
                  'ui:row': [
                    { 'ui:col': { md: 12, children: ['ContactInformation'] } }
                  ]
                }
              ]
            }
          }
        ]
      },
      Roles: {
        'ui:widget': CustomMultiSelectWidget
      },
      ContactInformation: {
        'ui:field': 'layout',
        'ui:layout_grid': {
          'ui:row': [
            {
              'ui:col': {
                md: 12,
                children: [
                  {
                    'ui:group': 'Contact Information',
                    'ui:row': [
                      { 'ui:col': { md: 6, children: ['ServiceHours'] } },
                      { 'ui:col': { md: 6, children: ['ContactInstruction'] } }
                    ]
                  },
                  {
                    'ui:row': [
                      { 'ui:col': { md: 12, children: ['ContactMechanisms'] } }
                    ]
                  },
                  {
                    'ui:row': [
                      { 'ui:col': { md: 12, children: ['Addresses'] } }
                    ]
                  }
                ]
              }
            }
          ]
        },
        ServiceHours: {
          'ui:group': 'ContactPersons'
        },
        ContactInstruction: {
          'ui:group': 'ContactPersons'
        },
        ContactMechanisms: {
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
                          { 'ui:col': { md: 6, children: ['Type'] } },
                          { 'ui:col': { md: 6, children: ['Value'] } }
                        ]
                      }
                    ]
                  }
                }
              ]
            },
            Type: {
              'ui:widget': CustomSelectWidget
            }
          }
        },
        Addresses: {
          'ui:title': 'Address',
          items: {
            'ui:field': 'layout',
            'ui:layout_grid': {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: [
                      {
                        'ui:group': 'Street Addresses',
                        'ui:row': [
                          { 'ui:col': { md: 12, children: ['StreetAddresses'] } }
                        ]
                      },
                      {
                        'ui:row': [
                          { 'ui:col': { md: 4, children: ['Country'] } }
                        ]
                      },
                      {
                        'ui:row': [
                          { 'ui:col': { md: 4, children: ['City'] } },
                          { 'ui:col': { md: 4, children: ['StateProvince'] } },
                          { 'ui:col': { md: 4, children: ['PostalCode'] } }
                        ]
                      }
                    ]
                  }
                }
              ]
            },
            StreetAddresses: {
              'ui:field': 'streetAddresses'
            },
            StateProvince: {
              'ui:title': 'State / Province'
            },
            Country: {
              'ui:widget': CustomCountrySelectWidget
            }
          }
        }
      }
    }
  }
}
export default toolContactsUiSchema
