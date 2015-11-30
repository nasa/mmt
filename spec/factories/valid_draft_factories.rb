FactoryGirl.define do
  factory :full_draft, class: Draft do
    native_id 'full_draft_id'
    draft 'Projects' => [{
      'ShortName' => 'test 1 ShortName',
      'LongName' => 'test 1 LongName',
      'Campaigns' => ['test 1a Campaign', 'test 1b Campaign'],
      'StartDate' => '2015-07-01T00:00:00Z',
      'EndDate' => '2015-12-25T00:00:00Z'
    }, {
      'ShortName' => 'test 2 ShortName',
      'LongName' => 'test 2 LongName',
      'Campaigns' => ['test 2a Campaign', 'test 2b Campaign'],
      'StartDate' => '2015-07-01T00:00:00Z',
      'EndDate' => '2015-12-25T00:00:00Z'
    }],
    'Platforms' => [{
      'Type' => 'test 1 Type',
      'ShortName' => 'test 1 P ShortName',
      'LongName' => 'test 1 P LongName',
      'Characteristics' => [{
        'Name' => 'test 1 PC Name',
        'Description' => 'test 1 PC Description',
        'Value' => 'test 1 PC Value',
        'Unit' => 'test 1 PC Unit',
        'DataType' => 'test 1 PC DataType'
      }, {
        'Name' => 'test 2 PC Name',
        'Description' => 'test 2 PC Description',
        'Value' => 'test 2 PC Value',
        'Unit' => 'test 2 PC Unit',
        'DataType' => 'test 2 PC DataType'
      }],
      'Instruments' => [{
        'ShortName' => 'test 1 PI ShortName',
        'LongName' => 'test 1 PI LongName',
        'Characteristics' => [{
          'Name' => 'test 1 PI Name',
          'Description' => 'test 1 PI Description',
          'Value' => 'test 1 PI Value',
          'Unit' => 'test 1 PI Unit',
          'DataType' => 'test 1 PI DataType'
        }, {
          'Name' => 'test 2 PI Name',
          'Description' => 'test 2 PI Description',
          'Value' => 'test 2 PI Value',
          'Unit' => 'test 2 PI Unit',
          'DataType' => 'test 2 PI DataType'
        }],
        'Technique' => 'test 1 PI Technique',
        'NumberOfSensors' => 234,
        'Sensors' => [{
          'ShortName' => 'test 1 PS ShortName',
          'LongName' => 'test 1 PS LongName',
          'Technique' => 'test 1 PS Technique',
          'Characteristics' => [{
            'Name' => 'test 1 PS Name',
            'Description' => 'test 1 PS Description',
            'Value' => 'test 1 PS Value',
            'Unit' => 'test 1 PS Unit',
            'DataType' => 'test 1 PS DataType'
          }, {
            'Name' => 'test 2 PS Name',
            'Description' => 'test 2 PS Description',
            'Value' => 'test 2 PS Value',
            'Unit' => 'test 2 PS Unit',
            'DataType' => 'test 2 PS DataType'
          }]
        }, {
          'ShortName' => 'test 1b PS ShortName',
          'LongName' => 'test 1b PS LongName',
          'Technique' => 'test 1b PS Technique',
          'Characteristics' => [{
            'Name' => 'test 1b PS Name',
            'Description' => 'test 1b PS Description',
            'Value' => 'test 1b PS Value',
            'Unit' => 'test 1b PS Unit',
            'DataType' => 'test 1b PS DataType'
          }, {
            'Name' => 'test 2b PS Name',
            'Description' => 'test 2b PS Description',
            'Value' => 'test 2b PS Value',
            'Unit' => 'test 2b PS Unit',
            'DataType' => 'test 2b PS DataType'
          }]
        }],
        'OperationalModes' => ['test 1a Op', 'test 1b Op']
      }, {
        'ShortName' => 'test 1d PI ShortName',
        'LongName' => 'test 1d PI LongName',
        'Characteristics' => [{
          'Name' => 'test 1d PI Name',
          'Description' => 'test 1d PI Description',
          'Value' => 'test 1d PI Value',
          'Unit' => 'test 1d PI Unit',
          'DataType' => 'test 1d PI DataType'
        }, {
          'Name' => 'test 2d PI Name',
          'Description' => 'test 2d PI Description',
          'Value' => 'test 2d PI Value',
          'Unit' => 'test 2d PI Unit',
          'DataType' => 'test 2d PI DataType'
        }],
        'Technique' => 'test 1d PI Technique',
        'NumberOfSensors' => 345,
        'Sensors' => [{
          'ShortName' => 'test 1d PS ShortName',
          'LongName' => 'test 1d PS LongName',
          'Technique' => 'test 1d PS Technique',
          'Characteristics' => [{
            'Name' => 'test 1d PS Name',
            'Description' => 'test 1d PS Description',
            'Value' => 'test 1d PS Value',
            'Unit' => 'test 1d PS Unit',
            'DataType' => 'test 1d PS DataType'
          }, {
            'Name' => 'test 2d PS Name',
            'Description' => 'test 2d PS Description',
            'Value' => 'test 2d PS Value',
            'Unit' => 'test 2d PS Unit',
            'DataType' => 'test 2d PS DataType'
          }]
        }, {
          'ShortName' => 'test 1db PS ShortName',
          'LongName' => 'test 1db PS LongName',
          'Technique' => 'test 1db PS Technique',
          'Characteristics' => [{
            'Name' => 'test 1db PS Name',
            'Description' => 'test 1db PS Description',
            'Value' => 'test 1db PS Value',
            'Unit' => 'test 1db PS Unit',
            'DataType' => 'test 1db PS DataType'
          }, {
            'Name' => 'test 2db PS Name',
            'Description' => 'test 2db PS Description',
            'Value' => 'test 2db PS Value',
            'Unit' => 'test 2db PS Unit',
            'DataType' => 'test 2db PS DataType'
          }]
        }],
        'OperationalModes' => ['test 1da Op', 'test 1db Op']
      }]
    }, {
      'Type' => 'test a1 Type',
      'ShortName' => 'test a1 P ShortName',
      'LongName' => 'test a1 P LongName',
      'Characteristics' => [{
        'Name' => 'test a1 PC Name',
        'Description' => 'test a1 PC Description',
        'Value' => 'test a1 PC Value',
        'Unit' => 'test a1 PC Unit',
        'DataType' => 'test a1 PC DataType'
      }, {
        'Name' => 'test a2 PC Name',
        'Description' => 'test a2 PC Description',
        'Value' => 'test a2 PC Value',
        'Unit' => 'test a2 PC Unit',
        'DataType' => 'test a2 PC DataType'
      }],
      'Instruments' => [{
        'ShortName' => 'test a1 PI ShortName',
        'LongName' => 'test a1 PI LongName',
        'Characteristics' => [{
          'Name' => 'test a1 PI Name',
          'Description' => 'test a1 PI Description',
          'Value' => 'test a1 PI Value',
          'Unit' => 'test a1 PI Unit',
          'DataType' => 'test a1 PI DataType'
        }, {
          'Name' => 'test a2 PI Name',
          'Description' => 'test a2 PI Description',
          'Value' => 'test a2 PI Value',
          'Unit' => 'test a2 PI Unit',
          'DataType' => 'test a2 PI DataType'
        }],
        'Technique' => 'test a1 PI Technique',
        'NumberOfSensors' => 456,
        'Sensors' => [{
          'ShortName' => 'test a1 PS ShortName',
          'LongName' => 'test a1 PS LongName',
          'Technique' => 'test a1 PS Technique',
          'Characteristics' => [{
            'Name' => 'test a1 PS Name',
            'Description' => 'test a1 PS Description',
            'Value' => 'test a1 PS Value',
            'Unit' => 'test a1 PS Unit',
            'DataType' => 'test a1 PS DataType'
          }, {
            'Name' => 'test a2 PS Name',
            'Description' => 'test a2 PS Description',
            'Value' => 'test a2 PS Value',
            'Unit' => 'test a2 PS Unit',
            'DataType' => 'test a2 PS DataType'
          }]
        }, {
          'ShortName' => 'test a1b PS ShortName',
          'LongName' => 'test a1b PS LongName',
          'Technique' => 'test a1b PS Technique',
          'Characteristics' => [{
            'Name' => 'test a1b PS Name',
            'Description' => 'test a1b PS Description',
            'Value' => 'test a1b PS Value',
            'Unit' => 'test a1b PS Unit',
            'DataType' => 'test a1b PS DataType'
          }, {
            'Name' => 'test a2b PS Name',
            'Description' => 'test a2b PS Description',
            'Value' => 'test a2b PS Value',
            'Unit' => 'test a2b PS Unit',
            'DataType' => 'test a2b PS DataType'
          }]
        }],
        'OperationalModes' => ['test a1a Op', 'test a1b Op']
      }, {
        'ShortName' => 'test a1d PI ShortName',
        'LongName' => 'test a1d PI LongName',
        'Characteristics' => [{
          'Name' => 'test a1d PI Name',
          'Description' => 'test a1d PI Description',
          'Value' => 'test a1d PI Value',
          'Unit' => 'test a1d PI Unit',
          'DataType' => 'test a1d PI DataType'
        }, {
          'Name' => 'test a2d PI Name',
          'Description' => 'test a2d PI Description',
          'Value' => 'test a2d PI Value',
          'Unit' => 'test a2d PI Unit',
          'DataType' => 'test a2d PI DataType'
        }],
        'Technique' => 'test a1d PI Technique',
        'NumberOfSensors' => 567,
        'Sensors' => [{
          'ShortName' => 'test a1d PS ShortName',
          'LongName' => 'test a1d PS LongName',
          'Technique' => 'test a1d PS Technique',
          'Characteristics' => [{
            'Name' => 'test a1d PS Name',
            'Description' => 'test a1d PS Description',
            'Value' => 'test a1d PS Value',
            'Unit' => 'test a1d PS Unit',
            'DataType' => 'test a1d PS DataType'
          }, {
            'Name' => 'test a2d PS Name',
            'Description' => 'test a2d PS Description',
            'Value' => 'test a2d PS Value',
            'Unit' => 'test a2d PS Unit',
            'DataType' => 'test a2d PS DataType'
          }]
        }, {
          'ShortName' => 'test a1db PS ShortName',
          'LongName' => 'test a1db PS LongName',
          'Technique' => 'test a1db PS Technique',
          'Characteristics' => [{
            'Name' => 'test a1db PS Name',
            'Description' => 'test a1db PS Description',
            'Value' => 'test a1db PS Value',
            'Unit' => 'test a1db PS Unit',
            'DataType' => 'test a1db PS DataType'
          }, {
            'Name' => 'test a2db PS Name',
            'Description' => 'test a2db PS Description',
            'Value' => 'test a2db PS Value',
            'Unit' => 'test a2db PS Unit',
            'DataType' => 'test a2db PS DataType'
          }]
        }],
        'OperationalModes' => ['test a1da Op', 'test a1db Op']
      }]
    }],
    'Abstract' => 'This is a long description of the collection',
    'EntryId' => '12345',
    'Version' => '1',
    'EntryTitle' => 'Draft Title',
    'Purpose' => 'This is the purpose field',
    'DataLanguage' => 'eng',
    'DataDates' => [{
      'Type' => 'CREATE',
      'Date' => '2015-07-01T00:00:00Z'
    }, {
      'Type' => 'REVIEW',
      'Date' => '2015-07-05T00:00:00Z'
    }],
    'Organizations' => [{
      'Role' => 'RESOURCEPROVIDER',
      'Party' => {
        'OrganizationName' => {
          'ShortName' => 'ORG_SHORT 2',
          'LongName' => 'Organization Long Name 2'
        },
        'ServiceHours' => '9-6, M-F',
        'ContactInstructions' => 'Email only',
        'Contacts' => [{
          'Type' => 'Email',
          'Value' => 'example@example.com'
        }, {
          'Type' => 'Email',
          'Value' => 'example2@example.com'
        }],
        'Addresses' => [{
          'StreetAddresses' => ['300 E Street Southwest', 'Room 203'],
          'City' => 'Washington',
          'StateProvince' => 'DC',
          'PostalCode' => '20546',
          'Country' => 'United States'
        }, {
          'StreetAddresses' => ['8800 Greenbelt Road'],
          'City' => 'Greenbelt',
          'StateProvince' => 'MD',
          'PostalCode' => '20771',
          'Country' => 'United States'
        }],
        'RelatedUrls' => [{
          'URLs' => ['http://example.com', 'http://another-example.com'],
          'Description' => 'Example Description',
          'Protocol' => 'FTP',
          'MimeType' => 'text/html',
          'Caption' => 'Example Caption 2',
          'Title' => 'Example Title',
          'FileSize' => {
            'Size' => 42,
            'Unit' => 'MB'
          },
          'ContentType' => {
            'Type' => 'Type',
            'Subtype' => 'Subtype'
          }
        }, {
          'URLs' => ['http://example1.com/1']
        }]
      }
    }, {
      'Role' => 'OWNER',
      'Party' => {
        'OrganizationName' => {
          'ShortName' => 'ORG_SHORT 3',
          'LongName' => 'Organization Long Name 3'
        },
        'ServiceHours' => '10-2, M-W',
        'ContactInstructions' => 'Email only',
        'Contacts' => [{
          'Type' => 'Email',
          'Value' => 'example@example.com'
        }, {
          'Type' => 'Email',
          'Value' => 'example2@example.com'
        }],
        'Addresses' => [{
          'StreetAddresses' => ['300 E Street Southwest', 'Room 203'],
          'City' => 'Washington',
          'StateProvince' => 'DC',
          'PostalCode' => '20546',
          'Country' => 'United States'
        }, {
          'StreetAddresses' => ['8800 Greenbelt Road'],
          'City' => 'Greenbelt',
          'StateProvince' => 'MD',
          'PostalCode' => '20771',
          'Country' => 'United States'
        }],
        'RelatedUrls' => [{
          'URLs' => ['http://example.com', 'http://another-example.com'],
          'Description' => 'Example Description',
          'Protocol' => 'FTP',
          'MimeType' => 'text/html',
          'Caption' => 'Example Caption 3',
          'Title' => 'Example Title',
          'FileSize' => {
            'Size' => 42,
            'Unit' => 'MB'
          },
          'ContentType' => {
            'Type' => 'Type',
            'Subtype' => 'Subtype'
          }
        }, {
          'URLs' => ['http://example2.com/1']
        }]
      }
    }],
    'Personnel' => [{
      'Role' => 'RESOURCEPROVIDER',
      'Party' => {
        'Person' => {
          'FirstName' => 'First Name',
          'MiddleName' => 'Middle Name',
          'LastName' => 'Last Name'
        },
        'ServiceHours' => '9-5, M-F',
        'ContactInstructions' => 'Email only',
        'Contacts' => [{
          'Type' => 'Email',
          'Value' => 'example@example.com'
        }, {
          'Type' => 'Email',
          'Value' => 'example2@example.com'
        }],
        'Addresses' => [{
          'StreetAddresses' => ['300 E Street Southwest', 'Room 203'],
          'City' => 'Washington',
          'StateProvince' => 'DC',
          'PostalCode' => '20546',
          'Country' => 'United States'
        }, {
          'StreetAddresses' => ['8800 Greenbelt Road'],
          'City' => 'Greenbelt',
          'StateProvince' => 'MD',
          'PostalCode' => '20771',
          'Country' => 'United States'
        }],
        'RelatedUrls' => [{
          'URLs' => ['http://example.com', 'http://another-example.com'],
          'Description' => 'Example Description',
          'Protocol' => 'FTP',
          'MimeType' => 'text/html',
          'Caption' => 'Example Caption',
          'Title' => 'Example Title',
          'FileSize' => {
            'Size' => 42,
            'Unit' => 'MB'
          },
          'ContentType' => {
            'Type' => 'Type',
            'Subtype' => 'Subtype'
          }
        }, {
          'URLs' => ['http://example.com/1']
        }]
      }
    }, {
      'Role' => 'OWNER',
      'Party' => {
        'Person' => {
          'FirstName' => 'First Name 2',
          'MiddleName' => 'Middle Name 2',
          'LastName' => 'Last Name 2'
        },
        'ServiceHours' => '10-2, M-W',
        'ContactInstructions' => 'Email only',
        'Contacts' => [{
          'Type' => 'Email',
          'Value' => 'example1@example.com'
        }, {
          'Type' => 'Email',
          'Value' => 'example2@example.com'
        }],
        'Addresses' => [{
          'StreetAddresses' => ['300 E Street Southwest', 'Room 203'],
          'City' => 'Washington',
          'StateProvince' => 'DC',
          'PostalCode' => '20546',
          'Country' => 'United States'
        }, {
          'StreetAddresses' => ['8800 Greenbelt Road'],
          'City' => 'Greenbelt',
          'StateProvince' => 'MD',
          'PostalCode' => '20771',
          'Country' => 'United States'
        }],
        'RelatedUrls' => [{
          'URLs' => ['http://example.com', 'http://another-example.com'],
          'Description' => 'Example Description',
          'Protocol' => 'FTP',
          'MimeType' => 'text/html',
          'Caption' => 'Example Caption',
          'Title' => 'Example Title',
          'FileSize' => {
            'Size' => 42,
            'Unit' => 'MB'
          },
          'ContentType' => {
            'Type' => 'Type',
            'Subtype' => 'Subtype'
          }
        }, {
          'URLs' => ['http://example.com/1']
        }]
      }
    }],
    'CollectionDataType' => 'SCIENCE_QUALITY',
    'ProcessingLevel' => {
      'Id' => 'Level 1A',
      'ProcessingLevelDescription' => 'Level 1 Description'
    },
    'CollectionCitations' => [{
      'Version' => 'v1',
      'Title' => 'Citation title',
      'Creator' => 'Citation creator',
      'Editor' => 'Citation editor',
      'SeriesName' => 'Citation series name',
      'ReleaseDate' => '2015-07-01T00:00:00Z',
      'ReleasePlace' => 'Citation release place',
      'Publisher' => 'Citation publisher',
      'IssueIdentification' => 'Citation issue identification',
      'DataPresentationForm' => 'Citation data presentation form',
      'OtherCitationDetails' => 'Citation other details',
      'DOI' => {
        'DOI' => 'Citation DOI',
        'Authority' => 'Citation DOI Authority'
      },
      'RelatedUrl' => {
        'URLs' => ['http://example.com', 'http://another-example.com'],
        'Description' => 'Example Description',
        'Protocol' => 'FTP',
        'MimeType' => 'text/html',
        'Caption' => 'Example Caption',
        'Title' => 'Example related URL Title 1',
        'FileSize' => {
          'Size' => 42,
          'Unit' => 'MB'
        },
        'ContentType' => {
          'Type' => 'Type',
          'Subtype' => 'Subtype'
        }
      }
    }, {
      'Version' => 'v2',
      'Title' => 'Citation title 1',
      'Creator' => 'Citation creator 1',
      'RelatedUrl' => {
        'URLs' => ['http://example2.com', 'http://another-example2.com'],
        'Description' => 'Example 2 Description',
        'Protocol' => 'FTP',
        'MimeType' => 'text/html',
        'Caption' => 'Example 2 Caption',
        'Title' => 'Example 2 related URL Title',
        'FileSize' => {
          'Size' => 42,
          'Unit' => 'MB'
        },
        'ContentType' => {
          'Type' => 'Type',
          'Subtype' => 'Subtype'
        }
      }
    }],
    'CollectionProgress' => 'IN WORK',
    'Quality' => 'Metadata quality summary',
    'UseConstraints' => 'These are some use constraints',
    'AccessConstraints' => {
      'Value' => 42,
      'Description' => 'Access constraint description'
    },
    'MetadataAssociations' => [{
      'Type' => 'SCIENCE ASSOCIATED',
      'Description' => 'Metadata association description',
      'EntryId' => '12345'
    }, {
      'Type' => 'LARGER CITATION WORKS',
      'EntryId' => '123abc'
    }],
    'PublicationReferences' => [{
      'Title' => 'Publication reference title',
      'Publisher' => 'Publication reference publisher',
      'DOI' => {
        'DOI' => 'Publication reference DOI',
        'Authority' => 'Publication reference authority'
      },
      'Author' => 'Publication reference author',
      'PublicationDate' => '2015-07-01T00:00:00Z',
      'Series' => 'Publication reference series',
      'Edition' => 'Publication reference edition',
      'Volume' => 'Publication reference volume',
      'Issue' => 'Publication reference issue',
      'ReportNumber' => 'Publication reference report number',
      'PublicationPlace' => 'Publication reference publication place',
      'Pages' => 'Publication reference pages',
      'ISBN' => '1234567890123',
      'OtherReferenceDetails' => 'Publication reference details',
      'RelatedUrl' => {
        'URLs' => ['http://example.com', 'http://another-example.com'],
        'Description' => 'Example Description',
        'Protocol' => 'FTP',
        'MimeType' => 'text/html',
        'Caption' => 'Example Caption',
        'Title' => 'Example URL Title',
        'FileSize' => {
          'Size' => 42,
          'Unit' => 'MB'
        },
        'ContentType' => {
          'Type' => 'Type',
          'Subtype' => 'Subtype'
        }
      }
    }, {
      'Title' => 'Publication reference title 1',
      'ISBN' => '9876543210987'
    }], 'ScienceKeywords' => [{
      'Category' => 'EARTH SCIENCE SERVICES',
      'Topic' => 'DATA ANALYSIS AND VISUALIZATION',
      'Term' => 'GEOGRAPHIC INFORMATION SYSTEMS'
    }, {
      'Category' => 'EARTH SCIENCE SERVICES',
      'Topic' => 'DATA ANALYSIS AND VISUALIZATION',
      'Term' => 'GEOGRAPHIC INFORMATION SYSTEMS',
      'VariableLevel1' => 'MOBILE GEOGRAPHIC INFORMATION SYSTEMS'
    }, {
      'Category' => 'EARTH SCIENCE SERVICES',
      'Topic' => 'DATA ANALYSIS AND VISUALIZATION',
      'Term' => 'GEOGRAPHIC INFORMATION SYSTEMS',
      'VariableLevel1' => 'DESKTOP GEOGRAPHIC INFORMATION SYSTEMS'
    }], 'AncillaryKeywords' => ['Ancillary keyword 1', 'Ancillary keyword 2'], 'AdditionalAttributes' => [{
      'Name' => 'Attribute 1',
      'Description' => 'Description',
      'DataType' => 'STRING',
      'MeasurementResolution' => 'Measurement Resolution',
      'ParameterRangeBegin' => 'Parameter Range Begin',
      'ParameterRangeEnd' => 'Parameter Range End',
      'ParameterUnitsOfMeasure' => 'Parameter Units Of Measure',
      'ParameterValueAccuracy' => 'Parameter Value Accuracy',
      'ValueAccuracyExplanation' => 'Value Accuracy Explanation',
      'Group' => 'Group',
      'UpdateDate' => '2015-09-14T00:00:00Z'
    }, {
      'Name' => 'Attribute 1',
      'DataType' => 'INT'
    }],
    'RelatedUrls' => [{
      'URLs' => ['http://example.com']
    }, {
      'Description' => 'test 1 Description', 'Protocol' => 'test 1 Protocol', 'URLs' => ['http://example.com/1', 'http://example.com/a'], 'Title' => 'test 1 Title', 'MimeType' => 'test 1 MimeType',
      'Caption' => 'test 1 Caption', 'FileSize' => {
        'Size' => 123, 'Unit' => 'Unt1'
      }, 'ContentType' => {
        'Type' => 'test 1 ContentType Type', 'Subtype' => 'test 1 ContentType Subtype'
      }
    }, {
      'Description' => 'test 2 Description', 'Protocol' => 'test 2 Protocol', 'URLs' => ['http://example.com/2', 'http://example.com/b'], 'Title' => 'test 2 Title', 'MimeType' => 'test 2 MimeType',
      'Caption' => 'test 2 Caption', 'FileSize' => {
        'Size' => 321, 'Unit' => 'Unt2'
      }, 'ContentType' => {
        'Type' => 'test 2 ContentType Type', 'Subtype' => 'test 2 ContentType Subtype'
      }
    }],
    'Distributions' => [{}, {
      'DistributionMedia' => 'test 2 DistributionMedia', 'DistributionSize' => 42, 'DistributionFormat' => 'test 2 DistributionFormat', 'Fees' => '1234.56'
    }, {
      'DistributionMedia' => 'test 1 DistributionMedia', 'DistributionSize' => 43, 'DistributionFormat' => 'test 1 DistributionFormat', 'Fees' => '1234.56'
    }],
    'MetadataLanguage' => 'eng',
    'MetadataDates' => [{
      'Type' => 'CREATE',
      'Date' => '2010-12-25T00:00:00Z'
    }, {
      'Type' => 'REVIEW',
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
            'WestBoundingCoordinate' => -180.0,
            'NorthBoundingCoordinate' => 90.0,
            'EastBoundingCoordinate' => 180.0,
            'SouthBoundingCoordinate' => -90.0
          }, {
            'WestBoundingCoordinate' => -96.9284587,
            'NorthBoundingCoordinate' => 58.968602,
            'EastBoundingCoordinate' => -56.9284587,
            'SouthBoundingCoordinate' => 18.968602
          }]
        }
      },
      'VerticalSpatialDomains' => [{
        'Type' => 'test Type 1', 'Value' => 'test Value 1'
      }, {
        'Type' => 'test Type 2', 'Value' => 'test Value 2'
      }],
      'OrbitParameters' => {
        'SwathWidth' => 40, 'Period' => 50, 'InclinationAngle' => 60, 'NumberOfOrbits' => 70, 'StartCircularLatitude' => 0.0
      },
      'GranuleSpatialRepresentation' => 'CARTESIAN'
    },
    'TilingIdentificationSystem' => {
      'TilingIdentificationSystemName' => 'System name',
      'Coordinate1' => {
        'MinimumValue' => -50, 'MaximumValue' => 50
      },
      'Coordinate2' => {
        'MinimumValue' => -30, 'MaximumValue' => 30
      }
    },
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
    'SpatialKeywords' => ['f47ac10b-58cc-4372-a567-0e02b2c3d479', 'abdf4d5c-55dc-4324-9ae5-5adf41e99da3'],
    'TemporalExtents' => [{
        'TemporalRangeType' => 'SingleDateTime', 'PrecisionOfSeconds' => 1, 'EndsAtPresentFlag' => false, 'SingleDateTimes' => ['2015-07-01T00:00:00Z', '2015-12-25T00:00:00Z']
      },

      {
        'TemporalRangeType' => 'RangeDateTime', 'PrecisionOfSeconds' => 10, 'EndsAtPresentFlag' => false, 'RangeDateTimes' => [{
          'BeginningDateTime' => '2014-07-01T00:00:00Z', 'EndingDateTime' => '2014-08-01T00:00:00Z'
        }, {
          'BeginningDateTime' => '2015-07-01T00:00:00Z', 'EndingDateTime' => '2015-08-01T00:00:00Z'
        }]
      },

      {
        'TemporalRangeType' => 'PeriodicDateTime', 'PrecisionOfSeconds' => 30, 'EndsAtPresentFlag' => false,
        'PeriodicDateTimes' => [{
          'Name' => 'test 1 Periodic Extent', 'StartDate' => '2015-07-01T00:00:00Z', 'EndDate' => '2015-08-01T00:00:00Z', 'DurationUnit' => 'DAY', 'DurationValue' => 5, 'PeriodCycleDurationUnit' => 'DAY', 'PeriodCycleDurationValue' => 1
        }, {
          'Name' => 'test 2 Periodic Extent', 'StartDate' => '2016-07-01T00:00:00Z', 'EndDate' => '2016-08-01T00:00:00Z', 'DurationUnit' => 'MONTH', 'DurationValue' => 4, 'PeriodCycleDurationUnit' => 'MONTH', 'PeriodCycleDurationValue' => 2
        }, ]
      }
    ],
    'TemporalKeywords' => ['test 1 Keyword', 'test 2 Keyword'],
    'PaleoTemporalCoverage' => {
      'StartDate' => '50 Ga', 'EndDate' => '25 Ga',
      'ChronostratigraphicUnits' => [{
        'Eon' => 'test 1 Eon', 'Era' => 'test 1 Era', 'Epoch' => 'test 1 Epoch', 'Stage' => 'test 1 Stage',
        'DetailedClassification' => 'test 1 Detailed Classification', 'Period' => 'test 1 Period'
      }, {
        'Eon' => 'test 2 Eon', 'Era' => 'test 2 Era', 'Epoch' => 'test 2 Epoch', 'Stage' => 'test 2 Stage',
        'DetailedClassification' => 'test 2 Detailed Classification', 'Period' => 'test 2 Period'
      }, {
        'Eon' => 'test 3 Eon text 1'
      }]
    },
    "ISOTopicCategories" => ["farming", "climatologyMeteorologyAtmosphere", "health"]
  end
end
