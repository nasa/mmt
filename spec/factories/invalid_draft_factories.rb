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

  # Will trigger required fields error for data identification required fields
  factory :draft_missing_required_fields, class: Draft do
    draft 'ShortName' => '12345'
  end

  factory :draft_nested_required_field, class: Draft do
    draft { all_required_fields.merge('RelatedUrls' => [{
        'Description' => 'description'
      }])
    }
  end

  factory :draft_field_too_long, class: Draft do
    draft { all_required_fields.merge('ShortName' => "#{'a' * 81}") }
  end

  factory :draft_field_too_high, class: Draft do
    draft { all_required_fields.merge('SpatialExtent' => {
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
      })
    }
  end

  factory :draft_field_invalid_date, class: Draft do
    draft { all_required_fields.merge('DataDates' => [{
        'Type' => 'CREATE',
        'Date' => '2015-07-01'
      }])
    }
  end

  factory :draft_field_invalid_pattern, class: Draft do
    draft { all_required_fields.merge('Organizations' => [{
        'Role' => 'RESOURCEPROVIDER',
        'Party' => {
          'OrganizationName' => {
            'ShortName' => 'AARHUS-HYDRO',
            'LongName' => 'Hydrogeophysics Group, Aarhus University'
          }
        }
      }])
    }
  end

  factory :draft_field_invalid_uri, class: Draft do
    draft { all_required_fields.merge('RelatedUrls' => [{
        'URLs' => ['this is invalid']
      }])
    }
  end
end

def all_required_fields
  {
    'Platforms' => [{
      'Type' => 'Earth Observation Satellites',
      'ShortName' => 'test 1 P ShortName',
      'LongName' => 'test 1 P LongName',
    }],
    'Abstract' => 'This is a long description of the collection',
    'DataDates' => [{
      'Type' => 'CREATE',
      'Date' => '2015-07-01T00:00:00Z'
    }],
    'ShortName' => '12345',
    'Version' => '1',
    'EntryTitle' => 'Required Fields Only Draft',
    'Organizations' => [{
      'Role' => 'RESOURCEPROVIDER',
      'Party' => {
        'OrganizationName' => {
          'ShortName' => 'AARHUS-HYDRO',
          'LongName' => 'Hydrogeophysics Group, Aarhus University'
        }
      }
    }],
    'ProcessingLevel' => {
      'Id' => 'Level 1',
      'ProcessingLevelDescription' => 'Level 1 Description'
    },
    'RelatedUrls' => [{
      'URLs' => ['http://example.com/']
    }],
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
