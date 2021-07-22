describe CollectionDraftsController do
  before do
  end

  it 'shows draft collection record for mmt proper' do
    set_as_mmt_proper
    @collection_draft = create(:full_collection_draft, user: get_user)
    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_mmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser"}', response_headers: {"Content-Type":"application/json; charset=utf-8"}))
    get :download_json, params: { id: @collection_draft.id }
    parsed_body = JSON.parse(response.body)
    draft_json = @collection_draft.draft
    assert_equal(parsed_body["ShortName"], draft_json["ShortName"])
  end
end