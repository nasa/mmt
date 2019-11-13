require 'faker'

FactoryGirl.define do
  factory :full_collection_draft_proposal, class: CollectionDraftProposal do
    transient do
      proposal_short_name nil
      proposal_entry_title nil
      version '001'
      collection_data_type 'SCIENCE_QUALITY'
      proposal_request_type 'create'
    end

    user_id 1
    native_id 'full_collection_draft_proposal_id'
    provider_id 'MMT_2'
    draft_type 'CollectionDraftProposal'
    entry_title { proposal_entry_title }
    short_name { proposal_short_name }
    request_type { proposal_request_type }

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
        'CollectionDataType' => collection_data_type,
        'Version'            => version,
        'EntryTitle'         => proposal_entry_title || "#{Faker::Movies::LordOfTheRings.location}_#{Faker::Number.number(15)}",
        'ShortName'          => proposal_short_name || "#{Faker::Movies::LordOfTheRings.character}_#{Faker::Number.number(10)}"
      )
    end
  end
end
