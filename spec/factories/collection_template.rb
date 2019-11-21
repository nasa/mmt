require 'faker'

FactoryGirl.define do
  factory :full_collection_template, class: CollectionTemplate do
    transient do
      draft_short_name nil
      draft_entry_title nil
      version nil
      collection_data_type nil
    end

    provider_id 'MMT_2'
    draft_type 'CollectionTemplate'

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
        'TemplateName' => template_name || "#{Faker::Number.number(digits: 6)}_#{Faker::Superhero.name}",
        'ShortName'    => draft_short_name || "#{Faker::Number.number(digits: 6)}_#{Faker::Superhero.name}",
        'Version'      => version || '1',
        'EntryTitle'   => draft_entry_title || "#{Faker::Number.number(digits: 6)}_#{Faker::Superhero.descriptor}",
        'CollectionDataType' => collection_data_type || 'SCIENCE_QUALITY',
      )
    }
  end
end
