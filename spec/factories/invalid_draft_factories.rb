FactoryGirl.define do
  # This is a valid factory, used to test to make sure all the factories
  # that use all_required_fields will work
  factory :draft_all_required_fields, class: Draft do
    native_id 'required_fields_draft_id'
    provider_id 'MMT_2'
    draft { all_required_fields }
  end

  factory :draft do
    # Empty draft
    provider_id 'MMT_2'
  end

  factory :mmt_1_draft, class: Draft do
    provider_id 'MMT_1'
  end

  # Will trigger required fields error for data identification required fields
  factory :draft_missing_required_fields, class: Draft do
    draft 'ShortName' => '12345'
  end

  factory :draft_nested_required_field, class: Draft do
    draft {
      all_required_fields.merge(
        'RelatedUrls' => [{
          'Description' => 'description'
        }]
      )
    }
  end

  factory :draft_field_too_long, class: Draft do
    draft {
      all_required_fields.merge(
        'ShortName' => "#{'a' * 81}"
      )
    }
  end

  factory :draft_field_too_high, class: Draft do
    draft {
      all_required_fields.merge(
        'SpatialExtent' => {
          'GranuleSpatialRepresentation' => 'CARTESIAN',
          'SpatialCoverageType' => 'HORIZONTAL',
          'HorizontalSpatialDomain' => {
            'ZoneIdentifier' => 'Zone ID',
            'Geometry' => {
              'CoordinateSystem' => 'CARTESIAN',
              'Points' => [{
                'Longitude' => 700, 'Latitude' => 38.805407
              }]
            }
          }
        }
      )
    }
  end

  factory :draft_field_invalid_date, class: Draft do
    draft {
      all_required_fields.merge(
        'DataDates' => [{
          'Type' => 'CREATE',
          'Date' => '2015-07-01'
        }]
      )
    }
  end

  factory :draft_field_invalid_pattern, class: Draft do
    draft {
      all_required_fields.merge(
        'DataCenters' => [{
          'Roles' => ['DISTRIBUTOR'],
          'ShortName' => 'AARHUS-HYDRO',
          'LongName' => 'Hydrogeophysics Group, Aarhus University '
        }]
      )
    }
  end

  factory :draft_field_invalid_uri, class: Draft do
    draft {
      all_required_fields.merge(
        'RelatedUrls' => [{
          'URLs' => ['this is invalid']
        }]
      )
    }
  end

  factory :draft_invalid_picklists, class: Draft do
    native_id 'invalid_picklists_draft_id'
    provider_id 'MMT_2'
    draft {
      all_required_fields.merge(
        'ShortName' => 'Invalid Picklists',
        'EntryTitle' => 'Invalid Picklist Draft',
        'ProcessingLevel' => {
          'Id' => '5'
        },
        'RelatedUrls' => [{
          'URLContentType' => 'badcontenttype'
        }, {
          'URLContentType' => 'DistributionURL',
          'Type' => 'GET SERVICE',
          'Subtype' => 'EARTHDATA SEARCH',
          'GetService' => {
            'MimeType' => 'badmimetype',
            'Protocol' => 'badprotocol'
          }
        }, {
          'URLContentType' => 'DistributionURL',
          'Type' => 'GET DATA',
          'Subtype' => 'DIF',
          'GetData' => {
            'Format' => 'badformat',
            'Unit' => 'badunit'
          }
        }],
        'Distributions' => [{
          'Sizes' => [{
            'Unit' => 'bits'
          }]
        }],
        'DataLanguage' => 'english',
        'MetadataLanguage' => 'english',
        'Platforms' => [{
          'Type' => 'satellites',
          'ShortName' => 'test 1 P ShortName',
          'LongName' => 'test 1 P LongName'
        }],
        'DataCenters' => [{
          'Roles' => ['bad data center role'],
          'ShortName' => 'short_name',
          'LongName' => 'Long Name',
          'ContactInformation' => {
            'ContactMechanisms' => [{
              'Type' => 'bad contact mechanism type',
              'Value' => 'contactmech@email.com'
            }],
            'Addresses' => [{
              'Country' => 'usa'
            }, {
              'Country' => 'United States',
              'StateProvince' => 'maryland'
            }]
          },
          'ContactPersons' => [{
            'Roles' => ['bad data center contact person role'],
            'LastName' => 'Last Name',
            'ContactInformation' => {
              'ContactMechanisms' => [{
                'Type' => 'bad contact mechanism type',
                'Value' => 'contactmech@email.com'
              }],
              'Addresses' => [{
                'Country' => 'usa'
              }, {
                'Country' => 'United States',
                'StateProvince' => 'maryland'
              }]
            }
          }],
          'ContactGroups' => [{
            'Roles' => ['bad data center contact group role'],
            'GroupName' => 'Group Name',
            'ContactInformation' => {
              'ContactMechanisms' => [{
                'Type' => 'bad contact mechanism type',
                'Value' => 'contactmech@email.com'
              }],
              'Addresses' => [{
                'Country' => 'usa'
              }, {
                'Country' => 'United States',
                'StateProvince' => 'maryland'
              }]
            }
          }]
        }],
        'ContactPersons' => [{
          'Roles' => ['bad non dc contact person role'],
          'LastName' => 'Last Name',
          'ContactInformation' => {
            'ContactMechanisms' => [{
              'Type' => 'bad contact mechanism type',
              'Value' => 'contactmech@email.com'
            }],
            'Addresses' => [{
              'Country' => 'usa'
            }, {
              'Country' => 'United States',
              'StateProvince' => 'maryland'
            }]
          }
        }],
        'ContactGroups' => [{
          'Roles' => ['bad non dc contact group role'],
          'GroupName' => 'Group Name',
          'ContactInformation' => {
            'ContactMechanisms' => [{
              'Type' => 'bad contact mechanism type',
              'Value' => 'contactmech@email.com'
            }],
            'Addresses' => [{
              'Country' => 'usa'
            }, {
              'Country' => 'United States',
              'StateProvince' => 'maryland'
            }]
          }
        }],
        'TemporalKeywords' => ['Keyword 1', 'Keyword 2'],
        'SpatialExtent' => {
          'GranuleSpatialRepresentation' => 'cartesian'
        },
        'CollectionProgress' => 'inwork'
      )
    }
  end
end

def all_required_fields
  {
    'Platforms' => [{
      'Type' => 'Earth Observation Satellites',
      'ShortName' => 'test 1 P ShortName',
      'LongName' => 'test 1 P LongName'
    }],
    'Abstract' => 'This is a long description of the collection',
    'ShortName' => '12345',
    'Version' => '1',
    'EntryTitle' => 'Required Fields Only Draft',
    'CollectionProgress' => 'IN WORK',
    'DataCenters' => [{
      'Roles' => ['DISTRIBUTOR'],
      'ShortName' => 'AARHUS-HYDRO',
      'LongName' => 'Hydrogeophysics Group, Aarhus University ' # controlled keywords source has extra space at the end
    }],
    'ProcessingLevel' => {
      'Id' => '5',
      'ProcessingLevelDescription' => 'Level 5 Description'
    },
    'ScienceKeywords' => [{
      'Category' => 'EARTH SCIENCE SERVICES',
      'Topic' => 'DATA ANALYSIS AND VISUALIZATION',
      'Term' => 'GEOGRAPHIC INFORMATION SYSTEMS'
    }],
    'SpatialExtent' => {
      'GranuleSpatialRepresentation' => 'CARTESIAN'
    },
    'TemporalExtents' => [{
      'TemporalRangeType' => 'SingleDateTime',
      'PrecisionOfSeconds' => 1,
      'EndsAtPresentFlag' => false,
      'SingleDateTimes' => ['2015-07-01T00:00:00Z', '2015-12-25T00:00:00Z']
    }]
  }
end
