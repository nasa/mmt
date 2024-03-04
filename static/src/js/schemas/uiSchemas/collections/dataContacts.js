import { shouldHideGetData, shouldHideGetService } from '../../../utils/collectionsUtils'
import CustomCountrySelectWidget from '../../../components/CustomCountrySelectWidget/CustomCountrySelectWidget'
import CustomMultiSelectWidget from '../../../components/CustomMultiSelectWidget/CustomMultiSelectWidget'
import CustomSelectWidget from '../../../components/CustomSelectWidget/CustomSelectWidget'
import CustomTextWidget from '../../../components/CustomTextWidget/CustomTextWidget'

const dataContactsUiSchema = {
  ContactPersons: {
    'ui:hide-header': true,
    items: {
      'ui:field': 'layout',
      'ui:controlled': {
        name: 'providers',
        map: {
          ShortName: 'short_name',
          LongName: 'long_name',
          URL: 'url'
        }
      },
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:group-description': true,
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
                        md: 12,
                        children: ['NonDataCenterAffiliation']
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
      ShortName: {
        'ui:title': 'Data Center Short Name',
        'ui:widget': CustomSelectWidget
      },
      LongName: {
        'ui:title': 'Data Center Long Name',
        'ui:widget': CustomTextWidget
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
                    'ui:group-description': true,
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
                          children: ['RelatedUrls']
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
          'ui:group': 'ContactPersons'
        },
        ContactInstruction: {
          'ui:title': 'Contact Instructions',
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
                              md: 6,
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
            Country: {
              'ui:widget': CustomCountrySelectWidget
            }
          }
        },
        RelatedUrls: {
          'ui:title': 'Related URLs',
          'ui:header-box-classname': 'h3-box',
          items: {
            'ui:field': 'layout',
            'ui:controlled': {
              name: 'related-urls',
              map: {
                URLContentType: 'url_content_type',
                Type: 'type',
                Subtype: 'subtype'
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
                              children: ['Description']
                            }
                          }
                        ]
                      },
                      {
                        'ui:row': [
                          {
                            'ui:col': {
                              controlName: 'url_content_type',
                              md: 12,
                              children: ['URLContentType']
                            }
                          }
                        ]
                      },
                      {
                        'ui:row': [
                          {
                            'ui:col': {
                              controlName: 'type',
                              md: 12,
                              children: ['Type']
                            }
                          }
                        ]
                      },
                      {
                        'ui:row': [
                          {
                            'ui:col': {
                              controlName: 'subtype',
                              md: 12,
                              children: ['Subtype']
                            }
                          }
                        ]
                      },
                      {
                        'ui:row': [
                          {
                            'ui:col': {
                              md: 12,
                              children: ['URL']
                            }
                          }
                        ]
                      },
                      {
                        'ui:hide': (formData) => shouldHideGetData(formData),
                        'ui:row': [
                          {
                            'ui:col': {
                              md: 12,
                              children: ['GetData']
                            }
                          }
                        ]
                      },
                      {
                        'ui:hide': (formData) => shouldHideGetService(formData),
                        'ui:row': [
                          {
                            'ui:col': {
                              md: 12,
                              children: ['GetService']
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
            GetData: {
              'ui:field': 'layout',
              'ui:layout_grid': {
                'ui:row': [
                  {
                    'ui:group': 'Get Data',
                    'ui:group-description': true,
                    'ui:group-classname': 'h2-title',
                    'ui:col': {
                      md: 12,
                      children: [
                        {
                          'ui:row': [
                            {
                              'ui:col': {
                                md: 12,
                                children: ['Format']
                              }
                            }
                          ]
                        },
                        {
                          'ui:row': [
                            {
                              'ui:col': {
                                md: 12,
                                children: ['MimeType']
                              }
                            }
                          ]
                        },
                        {
                          'ui:row': [
                            {
                              'ui:col': {
                                md: 6,
                                children: ['Unit']
                              }
                            },
                            {
                              'ui:col': {
                                md: 6,
                                children: ['Size']
                              }
                            }
                          ]
                        },
                        {
                          'ui:row': [
                            {
                              'ui:col': {
                                md: 6,
                                children: ['Fees']
                              }
                            },
                            {
                              'ui:col': {
                                md: 6,
                                children: ['Checksum']
                              }
                            }
                          ]
                        }
                      ]
                    }
                  }
                ]
              },
              Format: {
                'ui:widget': CustomSelectWidget,
                'ui:controlled': {
                  name: 'granule-data-format',
                  controlName: 'short_name'
                }
              },
              MimeType: {
                'ui:widget': CustomSelectWidget,
                'ui:controlled': {
                  name: 'mime-type',
                  controlName: 'mime_type'
                }
              }
            },
            GetService: {
              'ui:field': 'layout',
              'ui:layout_grid': {
                'ui:row': [
                  {
                    'ui:group': 'Get Service',
                    'ui:group-description': true,
                    'ui:group-classname': 'h2-title',
                    'ui:col': {
                      md: 12,
                      children: [
                        {
                          'ui:row': [
                            {
                              'ui:col': {
                                md: 12,
                                children: ['Format']
                              }
                            }
                          ]
                        },
                        {
                          'ui:row': [
                            {
                              'ui:col': {
                                md: 12,
                                children: ['MimeType']
                              }
                            }
                          ]
                        },
                        {
                          'ui:row': [
                            {
                              'ui:col': {
                                md: 6,
                                children: ['Protocol']
                              }
                            },
                            {
                              'ui:col': {
                                md: 6,
                                children: ['FullName']
                              }
                            }
                          ]
                        },
                        {
                          'ui:row': [
                            {
                              'ui:col': {
                                md: 6,
                                children: ['DataID']
                              }
                            },
                            {
                              'ui:col': {
                                md: 6,
                                children: ['DataType']
                              }
                            }
                          ]
                        },
                        {
                          'ui:row': [
                            {
                              'ui:col': {
                                md: 12,
                                children: ['URI']
                              }
                            }

                          ]
                        }
                      ]
                    }
                  }
                ]
              },
              Format: {
                'ui:widget': CustomSelectWidget,
                'ui:controlled': {
                  name: 'granule-data-format',
                  controlName: 'short_name'
                }
              },
              MimeType: {
                'ui:widget': CustomSelectWidget,
                'ui:controlled': {
                  name: 'mime-type',
                  controlName: 'mime_type'
                }
              },
              URI: {
                items: {
                }
              }
            }
          }
        }
      }
    }
  },
  ContactGroups: {
    'ui:hide-header': true,
    items: {
      'ui:field': 'layout',
      'ui:controlled': {
        name: 'providers',
        map: {
          ShortName: 'short_name',
          LongName: 'long_name',
          URL: 'url'
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
                        md: 12,
                        children: ['GroupName']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['NonDataCenterAffiliation']
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
      ShortName: {
        'ui:title': 'Data Center Short Name',
        'ui:widget': CustomSelectWidget
      },
      LongName: {
        'ui:title': 'Data Center Long Name',
        'ui:widget': CustomTextWidget
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
                    'ui:group-description': true,
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
                          children: ['RelatedUrls']
                        }
                      }
                    ]
                  }
                ]
              }
            }
          ]
        },
        ContactInstruction: {
          'ui:title': 'Contact Instructions'
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
                        'ui:group-box-classname': 'h3-box',
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
                              md: 6,
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
            Country: {
              'ui:widget': CustomCountrySelectWidget
            }
          }
        },
        RelatedUrls: {
          'ui:title': 'Related URLs',
          'ui:header-box-classname': 'h3-box',
          items: {
            'ui:field': 'layout',
            'ui:controlled': {
              name: 'related-urls',
              map: {
                URLContentType: 'url_content_type',
                Type: 'type',
                Subtype: 'subtype'
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
                              children: ['Description']
                            }
                          }
                        ]
                      },
                      {
                        'ui:row': [
                          {
                            'ui:col': {
                              controlName: 'url_content_type',
                              md: 12,
                              children: ['URLContentType']
                            }
                          }
                        ]
                      },
                      {
                        'ui:row': [
                          {
                            'ui:col': {
                              controlName: 'type',
                              md: 12,
                              children: ['Type']
                            }
                          }
                        ]
                      },
                      {
                        'ui:row': [
                          {
                            'ui:col': {
                              controlName: 'subtype',
                              md: 12,
                              children: ['Subtype']
                            }
                          }
                        ]
                      },
                      {
                        'ui:row': [
                          {
                            'ui:col': {
                              md: 12,
                              children: ['URL']
                            }
                          }
                        ]
                      },
                      {
                        'ui:hide': (formData) => shouldHideGetData(formData),
                        'ui:row': [
                          {
                            'ui:col': {
                              md: 12,
                              children: ['GetData']
                            }
                          }
                        ]
                      },
                      {
                        'ui:hide': (formData) => shouldHideGetService(formData),
                        'ui:row': [
                          {
                            'ui:col': {
                              md: 12,
                              children: ['GetService']
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
            GetData: {
              'ui:field': 'layout',
              'ui:layout_grid': {
                'ui:row': [
                  {
                    'ui:group': 'Get Data',
                    'ui:group-description': true,
                    'ui:group-classname': 'h2-title',
                    'ui:col': {
                      md: 12,
                      children: [
                        {
                          'ui:row': [
                            {
                              'ui:col': {
                                md: 12,
                                children: ['Format']
                              }
                            }
                          ]
                        },
                        {
                          'ui:row': [
                            {
                              'ui:col': {
                                md: 12,
                                children: ['MimeType']
                              }
                            }
                          ]
                        },
                        {
                          'ui:row': [
                            {
                              'ui:col': {
                                md: 6,
                                children: ['Unit']
                              }
                            },
                            {
                              'ui:col': {
                                md: 6,
                                children: ['Size']
                              }
                            }
                          ]
                        },
                        {
                          'ui:row': [
                            {
                              'ui:col': {
                                md: 6,
                                children: ['Fees']
                              }
                            },
                            {
                              'ui:col': {
                                md: 6,
                                children: ['Checksum']
                              }
                            }
                          ]
                        }
                      ]
                    }
                  }
                ]
              },
              Format: {
                'ui:widget': CustomSelectWidget,
                'ui:controlled': {
                  name: 'granule-data-format',
                  controlName: 'short_name'
                }
              },
              MimeType: {
                'ui:widget': CustomSelectWidget,
                'ui:controlled': {
                  name: 'mime-type',
                  controlName: 'mime_type'
                }
              }
            },
            GetService: {
              'ui:field': 'layout',
              'ui:layout_grid': {
                'ui:row': [
                  {
                    'ui:group': 'Get Service',
                    'ui:group-description': true,
                    'ui:group-classname': 'h2-title',
                    'ui:col': {
                      md: 12,
                      children: [
                        {
                          'ui:row': [
                            {
                              'ui:col': {
                                md: 12,
                                children: ['Format']
                              }
                            }
                          ]
                        },
                        {
                          'ui:row': [
                            {
                              'ui:col': {
                                md: 12,
                                children: ['MimeType']
                              }
                            }
                          ]
                        },
                        {
                          'ui:row': [
                            {
                              'ui:col': {
                                md: 6,
                                children: ['Protocol']
                              }
                            },
                            {
                              'ui:col': {
                                md: 6,
                                children: ['FullName']
                              }
                            }
                          ]
                        },
                        {
                          'ui:row': [
                            {
                              'ui:col': {
                                md: 6,
                                children: ['DataID']
                              }
                            },
                            {
                              'ui:col': {
                                md: 6,
                                children: ['DataType']
                              }
                            }
                          ]
                        },
                        {
                          'ui:row': [
                            {
                              'ui:col': {
                                md: 12,
                                children: ['URI']
                              }
                            }

                          ]
                        }
                      ]
                    }
                  }
                ]
              },
              Format: {
                'ui:widget': CustomSelectWidget,
                'ui:controlled': {
                  name: 'granule-data-format',
                  controlName: 'short_name'
                }
              },
              MimeType: {
                'ui:widget': CustomSelectWidget,
                'ui:controlled': {
                  name: 'mime-type',
                  controlName: 'mime_type'
                }
              },
              URI: {
                items: {
                }
              }
            }
          }
        }
      }
    }
  }

}
export default dataContactsUiSchema
