import CustomCountrySelectWidget from '../../../components/CustomCountrySelectWidget/CustomCountrySelectWidget'
import CustomMultiSelectWidget from '../../../components/CustomMultiSelectWidget/CustomMultiSelectWidget'
import CustomSelectWidget from '../../../components/CustomSelectWidget/CustomSelectWidget'
import CustomTextWidget from '../../../components/CustomTextWidget/CustomTextWidget'
import handleShortNameChange from '../../../utils/handleShortNameChange'
import shouldHideGetData from '../../../utils/shouldHideGetData'
import shouldHideGetService from '../../../utils/shouldHideGetService'

const dataCentersUiSchema = {
  'ui:submitButtonOptions': {
    norender: true
  },
  DataCenters: {
    'ui:heading-level': 'h3',
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
      'ui:onHandleChange': (name, value, props, state) => {
        handleShortNameChange(name, value, props, state)
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
                        md: 12,
                        children: ['ContactInformation']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['ContactGroups']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
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
      Roles: {
        'ui:widget': CustomMultiSelectWidget
      },
      ShortName: {
        'ui:widget': CustomSelectWidget
      },
      LongName: {
        'ui:widget': CustomTextWidget
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
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 12,
                          children: ['ServiceHours']
                        }
                      }

                    ]
                  },
                  {
                    'ui:row': [
                      {
                        'ui:col': {
                          md: 12,
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
          'ui:heading-level': 'h5',
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
          'ui:heading-level': 'h5',
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
          'ui:heading-level': 'h5',
          'ui:title': 'Related URLs',
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
              'ui:heading-level': 'h6',
              'ui:field': 'layout',
              'ui:layout_grid': {
                'ui:row': [
                  {
                    'ui:group': 'Get Data',
                    'ui:group-description': true,
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
              'ui:heading-level': 'h6',
              'ui:field': 'layout',
              'ui:layout_grid': {
                'ui:row': [
                  {
                    'ui:group': 'Get Service',
                    'ui:group-description': true,
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
                'ui:widget': CustomSelectWidget
              },
              URI: {
                items: {
                }
              }
            }
          }
        }
      },
      ContactGroups: {
        'ui:heading-level': 'h4',
        items: {
          'ui:field': 'layout',
          'ui:layout_grid': {
            'ui:row': [
              {
                'ui:col': {
                  md: 12,
                  children: [
                    {
                      'ui:group': 'Contact Groups',
                      'ui:group-description': true,
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
          ContactInformation: {
            'ui:heading-level': 'h5',
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
            ContactMechanisms: {
              'ui:heading-level': 'h5',
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
              'ui:heading-level': 'h5',
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
              'ui:heading-level': 'h5',
              'ui:title': 'Related URLs',
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
                  'ui:heading-level': 'h6',
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
                  'ui:heading-level': 'h6',
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
                    'ui:widget': CustomSelectWidget
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
      ContactPersons: {
        'ui:heading-level': 'h4',
        items: {
          'ui:field': 'layout',
          'ui:layout_grid': {
            'ui:row': [
              {
                'ui:group': 'Contact Persons',
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
          Roles: {
            'ui:widget': CustomMultiSelectWidget
          },
          ContactInformation: {
            'ui:heading-level': 'h5',
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
              'ui:group': 'ContactPersons'
            },
            ContactMechanisms: {
              'ui:heading-level': 'h6',
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
              'ui:heading-level': 'h6',
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
              'ui:heading-level': 'h6',
              'ui:title': 'Related URLs',
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
                  'ui:heading-level': 'h6',
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
                  'ui:heading-level': 'h6',
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
                    'ui:widget': CustomSelectWidget
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
  }
}
export default dataCentersUiSchema
