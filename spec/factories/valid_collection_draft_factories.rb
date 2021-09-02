require 'faker'

FactoryBot.define do
  # This is a valid factory, used to test to make sure all the factories
  # that use all_required_fields will work
  factory :collection_draft_all_required_fields, class: CollectionDraft do
    draft_type { 'CollectionDraft' }
    native_id { 'required_fields_draft_id' }
    provider_id { 'MMT_2' }
    draft { all_required_fields }
  end

  factory :collection_draft, class: CollectionDraft do
    # Empty draft
    provider_id { 'MMT_2' }
    draft_type { 'CollectionDraft' }
    draft { {} }
  end

  factory :mmt_1_collection_draft, class: CollectionDraft do
    provider_id { 'MMT_1' }
    draft_type { 'CollectionDraft' }
    draft { {} }
  end

  factory :full_collection_draft, class: CollectionDraft do
    transient do
      draft_short_name { nil }
      draft_entry_title { nil }
      version { nil }
      collection_data_type { nil }
    end

    native_id { 'full_collection_draft_id' }
    provider_id { 'MMT_2' }
    draft_type { 'CollectionDraft' }
    entry_title { draft_entry_title }
    short_name { draft_short_name }

    trait :with_valid_dates do
      draft do
        {
          'MetadataDates' => [{
            'Type' => 'CREATE',
            'Date' => '2010-12-25T00:00:00Z'
          }, {
            'Type' => 'UPDATE',
            'Date' => '2010-12-30T00:00:00Z'
          }]
        }
      end
    end

    draft do
      collection_one.merge(
        'ShortName'          => draft_short_name || "#{Faker::Number.number(digits: 6)}_#{Faker::Superhero.name}",
        'Version'            => version || '1',
        'EntryTitle'         => draft_entry_title || "#{Faker::Number.number(digits: 6)}_#{Faker::Job.title}",
        'CollectionDataType' => collection_data_type || 'SCIENCE_QUALITY'
      )
    end
  end

  factory :collection_draft_some_keywords_that_match_recommendations, class: CollectionDraft do
    draft_type { 'CollectionDraft' }
    native_id { 'gkr_already_contains_recommendations_draft_id' }
    provider_id { 'MMT_2' }
    draft do
      all_required_fields.merge(
        'ScienceKeywords' => [
          {
          'Category' => 'EARTH SCIENCE',
          'Topic' => 'OCEANS',
          'Term' => 'SALINITY/DENSITY'
          },
          {
          'Category' => 'EARTH SCIENCE',
          'Topic' => 'OCEANS',
          'Term' => 'OCEAN TEMPERATURE'
          }
        ]
      )
    end
  end

  factory :collection_draft_all_keywords_that_match_recommendations, class: CollectionDraft do
    draft_type { 'CollectionDraft' }
    native_id { 'gkr_already_contains_recommendations_draft_id' }
    provider_id { 'MMT_2' }
    draft do
      all_required_fields.merge(
        'ScienceKeywords' => [
          {
          'Category' => 'EARTH SCIENCE',
          'Topic' => 'OCEANS',
          'Term' => 'SALINITY/DENSITY'
          },
          {
          'Category' => 'EARTH SCIENCE',
          'Topic' => 'OCEANS',
          'Term' => 'OCEAN TEMPERATURE'
          },
          {
          'Category' => 'EARTH SCIENCE',
          'Topic' => 'OCEANS',
          'Term' => 'OCEAN CHEMISTRY'
          },
          {
          'Category' => 'EARTH SCIENCE',
          'Topic' => 'OCEANS',
          'Term' => 'OCEAN OPTICS'
          }
        ]
      )
    end
  end

  factory :collection_draft_that_will_not_generate_keyword_recommendations, class: CollectionDraft do
    # the abstract used here initially returned a response with no recommendations
    # that seems to have been subsequently fixed (with recommendations that seem
    # somewhat off), but we need to test for an response with no recommendations
    # so keeping this abstract until a better one for no recommendations is found
    draft_type { 'CollectionDraft' }
    native_id { 'gkr_already_contains_recommendations_draft_id' }
    provider_id { 'MMT_2' }
    draft do
      all_required_fields.merge(
        'Abstract' => 'This dataset consists of: (1) a suite of sedimentary rocks (primarily sandstones, with subordinate mudstones, conglomerates, glauconites and volcanic ashes) collected from Cretaceous through Paleogene strata of the Larsen basin, Antarctic Peninsula, and (2) geochronology and geochemistry data from some of the aforementioned samples. The collection and analysis of samples in this growing database were funded by'
      )
    end
  end

  factory :collection_draft_no_related_url_subtype, class: CollectionDraft do
    draft_type { 'CollectionDraft' }
    provider_id { 'MMT_2' }
    draft do
      collection_one.merge(
        'RelatedUrls' => [{
          'Description' => 'Related URL 1 Description',
          'URLContentType' => 'CollectionURL',
          'Type' => 'DATA SET LANDING PAGE',
          'URL' => 'http://example.com/'
        }, {
          'Description' => 'Related URL 2 Description',
          'URLContentType' => 'DistributionURL',
          'Type' => 'GET DATA',
          'URL' => 'https://search.earthdata.nasa.gov/',
          'GetData' => {
            'Format' => 'ascii',
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
        }]
      )
    end
  end

  factory :progressive_update_collection_first, class: CollectionDraft do
    transient do
      draft_native_id { nil }
    end

    draft_type { 'CollectionDraft' }
    provider_id { 'MMT_2' }
    native_id { draft_native_id }

    draft do
      progressive_update_first
    end
  end

  factory :progressive_update_collection_with_errors, class: CollectionDraft do
    transient do
      draft_native_id { nil }
    end

    draft_type { 'CollectionDraft' }
    provider_id { 'MMT_2' }
    native_id { draft_native_id }

    draft do
      progressive_update_with_errors
    end
  end
end
