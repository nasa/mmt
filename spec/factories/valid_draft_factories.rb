require 'faker'

FactoryGirl.define do
  factory :full_draft, class: Draft do
    transient do
      draft_short_name nil
      draft_entry_title nil
    end

    native_id 'full_draft_id'
    provider_id 'MMT_2'

    trait :with_valid_dates do
      draft {{
        'MetadataDates' => [{
          'Type' => 'CREATE',
          'Date' => '2010-12-25T00:00:00Z'
        }, {
          'Type' => 'UPDATE',
          'Date' => '2010-12-30T00:00:00Z'
        }]
      }}
    end

    draft {{
      'Projects' => [{
        'ShortName' => 'test 1 ShortName',
        'LongName'  => 'test 1 LongName',
        'Campaigns' => ['test 1a Campaign', 'test 1b Campaign'],
        'StartDate' => '2015-07-01T00:00:00Z',
        'EndDate'   => '2015-12-25T00:00:00Z'
      }, {
        'ShortName' => 'test 2 ShortName',
        'LongName'  => 'test 2 LongName',
        'Campaigns' => ['test 2a Campaign', 'test 2b Campaign'],
        'StartDate' => '2015-07-01T00:00:00Z',
        'EndDate'   => '2015-12-25T00:00:00Z'
      }],
      'Platforms' => [{
        'Type'      => 'Aircraft',
        'ShortName' => 'test 1 P ShortName',
        'LongName'  => 'test 1 P LongName',
        'Characteristics' => [{
          'Name'        => 'test 1 PC Name',
          'Description' => 'test 1 PC Description',
          'Value'       => 'test 1 PC Value',
          'Unit'        => 'test 1 PC Unit',
          'DataType'    => 'test 1 PC DataType'
        }, {
          'Name'        => 'test 2 PC Name',
          'Description' => 'test 2 PC Description',
          'Value'       => 'test 2 PC Value',
          'Unit'        => 'test 2 PC Unit',
          'DataType'    => 'test 2 PC DataType'
        }],
        'Instruments' => [{
          'ShortName' => 'test 1 PI ShortName',
          'LongName'  => 'test 1 PI LongName',
          'Characteristics' => [{
            'Name'        => 'test 1 PI Name',
            'Description' => 'test 1 PI Description',
            'Value'       => 'test 1 PI Value',
            'Unit'        => 'test 1 PI Unit',
            'DataType'    => 'test 1 PI DataType'
          }, {
            'Name'        => 'test 2 PI Name',
            'Description' => 'test 2 PI Description',
            'Value'       => 'test 2 PI Value',
            'Unit'        => 'test 2 PI Unit',
            'DataType'    => 'test 2 PI DataType'
          }],
          'Technique'       => 'test 1 PI Technique',
          'NumberOfInstruments' => 234,
          'ComposedOf' => [{
            'ShortName' => 'test 1 PS ShortName',
            'LongName'  => 'test 1 PS LongName',
            'Technique' => 'test 1 PS Technique',
            'Characteristics' => [{
              'Name'        => 'test 1 PS Name',
              'Description' => 'test 1 PS Description',
              'Value'       => 'test 1 PS Value',
              'Unit'        => 'test 1 PS Unit',
              'DataType'    => 'test 1 PS DataType'
            }, {
              'Name'        => 'test 2 PS Name',
              'Description' => 'test 2 PS Description',
              'Value'       => 'test 2 PS Value',
              'Unit'        => 'test 2 PS Unit',
              'DataType'    => 'test 2 PS DataType'
            }]
          }, {
            'ShortName' => 'test 1b PS ShortName',
            'LongName'  => 'test 1b PS LongName',
            'Technique' => 'test 1b PS Technique',
            'Characteristics' => [{
              'Name'        => 'test 1b PS Name',
              'Description' => 'test 1b PS Description',
              'Value'       => 'test 1b PS Value',
              'Unit'        => 'test 1b PS Unit',
              'DataType'    => 'test 1b PS DataType'
            }, {
              'Name'        => 'test 2b PS Name',
              'Description' => 'test 2b PS Description',
              'Value'       => 'test 2b PS Value',
              'Unit'        => 'test 2b PS Unit',
              'DataType'    => 'test 2b PS DataType'
            }]
          }],
          'OperationalModes' => ['test 1a Op', 'test 1b Op']
        }, {
          'ShortName' => 'test 1d PI ShortName',
          'LongName'  => 'test 1d PI LongName',
          'Characteristics' => [{
            'Name'        => 'test 1d PI Name',
            'Description' => 'test 1d PI Description',
            'Value'       => 'test 1d PI Value',
            'Unit'        => 'test 1d PI Unit',
            'DataType'    => 'test 1d PI DataType'
          }, {
            'Name'        => 'test 2d PI Name',
            'Description' => 'test 2d PI Description',
            'Value'       => 'test 2d PI Value',
            'Unit'        => 'test 2d PI Unit',
            'DataType'    => 'test 2d PI DataType'
          }],
          'Technique'       => 'test 1d PI Technique',
          'NumberOfInstruments' => 345,
          'ComposedOf' => [{
            'ShortName' => 'test 1d PS ShortName',
            'LongName'  => 'test 1d PS LongName',
            'Technique' => 'test 1d PS Technique',
            'Characteristics' => [{
              'Name'        => 'test 1d PS Name',
              'Description' => 'test 1d PS Description',
              'Value'       => 'test 1d PS Value',
              'Unit'        => 'test 1d PS Unit',
              'DataType'    => 'test 1d PS DataType'
            }, {
              'Name'        => 'test 2d PS Name',
              'Description' => 'test 2d PS Description',
              'Value'       => 'test 2d PS Value',
              'Unit'        => 'test 2d PS Unit',
              'DataType'    => 'test 2d PS DataType'
            }]
          }, {
            'ShortName' => 'test 1db PS ShortName',
            'LongName'  => 'test 1db PS LongName',
            'Technique' => 'test 1db PS Technique',
            'Characteristics' => [{
              'Name'        => 'test 1db PS Name',
              'Description' => 'test 1db PS Description',
              'Value'       => 'test 1db PS Value',
              'Unit'        => 'test 1db PS Unit',
              'DataType'    => 'test 1db PS DataType'
            }, {
              'Name'        => 'test 2db PS Name',
              'Description' => 'test 2db PS Description',
              'Value'       => 'test 2db PS Value',
              'Unit'        => 'test 2db PS Unit',
              'DataType'    => 'test 2db PS DataType'
            }]
          }],
          'OperationalModes' => ['test 1da Op', 'test 1db Op']
        }]
      }, {
        'Type'      => 'Earth Observation Satellites',
        'ShortName' => 'test a1 P ShortName',
        'LongName'  => 'test a1 P LongName',
        'Characteristics' => [{
          'Name'        => 'test a1 PC Name',
          'Description' => 'test a1 PC Description',
          'Value'       => 'test a1 PC Value',
          'Unit'        => 'test a1 PC Unit',
          'DataType'    => 'test a1 PC DataType'
        }, {
          'Name'        => 'test a2 PC Name',
          'Description' => 'test a2 PC Description',
          'Value'       => 'test a2 PC Value',
          'Unit'        => 'test a2 PC Unit',
          'DataType'    => 'test a2 PC DataType'
        }],
        'Instruments' => [{
          'ShortName' => 'test a1 PI ShortName',
          'LongName'  => 'test a1 PI LongName',
          'Characteristics' => [{
            'Name'        => 'test a1 PI Name',
            'Description' => 'test a1 PI Description',
            'Value'       => 'test a1 PI Value',
            'Unit'        => 'test a1 PI Unit',
            'DataType'    => 'test a1 PI DataType'
          }, {
            'Name'        => 'test a2 PI Name',
            'Description' => 'test a2 PI Description',
            'Value'       => 'test a2 PI Value',
            'Unit'        => 'test a2 PI Unit',
            'DataType'    => 'test a2 PI DataType'
          }],
          'Technique'       => 'test a1 PI Technique',
          'NumberOfInstruments' => 456,
          'ComposedOf' => [{
            'ShortName' => 'test a1 PS ShortName',
            'LongName'  => 'test a1 PS LongName',
            'Technique' => 'test a1 PS Technique',
            'Characteristics' => [{
              'Name'        => 'test a1 PS Name',
              'Description' => 'test a1 PS Description',
              'Value'       => 'test a1 PS Value',
              'Unit'        => 'test a1 PS Unit',
              'DataType'    => 'test a1 PS DataType'
            }, {
              'Name'        => 'test a2 PS Name',
              'Description' => 'test a2 PS Description',
              'Value'       => 'test a2 PS Value',
              'Unit'        => 'test a2 PS Unit',
              'DataType'    => 'test a2 PS DataType'
            }]
          }, {
            'ShortName' => 'test a1b PS ShortName',
            'LongName'  => 'test a1b PS LongName',
            'Technique' => 'test a1b PS Technique',
            'Characteristics' => [{
              'Name'        => 'test a1b PS Name',
              'Description' => 'test a1b PS Description',
              'Value'       => 'test a1b PS Value',
              'Unit'        => 'test a1b PS Unit',
              'DataType'    => 'test a1b PS DataType'
            }, {
              'Name'        => 'test a2b PS Name',
              'Description' => 'test a2b PS Description',
              'Value'       => 'test a2b PS Value',
              'Unit'        => 'test a2b PS Unit',
              'DataType'    => 'test a2b PS DataType'
            }]
          }],
          'OperationalModes' => ['test a1a Op', 'test a1b Op']
        }, {
          'ShortName' => 'test a1d PI ShortName',
          'LongName'  => 'test a1d PI LongName',
          'Characteristics' => [{
            'Name'        => 'test a1d PI Name',
            'Description' => 'test a1d PI Description',
            'Value'       => 'test a1d PI Value',
            'Unit'        => 'test a1d PI Unit',
            'DataType'    => 'test a1d PI DataType'
          }, {
            'Name'        => 'test a2d PI Name',
            'Description' => 'test a2d PI Description',
            'Value'       => 'test a2d PI Value',
            'Unit'        => 'test a2d PI Unit',
            'DataType'    => 'test a2d PI DataType'
          }],
          'Technique'       => 'test a1d PI Technique',
          'NumberOfInstruments' => 567,
          'ComposedOf' => [{
            'ShortName' => 'test a1d PS ShortName',
            'LongName'  => 'test a1d PS LongName',
            'Technique' => 'test a1d PS Technique',
            'Characteristics' => [{
              'Name'        => 'test a1d PS Name',
              'Description' => 'test a1d PS Description',
              'Value'       => 'test a1d PS Value',
              'Unit'        => 'test a1d PS Unit',
              'DataType'    => 'test a1d PS DataType'
            }, {
              'Name'        => 'test a2d PS Name',
              'Description' => 'test a2d PS Description',
              'Value'       => 'test a2d PS Value',
              'Unit'        => 'test a2d PS Unit',
              'DataType'    => 'test a2d PS DataType'
            }]
          }, {
            'ShortName' => 'test a1db PS ShortName',
            'LongName'  => 'test a1db PS LongName',
            'Technique' => 'test a1db PS Technique',
            'Characteristics' => [{
              'Name'        => 'test a1db PS Name',
              'Description' => 'test a1db PS Description',
              'Value'       => 'test a1db PS Value',
              'Unit'        => 'test a1db PS Unit',
              'DataType'    => 'test a1db PS DataType'
            }, {
              'Name'        => 'test a2db PS Name',
              'Description' => 'test a2db PS Description',
              'Value'       => 'test a2db PS Value',
              'Unit'        => 'test a2db PS Unit',
              'DataType'    => 'test a2db PS DataType'
            }]
          }],
          'OperationalModes' => ['test a1da Op', 'test a1db Op']
        }]
      }],
      'Abstract'     => 'This is a long description of the collection',
      'ShortName'    => draft_short_name || "#{Faker::Number.number(6)}_#{Faker::Superhero.name}",
      'Version'      => '1',
      'VersionDescription' => 'Version 1 Description',
      'EntryTitle'   => draft_entry_title || "#{Faker::Number.number(6)}_#{Faker::Name.title}",
      'Purpose'      => 'This is the purpose field',
      'DataLanguage' => 'eng',
      'DataDates' => [{
        'Type' => 'CREATE',
        'Date' => '2015-07-01T00:00:00Z'
      }, {
        'Type' => 'UPDATE',
        'Date' => '2015-07-05T00:00:00Z'
      }],
      'DataCenters' => [{
        'Roles'     => ['ARCHIVER'],
        'ShortName' => 'AARHUS-HYDRO',
        'LongName'  => 'Hydrogeophysics Group, Aarhus University ', # controlled keywords source has extra space at the end
        'ContactInformation' => {
          'ServiceHours'       => '9-6, M-F',
          'ContactInstruction' => 'Email only',
          'ContactMechanisms' => [{
            'Type'  => 'Email',
            'Value' => 'example@example.com'
          }, {
            'Type'  => 'Email',
            'Value' => 'example2@example.com'
          }],
          'Addresses' => [{
            'StreetAddresses' => ['300 E Street Southwest', 'Room 203', 'Address line 3'],
            'City'            => 'Washington',
            'StateProvince'   => 'DC',
            'PostalCode'      => '20546',
            'Country'         => 'United States'
          }, {
            'StreetAddresses' => ['8800 Greenbelt Road'],
            'City'            => 'Greenbelt',
            'StateProvince'   => 'MD',
            'PostalCode'      => '20771',
            'Country'         => 'United States'
          }],
          'RelatedUrls' => [{
            'URLs'        => ['http://example.com', 'http://another-example.com'],
            'Description' => 'Example Description',
            'Title'       => 'Example Title'
          }, {
            'URLs' => ['http://example1.com/1']
          }]
        }
      }, {
      'Roles'     => ['ORIGINATOR', 'DISTRIBUTOR'],
      'ShortName' => 'ESA/ED',
      'LongName'  => 'Educational Office, Ecological Society of America',
      'ContactInformation' => {
        'ServiceHours'       => '10-2, M-W',
        'ContactInstruction' => 'Email only',
        'ContactMechanisms' => [{
          'Type'  => 'Email',
          'Value' => 'example@example.com'
          }, {
          'Type'  => 'Email',
          'Value' => 'example2@example.com'
          }],
          'Addresses' => [{
            'StreetAddresses' => ['300 E Street Southwest', 'Room 203', 'Address line 3'],
            'City'            => 'Washington',
            'StateProvince'   => 'DC',
            'PostalCode'      => '20546',
            'Country'         => 'United States'
          }, {
            'StreetAddresses' => ['8800 Greenbelt Road'],
            'City'            => 'Greenbelt',
            'StateProvince'   => 'MD',
            'PostalCode'      => '20771',
            'Country'         => 'United States'
          }],
          'RelatedUrls' => [{
            'URLs'        => ['http://example.com', 'http://another-example.com'],
            'Description' => 'Example Description',
            'Title'       => 'Example Title'
            }, {
            'URLs' => ['http://example2.com/1']
          }]
        },
        'ContactPersons' => [{
          'Roles'      => ['Investigator', 'Metadata Author'],
          'FirstName'  => 'First Name 3',
          'MiddleName' => 'Middle Name 3',
          'LastName'   => 'Last Name 3',
          'ContactInformation' => {
            'ServiceHours'       => '1-4, M-W',
            'ContactInstruction' => 'Email only',
            'ContactMechanisms' => [{
              'Type'  => 'Email',
              'Value' => 'example5@example.com'
            }, {
              'Type'  => 'Email',
              'Value' => 'example6@example.com'
            }],
            'Addresses' => [{
              'StreetAddresses' => ['300 E Street Southwest', 'Room 203', 'Address line 3'],
              'City'            => 'Washington',
              'StateProvince'   => 'DC',
              'PostalCode'      => '20546',
              'Country'         => 'United States'
            }, {
              'StreetAddresses' => ['8800 Greenbelt Road'],
              'City'            => 'Greenbelt',
              'StateProvince'   => 'MD',
              'PostalCode'      => '20771',
              'Country'         => 'United States'
            }],
            'RelatedUrls' => [{
              'URLs'        => ['http://example.com', 'http://another-example.com'],
              'Description' => 'Example Description',
              'Title'       => 'Example Title'
            }, {
              'URLs' => ['http://example.com/1']
            }]
          }
        }],
        'ContactGroups' => [{
          'Roles'     => ['User Services'],
          'GroupName' => 'Group Name 2',
          'ContactInformation' => {
            'ServiceHours'       => '9-5, M-F',
            'ContactInstruction' => 'Email only',
            'ContactMechanisms' => [{
              'Type'  => 'Email',
              'Value' => 'example7@example.com'
            }, {
              'Type'  => 'Email',
              'Value' => 'example8@example.com'
            }],
            'Addresses' => [{
              'StreetAddresses' => ['300 E Street Southwest', 'Room 203', 'Address line 3'],
              'City'            => 'Washington',
              'StateProvince'   => 'DC',
              'PostalCode'      => '20546',
              'Country'         => 'United States'
            }, {
              'StreetAddresses' => ['8800 Greenbelt Road'],
              'City'            => 'Greenbelt',
              'StateProvince'   => 'MD',
              'PostalCode'      => '20771',
              'Country'         => 'United States'
            }],
            'RelatedUrls' => [{
              'URLs'        => ['http://example.com', 'http://another-example.com'],
              'Description' => 'Example Description',
              'Title'       => 'Example Title'
            }, {
              'URLs' => ['http://example.com/1']
            }]
          }
        }]
      }],
      'ContactPersons' => [{
        'Roles'                    => ['Science Contact', 'Technical Contact'],
        'FirstName'                => 'First Name',
        'MiddleName'               => 'Middle Name',
        'LastName'                 => 'Last Name',
        'NonDataCenterAffiliation' => 'Famous University',
        'ContactInformation' => {
          'ServiceHours'       => '10-2, M-W',
          'ContactInstruction' => 'Email only',
          'ContactMechanisms' => [{
            'Type'  => 'Email',
            'Value' => 'example1@example.com'
          }, {
            'Type'  => 'Email',
            'Value' => 'example2@example.com'
          }],
          'Addresses' => [{
            'StreetAddresses' => ['300 E Street Southwest', 'Room 203', 'Address line 3'],
            'City'            => 'Washington',
            'StateProvince'   => 'DC',
            'PostalCode'      => '20546',
            'Country'         => 'United States'
          }, {
            'StreetAddresses' => ['8800 Greenbelt Road'],
            'City'            => 'Greenbelt',
            'StateProvince'   => 'MD',
            'PostalCode'      => '20771',
            'Country'         => 'United States'
          }],
          'RelatedUrls' => [{
            'URLs'        => ['http://example.com', 'http://another-example.com'],
            'Description' => 'Example Description',
            'Title'       => 'Example Title'
          }, {
            'URLs' => ['http://example.com/1']
          }]
        }
      }],
      'ContactGroups' => [{
        'Roles'                    => ['User Services', 'Science Software Development'],
        'GroupName'                => 'Group Name',
        'NonDataCenterAffiliation' => 'Famous University',
        'ContactInformation' => {
          'ServiceHours'       => '9-5, M-F',
          'ContactInstruction' => 'Email only',
          'ContactMechanisms' => [{
            'Type'  => 'Email',
            'Value' => 'example3@example.com'
          }, {
            'Type'  => 'Email',
            'Value' => 'example4@example.com'
          }],
          'Addresses' => [{
            'StreetAddresses' => ['300 E Street Southwest', 'Room 203', 'Address line 3'],
            'City'            => 'Washington',
            'StateProvince'   => 'DC',
            'PostalCode'      => '20546',
            'Country'         => 'United States'
          }, {
            'StreetAddresses' => ['8800 Greenbelt Road'],
            'City'            => 'Greenbelt',
            'StateProvince'   => 'MD',
            'PostalCode'      => '20771',
            'Country'         => 'United States'
          }],
          'RelatedUrls' => [{
            'URLs'        => ['http://example.com', 'http://another-example.com'],
            'Description' => 'Example Description',
            'Title'       => 'Example Title'
          }, {
            'URLs' => ['http://example.com/1']
          }]
        }
      }],
      'CollectionDataType' => 'SCIENCE_QUALITY',
      'ProcessingLevel' => {
        'Id'                         => '1A',
        'ProcessingLevelDescription' => 'Level 1 Description'
      },
      'CollectionCitations' => [{
        'Version'              => 'v1',
        'Title'                => 'Citation title',
        'Creator'              => 'Citation creator',
        'Editor'               => 'Citation editor',
        'SeriesName'           => 'Citation series name',
        'ReleaseDate'          => '2015-07-01T00:00:00Z',
        'ReleasePlace'         => 'Citation release place',
        'Publisher'            => 'Citation publisher',
        'IssueIdentification'  => 'Citation issue identification',
        'DataPresentationForm' => 'Citation data presentation form',
        'OtherCitationDetails' => 'Citation other details',
        'OnlineResource' => {
          'Linkage' => 'http://example.com',
          'Description' => 'Example Description',
          'Name' => 'Example related URL Title 1'
        }
      }, {
        'Version' => 'v2',
        'Title'   => 'Citation title 1',
        'Creator' => 'Citation creator 1',
        'OnlineResource' => {
          'Linkage' => 'http://example2.com',
          'Description' => 'Example 2 Description',
          'Name' => 'Example 2 related URL Title'
        }
      }],
      'DOI' => {
        'DOI'       => 'Citation DOI',
        'Authority' => 'Citation DOI Authority'
      },
      'CollectionProgress' => 'IN WORK',
      'Quality'            => 'Metadata quality summary',
      'UseConstraints'     => 'These are some use constraints',
      'AccessConstraints' => {
        'Value'       => 42,
        'Description' => 'Access constraint description'
      },
      'MetadataAssociations' => [{
        'Type'        => 'SCIENCE ASSOCIATED',
        'Description' => 'Metadata association description',
        'EntryId'     => '12345'
      }, {
        'Type'    => 'LARGER CITATION WORKS',
        'EntryId' => '123abc'
      }],
      'PublicationReferences' => [{
        'Title'     => 'Publication reference title',
        'Publisher' => 'Publication reference publisher',
        'DOI' => {
          'DOI'       => 'Publication reference DOI',
          'Authority' => 'Publication reference authority'
        },
        'Author'                => 'Publication reference author',
        'PublicationDate'       => '2015-07-01T00:00:00Z',
        'Series'                => 'Publication reference series',
        'Edition'               => 'Publication reference edition',
        'Volume'                => 'Publication reference volume',
        'Issue'                 => 'Publication reference issue',
        'ReportNumber'          => 'Publication reference report number',
        'PublicationPlace'      => 'Publication reference publication place',
        'Pages'                 => 'Publication reference pages',
        'ISBN'                  => '1234567890123',
        'OtherReferenceDetails' => 'Publication reference details',
        'OnlineResource' => {
          'Linkage' => 'http://example.com',
          'Description' => 'Example Description',
          'Name' => 'Example URL Title'
        }
      }, {
        'Title' => 'Publication reference title 1',
        'ISBN'  => '9876543210987'
      }],
      'ScienceKeywords' => [{
        'Category' => 'EARTH SCIENCE SERVICES',
        'Topic'    => 'DATA ANALYSIS AND VISUALIZATION',
        'Term'     => 'GEOGRAPHIC INFORMATION SYSTEMS'
      }, {
        'Category'       => 'EARTH SCIENCE SERVICES',
        'Topic'          => 'DATA ANALYSIS AND VISUALIZATION',
        'Term'           => 'GEOGRAPHIC INFORMATION SYSTEMS',
        'VariableLevel1' => 'MOBILE GEOGRAPHIC INFORMATION SYSTEMS'
      }, {
        'Category'       => 'EARTH SCIENCE SERVICES',
        'Topic'          => 'DATA ANALYSIS AND VISUALIZATION',
        'Term'           => 'GEOGRAPHIC INFORMATION SYSTEMS',
        'VariableLevel1' => 'DESKTOP GEOGRAPHIC INFORMATION SYSTEMS'
      }],
        'AncillaryKeywords' => ['Ancillary keyword 1', 'Ancillary keyword 2'], 'AdditionalAttributes' => [{
        'Name'                     => 'Attribute 1',
        'Description'              => 'Description',
        'DataType'                 => 'INT',
        'MeasurementResolution'    => 'Measurement Resolution',
        'ParameterRangeBegin'      => '1',
        'ParameterRangeEnd'        => '5',
        'ParameterUnitsOfMeasure'  => 'Parameter Units Of Measure',
        'ParameterValueAccuracy'   => 'Parameter Value Accuracy',
        'ValueAccuracyExplanation' => 'Value Accuracy Explanation',
        'Group'                    => 'Group',
        'UpdateDate'               => '2015-09-14T00:00:00Z'
      }, {
        'Name' => 'Attribute 2',
        'Description' => 'Description 2',
        'DataType' => 'STRING'
      }],
      'RelatedUrls' => [{
        'URLs' => ['http://example.com']
      }, {
        'Description' => 'test 1 Description',
        'URLs'        => ['http://example.com/1', 'http://example.com/a'],
        'Title'       => 'test 1 Title',
        'MimeType'    => 'text/html',
        'FileSize' => {
          'Size' => 123,
          'Unit' => 'MB'
        }
      }, {
        'Description' => 'test 2 Description',
        'URLs'     => ['http://example.com/2', 'http://example.com/b'],
        'Title'    => 'test 2 Title',
        'MimeType' => 'text/html',
        'FileSize' => {
          'Size' => 321,
          'Unit' => 'PB'
        }
      }],
      'Distributions' => [{},
      {
        'DistributionMedia' => 'test 2 DistributionMedia',
        'Sizes' => [{
          'Size' => 42,
          'Unit' => 'KB'
        }, {
          'Size' => 9001,
          'Unit' => 'MB'
        }],
        'DistributionFormat' => 'test 2 DistributionFormat',
        'Fees' => '1234.56'
      }, {
        'DistributionMedia' => 'test 1 DistributionMedia',
        'Sizes' => [{
          'Size' => 25,
          'Unit' => 'TB'
        }],
        'DistributionFormat' => 'test 1 DistributionFormat',
        'Fees' => '1234.56'
      }],
      'MetadataLanguage' => 'eng',
      'MetadataDates' => [{
        'Type' => 'CREATE',
        'Date' => '2010-12-25T00:00:00Z'
      }, {
        'Type' => 'UPDATE',
        'Date' => '2010-12-30T00:00:00Z'
      }],
      'DirectoryNames' => [{
        'ShortName' => 'Short Directory 1',
        'LongName' => 'Long Directory 1'
      }, {
        'ShortName' => 'Short Directory 2',
        'LongName' => 'Long Directory 2'
      }],
      'SpatialExtent' => {
        'SpatialCoverageType' => 'HORIZONTAL',
        'HorizontalSpatialDomain' => {
          'ZoneIdentifier' => 'Zone ID',
          'Geometry' => {
            'CoordinateSystem' => 'CARTESIAN',
            'BoundingRectangles' => [{
              'WestBoundingCoordinate'  => -180.0,
              'NorthBoundingCoordinate' => 90.0,
              'EastBoundingCoordinate'  => 180.0,
              'SouthBoundingCoordinate' => -90.0
            }, {
              'WestBoundingCoordinate'  => -96.9284587,
              'NorthBoundingCoordinate' => 58.968602,
              'EastBoundingCoordinate'  => -56.9284587,
              'SouthBoundingCoordinate' => 18.968602
            }]
          }
        },
        'GranuleSpatialRepresentation' => 'CARTESIAN'
      },
      'TilingIdentificationSystems' => [{
        'TilingIdentificationSystemName' => 'System name',
        'Coordinate1' => {
          'MinimumValue' => -50, 'MaximumValue' => 50
        },
        'Coordinate2' => {
          'MinimumValue' => -30, 'MaximumValue' => 30
        }
      }, {
        'TilingIdentificationSystemName' => 'System name 1',
        'Coordinate1' => {
          'MinimumValue' => -25, 'MaximumValue' => 25
        },
        'Coordinate2' => {
          'MinimumValue' => -15, 'MaximumValue' => 15
        }
      }],
      'SpatialInformation' => {
        'SpatialCoverageType' => 'BOTH',
        'HorizontalCoordinateSystem' => {
          'GeodeticModel' => {
            'HorizontalDatumName' => 'Datum name', 'EllipsoidName' => 'Ellipsoid name', 'SemiMajorAxis' => 3.0, 'DenominatorOfFlatteningRatio' => 4.0
          }
        },
        'VerticalCoordinateSystem' => {
          'AltitudeSystemDefinition' => {
            'DatumName' => 'Datum', 'DistanceUnits' => 'Distance Units', 'EncodingMethod' => 'Encoding', 'Resolutions' => [1.0, 2.0, 3.0]
          },
          'DepthSystemDefinition' => {
            'DatumName' => 'Datum 2', 'DistanceUnits' => 'Distance Units 2', 'EncodingMethod' => 'Encoding 2', 'Resolutions' => [12.0, 22.0, 32.0]
          }
        }
      },
      'LocationKeywords' => [{
        'Category' => 'GEOGRAPHIC REGION',
        'Type' => 'ARCTIC'
      }, {
        'Category' => 'OCEAN',
        'Type' => 'ATLANTIC OCEAN'
      }],
      'TemporalExtents' => [{
          'TemporalRangeType'  => 'SingleDateTime',
          'PrecisionOfSeconds' => 1,
          'EndsAtPresentFlag'  => false,
          'SingleDateTimes'    => ['2015-07-01T00:00:00Z', '2015-12-25T00:00:00Z']
        }, {
          'TemporalRangeType'  => 'RangeDateTime',
          'PrecisionOfSeconds' => 10,
          'EndsAtPresentFlag'  => false,
          'RangeDateTimes' => [{
            'BeginningDateTime' => '2014-07-01T00:00:00Z',
            'EndingDateTime'    => '2014-08-01T00:00:00Z'
          }, {
            'BeginningDateTime' => '2015-07-01T00:00:00Z',
            'EndingDateTime'    => '2015-08-01T00:00:00Z'
          }]
        }, {
          'TemporalRangeType'  => 'PeriodicDateTime',
          'PrecisionOfSeconds' => 30,
          'EndsAtPresentFlag'  => false,
          'PeriodicDateTimes' => [{
            'Name'                     => 'test 1 Periodic Extent',
            'StartDate'                => '2015-07-01T00:00:00Z',
            'EndDate'                  => '2015-08-01T00:00:00Z',
            'DurationUnit'             => 'DAY',
            'DurationValue'            => 5,
            'PeriodCycleDurationUnit'  => 'DAY',
            'PeriodCycleDurationValue' => 1
          }, {
            'Name'                     => 'test 2 Periodic Extent',
            'StartDate'                => '2016-07-01T00:00:00Z',
            'EndDate'                  => '2016-08-01T00:00:00Z',
            'DurationUnit'             => 'MONTH',
            'DurationValue'            => 4,
            'PeriodCycleDurationUnit'  => 'MONTH',
            'PeriodCycleDurationValue' => 2
          }]
        }],
      'TemporalKeywords' => ['Monthly Climatology', 'Weekly Climatology'],
      'PaleoTemporalCoverages' => [{
        'StartDate' => '50 Ga',
        'EndDate'   => '25 Ga',
        'ChronostratigraphicUnits' => [{
          'Eon'                    => 'test 1 Eon',
          'Era'                    => 'test 1 Era',
          'Epoch'                  => 'test 1 Epoch',
          'Stage'                  => 'test 1 Stage',
          'DetailedClassification' => 'test 1 Detailed Classification',
          'Period'                 => 'test 1 Period'
        }, {
          'Eon'                    => 'test 2 Eon',
          'Era'                    => 'test 2 Era',
          'Epoch'                  => 'test 2 Epoch',
          'Stage'                  => 'test 2 Stage',
          'DetailedClassification' => 'test 2 Detailed Classification',
          'Period'                 => 'test 2 Period'
        }, {
          'Eon' => 'test 3 Eon text 1'
        }]
      }],
      'ISOTopicCategories' => %w(farming climatologyMeteorologyAtmosphere health)
    }}
  end
end
