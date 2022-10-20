describe CollectionDraftsController do
  before do
    set_as_mmt_proper
    @request.headers['Authorization'] = 'Bearer access-token'
    @collection_draft = create(:full_collection_draft, user: create(:user, :multiple_providers))
    @unauthorized_draft = create(:collection_draft_all_required_fields, user: create(:user, :multiple_providers))
    @test_user2 = create(:user2) # belong to LARC
    @file = fixture_file_upload('upload_files/upload_collection_draft_test.json')

  end

  it 'shows draft collection record for mmt proper' do
    # The draft is created by a MMT_2 user
    # The user requesting the document does have MMT_2 in their provider list.
    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_mmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser"}', response_headers: {'Content-Type':'application/json; charset=utf-8'}))
    get :download_json, params: { id: @collection_draft.id }
    parsed_body = JSON.parse(response.body)
    draft_json = @collection_draft.draft
    assert_equal(parsed_body['ShortName'], draft_json['ShortName'])
  end

  it 'it responds unauthorized if the user does not belong to the provider list.' do
    # The draft is created by a MMT_2 user
    # The user requesting the document does not have MMT_2 in their provider list, only 'LARC'
    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_mmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser2"}', response_headers: {'Content-Type':'application/json; charset=utf-8'}))
    get :download_json, params: { id: @unauthorized_draft.id }
    parsed_body = JSON.parse(response.body)
    assert_equal(parsed_body['error'], 'unauthorized')
  end
  context 'uploading collection draft' do
    before do
      set_as_mmt_proper
      sign_in
    end
    it 'when a collection draft is upload' do
      # Calls upload_json in CollectionDraftController with a valid .json file (@file).
      # Since passing a valid .json file it will create a new collection draft from the content that in the uploaded file
      # and redirect to preview page with the new draft.
      post :upload_json, params: { uploaded_collection_draft: @file }
      expect(response.header['Location']).to include ('/collection_drafts/') # Checking if the draft was upload and redirected to collection_drafts
    end
    it 'when no collection draft is upload' do
      post :upload_json
      expect(response).to redirect_to(manage_collections_path)
    end
  end

end
