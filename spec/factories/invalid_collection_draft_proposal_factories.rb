FactoryBot.define do
  factory :empty_collection_draft_proposal, class: CollectionDraftProposal do
    transient do
      draft_request_type { 'create' }
    end

    draft_type { 'CollectionDraftProposal' }
    request_type { draft_request_type }
  end
end
