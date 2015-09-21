FactoryGirl.define do
  # This is a valid factory, used to test to make sure all the factories
  # that use all_required_fields will work
  factory :draft_all_required_fields, class: Draft do
    draft { all_required_fields }
  end

  factory :draft do
    # Empty draft
  end

  # Will trigger required fields error for data identification required fields
  factory :draft_missing_required_fields, class: Draft do
    draft 'EntryId' => '12345'
  end

  factory :draft_nested_required_field, class: Draft do
    draft { all_required_fields.merge('RelatedUrls' => [{
        'Description' => 'description'
      }])
    }
  end

  factory :draft_field_too_long, class: Draft do
    draft { all_required_fields.merge('EntryId' => "#{'a' * 81}") }
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
            'ShortName' => 'ORG_SHORT 2',
            'LongName' => 'Organization Long Name 2',
            'Uuid' => 'de135797-8539-'
          }
        }
      }])
    }
  end
end

def all_required_fields
  {
    'Platforms' => [{
      'Type' => 'test 1 Type',
      'ShortName' => 'test 1 P ShortName',
      'LongName' => 'test 1 P LongName',
    }],
    'Abstract' => 'This is a long description of the collection',
    'DataDates' => [{
      'Type' => 'CREATE',
      'Date' => '2015-07-01T00:00:00Z'
    }],
    'EntryId' => '12345',
    'EntryTitle' => 'Entry Title',
    'Organizations' => [{
      'Role' => 'RESOURCEPROVIDER',
      'Party' => {
        'OrganizationName' => {
          'ShortName' => 'ORG_SHORT 2',
          'LongName' => 'Organization Long Name 2',
          'Uuid' => 'de135797-8539-4c3a-bc20-17a83d75aa49'
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
