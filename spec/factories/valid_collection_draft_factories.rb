require 'faker'

FactoryGirl.define do
  factory :full_collection_draft, class: CollectionDraft do
    transient do
      draft_short_name nil
      draft_entry_title nil
      version nil
      collection_data_type nil
    end

    native_id 'full_collection_draft_id'
    provider_id 'MMT_2'
    draft_type 'CollectionDraft'

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

    draft {
      collection_one.merge(
        'ShortName'    => draft_short_name || "#{Faker::Number.number(6)}_#{Faker::Superhero.name}",
        'Version'      => version || '1',
        'EntryTitle'   => draft_entry_title || "#{Faker::Number.number(6)}_#{Faker::Job.title}",
        'CollectionDataType' => collection_data_type || 'SCIENCE_QUALITY',
      )
    }
  end
end
