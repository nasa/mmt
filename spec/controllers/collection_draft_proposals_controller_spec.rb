describe Proposal::CollectionDraftProposalsController do
  before do
    set_as_proposal_mode_mmt
    @request.headers['Authorization'] = 'Bearer access-token'
    @collection_draft_proposal = create(:full_collection_draft_proposal, user: create(:user, :multiple_providers))
    @user2 = create(:user2)
  end

  it 'shows draft collection proposal record for proposal mode' do
    # The proposal is created by a testuser
    # The user requesting the proposal is testuser.
    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_dmmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser"}', response_headers: {'Content-Type':'application/json; charset=utf-8'}))
    get :download_json, params: { id: @collection_draft_proposal.id }
    parsed_body = JSON.parse(response.body)
    draft_json = @collection_draft_proposal.draft
    assert_equal(parsed_body['ShortName'], draft_json['ShortName'])
  end

  it 'it responds unauthorized if the proposal has not been created by them.' do
    # The proposal is created by a testuser
    # The user requesting the proposal is testuser2, not the same user.
    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_dmmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser2"}', response_headers: {'Content-Type':'application/json; charset=utf-8'}))
    get :download_json, params: { id: @collection_draft_proposal.id }
    parsed_body = JSON.parse(response.body)
    assert_equal(parsed_body['error'], 'unauthorized')
  end

end