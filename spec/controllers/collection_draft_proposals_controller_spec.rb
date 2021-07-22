describe Proposal::CollectionDraftProposalsController do
  before do
    set_as_proposal_mode_mmt
    @request.headers['Authorization'] = "Bearer access-token"
    @collection_draft_proposal = create(:full_collection_draft_proposal, user: get_user)
  end

  it 'shows draft collection proposal record for proposal mode' do
    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_dmmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser"}', response_headers: {"Content-Type":"application/json; charset=utf-8"}))
    get :download_json, params: { id: @collection_draft_proposal.id }
    parsed_body = JSON.parse(response.body)
    draft_json = @collection_draft_proposal.draft
    assert_equal(parsed_body["ShortName"], draft_json["ShortName"])
  end
end