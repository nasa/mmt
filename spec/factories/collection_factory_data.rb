# frozen_string_literal: true

# minimum required fields
def all_required_fields
  {
    'Platforms' => [{
      'Type'      => 'Aircraft',
      'ShortName' => 'A340-600',
      'LongName'  => 'Airbus A340-600',
    }],
    'Abstract' => 'This is a long description of the collection',
    'ShortName' => '12345',
    'Version' => '1',
    'EntryTitle' => 'Required Fields Only Draft',
    'DOI' => {
      'DOI'       => 'Citation DOI'
    },
    'CollectionProgress' => 'ACTIVE',
    'DataCenters' => [{
      'Roles' => ['DISTRIBUTOR'],
      'ShortName' => 'AARHUS-HYDRO',
      'LongName' => 'Hydrogeophysics Group, Aarhus University ' # controlled keywords source has extra space at the end
    }],
    'ProcessingLevel' => {
      'Id' => '1A',
      'ProcessingLevelDescription' => 'Level 1 Description'
    },
    'ScienceKeywords' => [{
      'Category' => 'EARTH SCIENCE',
      'Topic' => 'ATMOSPHERE',
      'Term' => 'ATMOSPHERIC TEMPERATURE'
    }],
    'SpatialExtent' => {
      'GranuleSpatialRepresentation' => 'CARTESIAN'
    },
    'TemporalExtents' => [{
      'PrecisionOfSeconds' => 1,
      'EndsAtPresentFlag' => false,
      'SingleDateTimes' => ['2015-07-01T00:00:00Z', '2015-12-25T00:00:00Z']
    }]
  }
end

# This function returns a full metadata hash that does not include: ShortName,
# Version, EntryTitle, CollectionDataType, or any field which may be specific
# to a derivative draft style (e.g. TemplateName).

def collection_one
  {
    'Projects' => [{
      'ShortName' => 'AA',
      'LongName'  => 'ARCATLAS',
      'Campaigns' => ['test 1a Campaign', 'test 1b Campaign'],
      'StartDate' => '2015-07-01T00:00:00Z',
      'EndDate'   => '2015-12-25T00:00:00Z'
    }, {
      'ShortName' => 'EUDASM',
      'LongName'  => 'European Digital Archive of Soil Maps',
      'Campaigns' => ['test 2a Campaign', 'test 2b Campaign'],
      'StartDate' => '2015-07-01T00:00:00Z',
      'EndDate'   => '2015-12-25T00:00:00Z'
    }],
    'Platforms' => [{
      'Type'      => 'Aircraft',
      'ShortName' => 'A340-600',
      'LongName'  => 'Airbus A340-600',
      'Characteristics' => [{
        'Name'        => 'test 1 PC Name',
        'Description' => 'test 1 PC Description',
        'Value'       => 'test 1 PC Value',
        'Unit'        => 'test 1 PC Unit',
        'DataType'    => 'STRING'
      }, {
        'Name'        => 'test 2 PC Name',
        'Description' => 'test 2 PC Description',
        'Value'       => 'test 2 PC Value',
        'Unit'        => 'test 2 PC Unit',
        'DataType'    => 'STRING'
      }],
      'Instruments' => [{
        'ShortName' => 'ATM',
        'LongName'  => 'Airborne Topographic Mapper',
        'Characteristics' => [{
          'Name'        => 'test 1 PI Name',
          'Description' => 'test 1 PI Description',
          'Value'       => 'test 1 PI Value',
          'Unit'        => 'test 1 PI Unit',
          'DataType'    => 'STRING'
        }, {
          'Name'        => 'test 2 PI Name',
          'Description' => 'test 2 PI Description',
          'Value'       => 'test 2 PI Value',
          'Unit'        => 'test 2 PI Unit',
          'DataType'    => 'STRING'
        }],
        'Technique'       => 'test 1 PI Technique',
        'NumberOfInstruments' => 234,
        'ComposedOf' => [{
          'ShortName' => 'ADS',
          'LongName'  => 'Automated DNA Sequencer',
          'Technique' => 'test 1 PS Technique',
          'Characteristics' => [{
            'Name'        => 'test 1 PS Name',
            'Description' => 'test 1 PS Description',
            'Value'       => 'test 1 PS Value',
            'Unit'        => 'test 1 PS Unit',
            'DataType'    => 'STRING'
          }, {
            'Name'        => 'test 2 PS Name',
            'Description' => 'test 2 PS Description',
            'Value'       => 'test 2 PS Value',
            'Unit'        => 'test 2 PS Unit',
            'DataType'    => 'STRING'
          }]
        }, {
          'ShortName' => 'SMAP L-BAND RADIOMETER',
          'LongName'  => 'SMAP L-Band Radiometer',
          'Technique' => 'test 1b PS Technique',
          'Characteristics' => [{
            'Name'        => 'test 1b PS Name',
            'Description' => 'test 1b PS Description',
            'Value'       => 'test 1b PS Value',
            'Unit'        => 'test 1b PS Unit',
            'DataType'    => 'STRING'
          }, {
            'Name'        => 'test 2b PS Name',
            'Description' => 'test 2b PS Description',
            'Value'       => 'test 2b PS Value',
            'Unit'        => 'test 2b PS Unit',
            'DataType'    => 'STRING'
          }]
        }],
        'OperationalModes' => ['test 1a Op', 'test 1b Op']
      }, {
        'ShortName' => 'LVIS',
        'LongName'  => 'Land, Vegetation, and Ice Sensor',
        'Characteristics' => [{
          'Name'        => 'test 1d PI Name',
          'Description' => 'test 1d PI Description',
          'Value'       => 'test 1d PI Value',
          'Unit'        => 'test 1d PI Unit',
          'DataType'    => 'STRING'
        }, {
          'Name'        => 'test 2d PI Name',
          'Description' => 'test 2d PI Description',
          'Value'       => 'test 2d PI Value',
          'Unit'        => 'test 2d PI Unit',
          'DataType'    => 'STRING'
        }],
        'Technique'       => 'test 1d PI Technique',
        'NumberOfInstruments' => 345,
        'ComposedOf' => [{
          'ShortName' => 'ADS',
          'LongName'  => 'Automated DNA Sequencer',
          'Technique' => 'test 1d PS Technique',
          'Characteristics' => [{
            'Name'        => 'test 1d PS Name',
            'Description' => 'test 1d PS Description',
            'Value'       => 'test 1d PS Value',
            'Unit'        => 'test 1d PS Unit',
            'DataType'    => 'STRING'
          }, {
            'Name'        => 'test 2d PS Name',
            'Description' => 'test 2d PS Description',
            'Value'       => 'test 2d PS Value',
            'Unit'        => 'test 2d PS Unit',
            'DataType'    => 'STRING'
          }]
        }, {
          'ShortName' => 'SMAP L-BAND RADIOMETER',
          'LongName'  => 'SMAP L-Band Radiometer',
          'Technique' => 'test 1db PS Technique',
          'Characteristics' => [{
            'Name'        => 'test 1db PS Name',
            'Description' => 'test 1db PS Description',
            'Value'       => 'test 1db PS Value',
            'Unit'        => 'test 1db PS Unit',
            'DataType'    => 'STRING'
          }, {
            'Name'        => 'test 2db PS Name',
            'Description' => 'test 2db PS Description',
            'Value'       => 'test 2db PS Value',
            'Unit'        => 'test 2db PS Unit',
            'DataType'    => 'STRING'
          }]
        }],
        'OperationalModes' => ['test 1da Op', 'test 1db Op']
      }]
    }, {
      'Type'      => 'Earth Observation Satellites',
      'ShortName' => 'SMAP',
      'LongName'  => 'Soil Moisture Active and Passive Observatory',
      'Characteristics' => [{
        'Name'        => 'test a1 PC Name',
        'Description' => 'test a1 PC Description',
        'Value'       => 'test a1 PC Value',
        'Unit'        => 'test a1 PC Unit',
        'DataType'    => 'STRING'
      }, {
        'Name'        => 'test a2 PC Name',
        'Description' => 'test a2 PC Description',
        'Value'       => 'test a2 PC Value',
        'Unit'        => 'test a2 PC Unit',
        'DataType'    => 'STRING'
      }],
      'Instruments' => [{
        'ShortName' => 'ADS',
        'LongName'  => 'Automated DNA Sequencer',
        'Characteristics' => [{
          'Name'        => 'test a1 PI Name',
          'Description' => 'test a1 PI Description',
          'Value'       => 'test a1 PI Value',
          'Unit'        => 'test a1 PI Unit',
          'DataType'    => 'STRING'
        }, {
          'Name'        => 'test a2 PI Name',
          'Description' => 'test a2 PI Description',
          'Value'       => 'test a2 PI Value',
          'Unit'        => 'test a2 PI Unit',
          'DataType'    => 'STRING'
        }],
        'Technique'       => 'test a1 PI Technique',
        'NumberOfInstruments' => 456,
        'ComposedOf' => [{
          'ShortName' => 'ADS',
          'LongName'  => 'Automated DNA Sequencer',
          'Technique' => 'test a1 PS Technique',
          'Characteristics' => [{
            'Name'        => 'test a1 PS Name',
            'Description' => 'test a1 PS Description',
            'Value'       => 'test a1 PS Value',
            'Unit'        => 'test a1 PS Unit',
            'DataType'    => 'STRING'
          }, {
            'Name'        => 'test a2 PS Name',
            'Description' => 'test a2 PS Description',
            'Value'       => 'test a2 PS Value',
            'Unit'        => 'test a2 PS Unit',
            'DataType'    => 'STRING'
          }]
        }, {
          'ShortName' => 'SMAP L-BAND RADIOMETER',
          'LongName'  => 'SMAP L-Band Radiometer',
          'Technique' => 'test a1b PS Technique',
          'Characteristics' => [{
            'Name'        => 'test a1b PS Name',
            'Description' => 'test a1b PS Description',
            'Value'       => 'test a1b PS Value',
            'Unit'        => 'test a1b PS Unit',
            'DataType'    => 'STRING'
          }, {
            'Name'        => 'test a2b PS Name',
            'Description' => 'test a2b PS Description',
            'Value'       => 'test a2b PS Value',
            'Unit'        => 'test a2b PS Unit',
            'DataType'    => 'STRING'
          }]
        }],
        'OperationalModes' => ['test a1a Op', 'test a1b Op']
      }, {
        'ShortName' => 'SMAP L-BAND RADIOMETER',
        'LongName'  => 'SMAP L-Band Radiometer',
        'Characteristics' => [{
          'Name'        => 'test a1d PI Name',
          'Description' => 'test a1d PI Description',
          'Value'       => 'test a1d PI Value',
          'Unit'        => 'test a1d PI Unit',
          'DataType'    => 'STRING'
        }, {
          'Name'        => 'test a2d PI Name',
          'Description' => 'test a2d PI Description',
          'Value'       => 'test a2d PI Value',
          'Unit'        => 'test a2d PI Unit',
          'DataType'    => 'STRING'
        }],
        'Technique'       => 'test a1d PI Technique',
        'NumberOfInstruments' => 567,
        'ComposedOf' => [{
          'ShortName' => 'ADS',
          'LongName'  => 'Automated DNA Sequencer',
          'Technique' => 'test a1d PS Technique',
          'Characteristics' => [{
            'Name'        => 'test a1d PS Name',
            'Description' => 'test a1d PS Description',
            'Value'       => 'test a1d PS Value',
            'Unit'        => 'test a1d PS Unit',
            'DataType'    => 'STRING'
          }, {
            'Name'        => 'test a2d PS Name',
            'Description' => 'test a2d PS Description',
            'Value'       => 'test a2d PS Value',
            'Unit'        => 'test a2d PS Unit',
            'DataType'    => 'STRING'
          }]
        }, {
          'ShortName' => 'SMAP L-BAND RADIOMETER',
          'LongName'  => 'SMAP L-Band Radiometer',
          'Technique' => 'test a1db PS Technique',
          'Characteristics' => [{
            'Name'        => 'test a1db PS Name',
            'Description' => 'test a1db PS Description',
            'Value'       => 'test a1db PS Value',
            'Unit'        => 'test a1db PS Unit',
            'DataType'    => 'STRING'
          }, {
            'Name'        => 'test a2db PS Name',
            'Description' => 'test a2db PS Description',
            'Value'       => 'test a2db PS Value',
            'Unit'        => 'test a2db PS Unit',
            'DataType'    => 'STRING'
          }]
        }],
        'OperationalModes' => ['test a1da Op', 'test a1db Op']
      }]
    }],
    'Abstract'     => 'This is a long description of the collection',
    'VersionDescription' => 'Version 1 Description',
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
          'Description' => 'Related URL 1 Description',
          'URLContentType' => 'DataCenterURL',
          'Type' => 'HOME PAGE',
          'URL' => 'http://example.com/'
        }, {
          'Description' => 'Related URL 2 Description',
          'URLContentType' => 'DataCenterURL',
          'Type' => 'HOME PAGE',
          'URL' => 'http://example.com/2'
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
          'Description' => 'Related URL 1 Description',
          'URLContentType' => 'DataCenterURL',
          'Type' => 'HOME PAGE',
          'URL' => 'http://example.com/'
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
            'Description' => 'Related URL 1 Description',
            'URLContentType' => 'DataContactURL',
            'Type' => 'HOME PAGE',
            'URL' => 'http://example.com/'
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
            'Description' => 'Related URL 1 Description',
            'URLContentType' => 'DataContactURL',
            'Type' => 'HOME PAGE',
            'URL' => 'http://example.com/'
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
          'Description' => 'Related URL 1 Description',
          'URLContentType' => 'DataContactURL',
          'Type' => 'HOME PAGE',
          'URL' => 'http://example.com/'
        }, {
          'Description' => 'Related URL 2 Description',
          'URLContentType' => 'DataContactURL',
          'Type' => 'HOME PAGE',
          'URL' => 'http://example.com/2'
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
          'Description' => 'Related URL 1 Description',
          'URLContentType' => 'DataContactURL',
          'Type' => 'HOME PAGE',
          'URL' => 'http://example.com/'
        }, {
          'Description' => 'Related URL 2 Description',
          'URLContentType' => 'DataContactURL',
          'Type' => 'HOME PAGE',
          'URL' => 'http://example.com/2'
        }]
      }
    }],
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
    'AssociatedDOIs' => [{
      'DOI'       => 'Associated DOI',
      'Title'     => 'Associated DOI Title',
      'Authority' => 'Associated DOI Authority'
    }],
    'CollectionProgress' => 'ACTIVE',
    'Quality'            => 'Metadata quality summary',
    'UseConstraints' => {
      'Description' => 'These are some use constraints',
      'LicenseURL' => {
        'Linkage' => 'http://example.com'
      }
    },
    'AccessConstraints' => {
      'Value'       => 42,
      'Description' => 'Access constraint description'
    },
    'MetadataAssociations' => [{
      'Type'        => 'SCIENCE ASSOCIATED',
      'EntryId'     => '12345',
      'Description' => 'Metadata association description',
      'Version'     => '23'
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
      'Category'       => 'EARTH SCIENCE',
      'Topic'          => 'ATMOSPHERE',
      'Term'           => 'ATMOSPHERIC TEMPERATURE',
      'VariableLevel1' => 'SURFACE TEMPERATURE',
      'VariableLevel2' => 'MAXIMUM/MINIMUM TEMPERATURE',
      'VariableLevel3' => '24 HOUR MAXIMUM TEMPERATURE'
    }, {
      'Category'       => 'EARTH SCIENCE',
      'Topic'          => 'SOLID EARTH',
      'Term'           => 'ROCKS/MINERALS/CRYSTALS',
      'VariableLevel1' => 'SEDIMENTARY ROCKS',
      'VariableLevel2' => 'SEDIMENTARY ROCK PHYSICAL/OPTICAL PROPERTIES',
      'VariableLevel3' => 'LUMINESCENCE'
    }],
    'AncillaryKeywords' => ['Ancillary keyword 1', 'Ancillary keyword 2'],
    'AdditionalAttributes' => [{
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
      'Description' => 'Related URL 1 Description',
      'URLContentType' => 'CollectionURL',
      'Type' => 'DATA SET LANDING PAGE',
      'URL' => 'http://example.com/'
    }, {
      'Description' => 'Related URL 2 Description',
      'URLContentType' => 'DistributionURL',
      'Type' => 'GET DATA',
      'Subtype' => 'Earthdata Search',
      'URL' => 'https://search.earthdata.nasa.gov/',
      'GetData' => {
        'Format' => 'JPEG',
        'MimeType' => 'Not provided',
        'Size' => 42,
        'Unit' => 'KB',
        'Fees' => '0',
        'Checksum' => 'sdfgfgksghafgsdvbasf'
      }
    }, {
      'Description' => 'Related URL 3 Description',
      'URLContentType' => 'DistributionURL',
      'Type' => 'USE SERVICE API',
      'Subtype' => 'OPENDAP DATA',
      'URL' => 'https://example.com/',
      'GetService' => {
        'Format' => 'ascii',
        'MimeType' => 'Not provided',
        'Protocol' => 'HTTPS',
        'FullName' => 'Earthdata Search',
        'DataID' => 'data_id',
        'DataType' => 'data type',
        'URI' => ['uri']
      }
    }, {
      'Description' => 'This is data citation policy',
      'URLContentType' => 'PublicationURL',
      'Type' => 'VIEW RELATED INFORMATION',
      'Subtype' => 'DATA CITATION POLICY',
      'URL' => 'https://example.com/data-citation-policy'
    }, {
      'Description' => 'This is general documentation',
      'URLContentType' => 'PublicationURL',
      'Type' => 'VIEW RELATED INFORMATION',
      'Subtype' => 'GENERAL DOCUMENTATION',
      'URL' => 'https://example.com/documentation-1'
    }, {
      'Description' => 'This is how-to documentation',
      'URLContentType' => 'PublicationURL',
      'Type' => 'VIEW RELATED INFORMATION',
      'Subtype' => 'HOW-TO',
      'URL' => 'https://example.com/documentation-2'
    }, {
      'Description' => 'This is anomalies documentation',
      'URLContentType' => 'PublicationURL',
      'Type' => 'VIEW RELATED INFORMATION',
      'Subtype' => 'ANOMALIES',
      'URL' => 'https://example.com/documentation-3'
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
      'GranuleSpatialRepresentation' => 'CARTESIAN',
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
        },
        'ResolutionAndCoordinateSystem': {
          'Description': 'ResolutionAndCoordinateSystem Description',
          'GeodeticModel': {
            'HorizontalDatumName': 'HorizontalDatumName Text',
            'EllipsoidName': 'EllipsoidName Text',
            'SemiMajorAxis': 1.0,
            'DenominatorOfFlatteningRatio': 1.0
          },
          'HorizontalDataResolution': {
            'VariesResolution': 'Varies',
            'PointResolution': 'Point',
            'NonGriddedResolutions': [{
              'XDimension': 1,
              'YDimension': 2,
              'Unit': 'Meters',
              'ViewingAngleType': 'At Nadir',
              'ScanDirection': 'Cross Track'
            }],
            'NonGriddedRangeResolutions': [{
              'MinimumXDimension': 3,
              'MinimumYDimension': 4,
              'MaximumXDimension': 5,
              'MaximumYDimension': 6,
              'Unit': 'Meters',
              'ViewingAngleType': 'At Nadir',
              'ScanDirection': 'Cross Track'
            }],
            'GriddedResolutions': [{
              'XDimension': 7,
              'Unit': 'Meters'
            }, {
              'YDimension': 8,
              'Unit': 'Decimal Degrees'
            }],
            'GriddedRangeResolutions': [{
              'MinimumXDimension': 9,
              'MaximumXDimension': 10,
              'Unit': 'Meters'
            }],
            'GenericResolutions': [{
              'XDimension': 11,
              'Unit': 'Decimal Degrees'
            }]
          },
        },
      },
    },
    'TilingIdentificationSystems' => [{
      'TilingIdentificationSystemName' => 'MISR',
      'Coordinate1' => {
        'MinimumValue' => -50, 'MaximumValue' => 50
      },
      'Coordinate2' => {
        'MinimumValue' => -30, 'MaximumValue' => 30
      }
    }, {
      'TilingIdentificationSystemName' => 'MODIS Tile EASE',
      'Coordinate1' => {
        'MinimumValue' => -25, 'MaximumValue' => 25
      },
      'Coordinate2' => {
        'MinimumValue' => -15, 'MaximumValue' => 15
      }
    }],
    'SpatialInformation' => {
      'SpatialCoverageType' => 'VERTICAL',
      'VerticalCoordinateSystem' => {
        'AltitudeSystemDefinition' => {
          'DatumName' => 'Datum',
          'DistanceUnits' => 'HectoPascals',
          'Resolutions' => [1.0, 2.0, 3.0]
        },
        'DepthSystemDefinition' => {
          'DatumName' => 'Datum 2',
          'DistanceUnits' => 'Fathoms',
          'Resolutions' => [12.0, 22.0, 32.0]
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
      'PrecisionOfSeconds' => 1,
      'EndsAtPresentFlag'  => false,
      'SingleDateTimes'    => ['2015-07-01T00:00:00Z', '2015-12-25T00:00:00Z']
    }, {
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
    'ISOTopicCategories' => %w[farming climatologyMeteorologyAtmosphere health],
    'ArchiveAndDistributionInformation' => {
      'FileArchiveInformation' => [
        {
          'Format' => 'kml',
          'FormatType' => 'Native',
          'FormatDescription' => 'A format description',
          'AverageFileSize' => 2,
          'AverageFileSizeUnit' => 'MB',
          'TotalCollectionFileSize' => 25,
          'TotalCollectionFileSizeUnit' => 'GB',
          'Description' => 'A file archive information description'
        },
        {
          'Format' => 'jpeg',
          'FormatType' => 'Supported',
          'FormatDescription' => 'A format description',
          'AverageFileSize' => 3,
          'AverageFileSizeUnit' => 'MB',
          'TotalCollectionFileSize' => 99,
          'TotalCollectionFileSizeUnit' => 'TB',
          'Description' => 'Another file archive information description'
        }
      ],
      'FileDistributionInformation' => [
        {
          'Format' => 'tiff',
          'FormatType' => 'Native',
          'FormatDescription' => 'A format description',
          'Media' => [
            'disc', 'file', 'online'
          ],
          'AverageFileSize' => 2,
          'AverageFileSizeUnit' => 'KB',
          'TotalCollectionFileSize' => 10,
          'TotalCollectionFileSizeUnit' => 'TB',
          'Description' => 'File distribution information description',
          'Fees' => '$2,900'
        }
      ]
    },
    'DirectDistributionInformation' => {
      'Region' => 'us-east-2',
      'S3BucketAndObjectPrefixNames' => [
        'prefix-1',
        'prefix-2',
        'prefix-3'
      ],
      'S3CredentialsAPIEndpoint' => 'link.com',
      'S3CredentialsAPIDocumentationURL' => 'amazon.com'
    }
  }
end
