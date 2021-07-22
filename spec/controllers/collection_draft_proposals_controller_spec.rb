describe Proposal::CollectionDraftProposalsController do
  it 'shows draft collection proposal record for proposal mode' do
    set_as_proposal_mode_mmt
    @collection_draft_proposal = create(:full_collection_draft_proposal, user: get_user)
    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_dmmt_token).and_return(Cmr::Response.new(Faraday::Response.new(status: 200, body: "{user_id:test}", response_headers: {})))
    get :show, params: { id: @collection_draft_proposal.id }, as: :json
    parsed_body = JSON.parse(response.body)
    draft_json = @collection_draft_proposal.draft
    assert_equal(parsed_body["ShortName"], draft_json["ShortName"])
  end
end