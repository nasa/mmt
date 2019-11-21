require 'faker'

FactoryGirl.define do
  factory :full_collection_template, class: CollectionTemplate do
    transient do
      collection_template_name nil
      draft_entry_title nil
      draft_short_name nil
      version nil
      collection_data_type nil
    end

    provider_id 'MMT_2'
    draft_type 'CollectionTemplate'
    entry_title { draft_entry_title }
    short_name { draft_short_name }
    template_name { collection_template_name }

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
        'CollectionDataType' => collection_data_type || 'SCIENCE_QUALITY',
        'Version'            => version || '1',
        'TemplateName'       => collection_template_name || "#{Faker::Number.number(digits: 6)}_#{Faker::Superhero.name}",
        'EntryTitle'         => draft_entry_title || "#{Faker::Number.number(digits: 6)}_#{Faker::Superhero.descriptor}",
        'ShortName'          => draft_short_name || "#{Faker::Number.number(digits: 6)}_#{Faker::Superhero.name}",
      )
    end
  end
end
