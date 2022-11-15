FactoryBot.define do
  factory :empty_collection_draft_proposal_native_id, class: CollectionDraftProposal do
    transient do
      draft_request_type { 'create' }
    end

    draft_type { 'CollectionDraftProposal' }
    draft { {} }
    request_type { draft_request_type }
    native_id { 'empty_collection_draft_native_id' }
  end
end