import CustomCountrySelectWidget from '../../../components/CustomCountrySelectWidget/CustomCountrySelectWidget'
import CustomMultiSelectWidget from '../../../components/CustomMultiSelectWidget/CustomMultiSelectWidget'
import CustomSelectWidget from '../../../components/CustomSelectWidget/CustomSelectWidget'
import CustomTextWidget from '../../../components/CustomTextWidget/CustomTextWidget'

const serviceContactsUiSchema = {
  'ui:heading-level': 'h3',
  'ui:submitButtonOptions': {
    norender: true
  },
  'ui:field': 'layout',
  'ui:layout_grid': {
    'ui:row': [
      {
        'ui:group': 'Service Contacts',
        'ui:col': {
          md: 12,
          children: [
            {
              'ui:row': [
                {
                  'ui:col': {
                    md: 12,
                    children: ['ContactGroups']
                  }
                },
                {
                  'ui:col': {
                    md: 12,
                    children: ['ContactPersons']
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  },
  ContactGroups: {
    'ui:heading-level': 'h4',
    'ui:title': 'Contact Groups',
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
                    {
                      'ui:col': {
                        md: 12,
                        children: ['GroupName']
                      }
                    },
                    {
                      'ui:col': {
                        md: 12,
                        children: ['Roles']
                      }
                    },
                    {
                      'ui:col': {
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
      GroupName: {
        'ui:title': 'Group Name',
        'ui:widget': CustomTextWidget
      },
      Roles: {
        'ui:widget': CustomMultiSelectWidget
      },
      ContactInformation: {
        'ui:heading-level': 'h4',
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
                    // 'ui:group-classname': 'h3-title',
                    // 'ui:group-box-classname': 'h2-box',
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 6,
                          children: ['ServiceHours']
                        }
                      },
                      {
                        'ui:col': {
                          md: 6,
                          children: ['ContactInstruction']
                        }
                      }
                    ]
                  },
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 12,
                          children: ['ContactMechanisms']
                        }
                      }
                    ]
                  },
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 12,
                          children: ['Addresses']
                        }
                      }
                    ]
                  },
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 12,
                          children: ['OnlineResources']
                        }
                      }
                    ]
                  }
                ]
              }
            }
          ]
        },
        ServiceHours: {
          'ui:title': 'Service Hours'
        },
        ContactInstruction: {
          'ui:title': 'Contact Instruction'
        },
        ContactMechanisms: {
          'ui:title': 'Contact Mechanism',
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
                          {
                            'ui:col': {
                              md: 6,
                              children: ['Type']
                            }
                          },
                          {
                            'ui:col': {
                              md: 6,
                              children: ['Value']
                            }
                          }
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
          'ui:title': 'Contact Address',
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
                          {
                            'ui:col': {
                              md: 6,
                              children: ['Country']
                            }
                          }

                        ]
                      },
                      {
                        'ui:group': 'Street Addresses',
                        'ui:group-classname': 'h3-title',
                        'ui:group-box-classname': 'h2-box',
                        'ui:row': [
                          {
                            'ui:col': {
                              md: 12,
                              children: ['StreetAddresses']
                            }
                          }
                        ]
                      },
                      {
                        'ui:row': [
                          {
                            'ui:col': {
                              md: 4,
                              children: ['City']
                            }
                          },
                          {
                            'ui:col': {
                              md: 4,
                              children: ['StateProvince']
                            }
                          },
                          {
                            'ui:col': {
                              md: 4,
                              children: ['PostalCode']
                            }
                          }
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
            PostalCode: {
              'ui:title': 'Postal Code'
            },
            Country: {
              'ui:widget': CustomCountrySelectWidget
            }
          }
        },
        OnlineResources: {
          'ui:title': 'Online Resources',
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
                          {
                            'ui:col': {
                              md: 6,
                              children: ['Name']
                            }
                          },
                          {
                            'ui:col': {
                              md: 6,
                              children: ['Protocol']
                            }
                          }

                        ]
                      },
                      {
                        'ui:row': [
                          {
                            'ui:col': {
                              md: 12,
                              children: ['Linkage']
                            }
                          }
                        ]
                      },
                      {
                        'ui:row': [
                          {
                            'ui:col': {
                              md: 12,
                              children: ['Description']
                            }
                          }
                        ]
                      },
                      {
                        'ui:row': [
                          {
                            'ui:col': {
                              md: 12,
                              children: ['ApplicationProfile']
                            }
                          }
                        ]
                      },
                      {
                        'ui:row': [
                          {
                            'ui:col': {
                              md: 12,
                              children: ['Function']
                            }
                          }
                        ]
                      }
                    ]
                  }
                }
              ]
            },
            OnlineResources: {
              'ui:field': 'Online Resources'
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
  },
  ContactPersons: {
    'ui:heading-level': 'h4',
    'ui:title': 'Contact Persons',
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
                        md: 4,
                        children: ['FirstName']
                      }
                    },
                    {
                      'ui:col': {
                        md: 4,
                        children: ['MiddleName']
                      }
                    },
                    {
                      'ui:col': {
                        md: 4,
                        children: ['LastName']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
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
        'ui:widget': CustomMultiSelectWidget
      },
      FirstName: {
        'ui:title': 'First Name'
      },
      MiddleName: {
        'ui:title': 'Middle Name'
      },
      LastName: {
        'ui:title': 'Last Name'
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
                    'ui:group-classname': 'h3-title',
                    'ui:group-box-classname': 'h2-box',
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 6,
                          children: ['ServiceHours']
                        }
                      },
                      {
                        'ui:col': {
                          md: 6,
                          children: ['ContactInstruction']
                        }
                      }
                    ]
                  },
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 12,
                          children: ['ContactMechanisms']
                        }
                      }
                    ]
                  },
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 12,
                          children: ['Addresses']
                        }
                      }
                    ]
                  },
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 12,
                          children: ['OnlineResources']
                        }
                      }
                    ]
                  }
                ]
              }
            }
          ]
        },
        ServiceHours: {
          'ui:group': 'ContactPersons',
          'ui:title': 'Service Hours'
        },
        ContactInstruction: {
          'ui:group': 'ContactPersons',
          'ui:title': 'Contact Instruction'
        },
        ContactMechanisms: {
          'ui:title': 'Contact Mechanism',
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
                          {
                            'ui:col': {
                              md: 6,
                              children: ['Type']
                            }
                          },
                          {
                            'ui:col': {
                              md: 6,
                              children: ['Value']
                            }
                          }
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
          'ui:title': 'Contact Address',
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
                        'ui:group-classname': 'h3-title',
                        'ui:group-box-classname': 'h2-box',
                        'ui:row': [
                          {
                            'ui:col': {
                              md: 12,
                              children: ['StreetAddresses']
                            }
                          }
                        ]
                      },
                      {
                        'ui:row': [
                          {
                            'ui:col': {
                              md: 4,
                              children: ['Country']
                            }
                          }
                        ]
                      },
                      {
                        'ui:row': [
                          {
                            'ui:col': {
                              md: 4,
                              children: ['City']
                            }
                          },
                          {
                            'ui:col': {
                              md: 4,
                              children: ['StateProvince']
                            }
                          },
                          {
                            'ui:col': {
                              md: 4,
                              children: ['PostalCode']
                            }
                          }
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
            PostalCode: {
              'ui:title': 'Postal Code'
            },
            Country: {
              'ui:widget': CustomCountrySelectWidget
            }
          }
        },
        OnlineResources: {
          'ui:title': 'Online Resources',
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
                          {
                            'ui:col': {
                              md: 6,
                              children: ['Name']
                            }
                          },
                          {
                            'ui:col': {
                              md: 6,
                              children: ['Protocol']
                            }
                          }

                        ]
                      },
                      {
                        'ui:row': [
                          {
                            'ui:col': {
                              md: 12,
                              children: ['Linkage']
                            }
                          }
                        ]
                      },
                      {
                        'ui:row': [
                          {
                            'ui:col': {
                              md: 12,
                              children: ['Description']
                            }
                          }
                        ]
                      },
                      {
                        'ui:row': [
                          {
                            'ui:col': {
                              md: 12,
                              children: ['ApplicationProfile']
                            }
                          }
                        ]
                      },
                      {
                        'ui:row': [
                          {
                            'ui:col': {
                              md: 12,
                              children: ['Function']
                            }
                          }
                        ]
                      }
                    ]
                  }
                }
              ]
            },
            OnlineResources: {
              'ui:field': 'Online Resources'
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
  }
}

export default serviceContactsUiSchema
