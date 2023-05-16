describe Api::DraftsController do
  before do
    set_as_mmt_proper
    sign_in
    @request.headers['Authorization'] = 'Bearer access-token'
    @empty_tool_draft = create(:empty_tool_draft, user: create(:user, :multiple_providers))
    @tool_draft = create(:full_tool_draft, user: create(:user, :multiple_providers))
    @tool_draft_to_delete = create(:full_tool_draft, user: create(:user, :multiple_providers))
    @test_user2 = create(:user2) # belong to LARC
  end

  it 'shows a list of tool drafts for given the provider' do
    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_mmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser"}', response_headers: { 'Content-Type': 'application/json; charset=utf-8' }))

    # Fetch all the MMT_2 tool drafts, should be 3 of them.
    request.headers.merge!({ 'User' => 'testuser' })
    get :index, params: { draft_type: "tool_drafts", provider: 'MMT_2' }
    array = JSON.parse(response.body)
    assert_equal(3, array.count)

    # Load a LARC tool_draft and expect the query to still be 3 for MMT_2
    @tool_draft = create(:larc_empty_tool_draft, user: create(:user))
    get :index, params: { draft_type: "tool_drafts", provider: 'MMT_2' }
    array = JSON.parse(response.body)
    assert_equal(response.headers['MMT_Hits'], "3")
    assert_equal(3, array.count)

    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_mmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser2"}', response_headers: { 'Content-Type': 'application/json; charset=utf-8' }))
    # Check to see how many LARC tool drafts, should only be 1
    request.headers.merge!({ 'User' => 'testuser2' })
    get :index, params: { draft_type: "tool_drafts", provider: 'LARC'  }
    array = JSON.parse(response.body)
    assert_equal(response.headers['MMT_Hits'], "1")
    assert_equal(1, array.count)
  end

  it 'shows unauthorized if the user cannot access that provider.' do
    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_mmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser"}', response_headers: { 'Content-Type': 'application/json; charset=utf-8' }))

    # Try getting a list of tool drafts from a provider I don't have access to.
    request.headers.merge!({ 'User' => 'testuser2' })
    get :index, params: { draft_type: "tool_drafts", provider: 'PODAAC' }
    parsed_body = JSON.parse(response.body)
    assert_equal(parsed_body['error'], 'unauthorized')
  end


  it 'shows draft tool record for mmt proper' do
    # The draft is created by a MMT_2 user
    # The user requesting the document does have MMT_2 in their provider list.
    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_mmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser"}', response_headers: { 'Content-Type': 'application/json; charset=utf-8' }))
    request.headers.merge!({ 'User' => 'testuser' })
    get :show, params: { id: @tool_draft.id, draft_type: "tool_drafts", provider: 'LARC' }
    parsed_body = JSON.parse(response.body)
    if !parsed_body.is_a?(Hash)
      parsed_body = JSON.parse(parsed_body)
    end
    response_draft = parsed_body['draft']
    draft_json = @tool_draft.draft
    assert_equal(response_draft['VersionDescription'], draft_json['VersionDescription'])
  end

  it 'it responds unauthorized if the user does not belong to the provider list.' do
    # The draft is created by a MMT_2 user
    # The user requesting the document does not have MMT_2 in their provider list, only 'LARC'
    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_mmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser2"}', response_headers: { 'Content-Type': 'application/json; charset=utf-8' }))
    request.headers.merge!({ 'User' => 'testuser2' })
    get :show, params: { id: @tool_draft.id, draft_type: "tool_drafts", provider: 'MMT_2'  }
    parsed_body = JSON.parse(response.body)
    assert_equal(parsed_body['error'], 'unauthorized')
  end

  it 'delete a tool draft' do
    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_mmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser"}', response_headers: { 'Content-Type': 'application/json; charset=utf-8' }))
    request.headers.merge!({ 'User' => 'testuser' })
    delete :destroy, params: { id: @tool_draft_to_delete.id, draft_type: "tool_drafts", provider: 'MMT_2'  }
    assert_equal(response.status, 200)
    parsed_body = JSON.parse(response.body)
    assert_equal(parsed_body['result'], 'Draft deleted')
  end

  it 'can not delete if the user does not belong to the provider list.' do
    # The draft is created by a MMT_2 user
    # The user requesting the document does not have MMT_2 in their provider list, only 'LARC'
    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_mmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser2"}', response_headers: { 'Content-Type': 'application/json; charset=utf-8' }))
    request.headers.merge!({ 'User' => 'testuser2' })
    delete :destroy, params: { id: @tool_draft.id, draft_type: "tool_drafts", provider: 'LARC'  }
    parsed_body = JSON.parse(response.body)
    assert_equal(parsed_body['error'], 'unauthorized')
  end

  it 'delete a non-existing draft' do
    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_mmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser2"}', response_headers: { 'Content-Type': 'application/json; charset=utf-8' }))
    request.headers.merge!({ 'User' => 'testuser' })
    delete :destroy, params: { id: 9999, draft_type: "tool_drafts", provider: 'LARC' }
    parsed_body = JSON.parse(response.body)
    assert_equal(parsed_body['error'], "Couldn't find ToolDraft with 'id'=9999")
  end

  it 'can not update a draft if the user does not belong to the provider list.' do
    # The draft is created by a MMT_2 user
    # The testuser2 updating the document does not have MMT_2 in their available provider list, only 'LARC'
    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_mmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser2"}', response_headers: { 'Content-Type': 'application/json; charset=utf-8' }))
    request.headers.merge!({ 'User' => 'testuser2' })
    jsonContent = { "draft": {
      "Name": "a name",
      "LongName": "a long name",
      "Version": "10.0"
    }}.to_json
    put :update, body: jsonContent, params: { id: @tool_draft.id, draft_type: "tool_drafts", provider: 'MMT_2' }
    assert_equal(response.status, 401)
    parsed_body = JSON.parse(response.body)
    assert_equal(parsed_body['error'], 'unauthorized')
  end

  it 'can not update a draft if the user is not the user the token says they are.' do
    # The draft is created by a MMT_2 user
    # The testuser2 updating the document does not have MMT_2 in their available provider list, only 'LARC'
    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_mmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser2"}', response_headers: { 'Content-Type': 'application/json; charset=utf-8' }))
    request.headers.merge!({ 'User' => 'testuser' })
    jsonContent = { "draft": {
      "Name": "a name",
      "LongName": "a long name",
      "Version": "10.0"
    }}.to_json
    put :update, body: jsonContent, params: { id: @tool_draft.id, draft_type: "tool_drafts", provider: 'MMT_2' }
    assert_equal(response.status, 401)
    parsed_body = JSON.parse(response.body)
    assert_equal(parsed_body['error'], 'unauthorized')
  end

  it 'create a draft record.' do
    # The draft is created by testuser and Provider is MMT_2
    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_mmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser"}', response_headers: { 'Content-Type': 'application/json; charset=utf-8' }))
    jsonContent = { "draft": {
      "Name": "a new draft",
      "LongName": "long name",
      "Version": "10.0"
    }}.to_json
    request.headers.merge!({ 'User' => 'testuser' })
    post :create, body: jsonContent, params: { draft_type: "tool_drafts", provider: 'MMT_2' }
    assert_equal(response.status, 200)
    parsed_body = JSON.parse(response.body)
    assert_equal(parsed_body['draft']['Name'], 'a new draft')
  end

  it 'can not create a draft if the user does not belong to the provider list.' do
    # The testuser2 creating a draft does not  belong to their available provider list, only 'LARC'
    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_mmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser2"}', response_headers: { 'Content-Type': 'application/json; charset=utf-8' }))
    jsonContent = { "draft": {
      "Name": "a name",
      "LongName": "a long name",
      "Version": "10.0"
    }}.to_json
    request.headers.merge!({ 'User' => 'testuser2' })
    post :create, body: jsonContent, params: { draft_type: "tool_drafts", provider: 'MMT_2' }
    assert_equal(response.status, 401)
    parsed_body = JSON.parse(response.body)
    assert_equal(parsed_body['error'], 'unauthorized')
  end

  it 'retrieve a draft record without provider id in the url' do
    # The draft is created by testuser and Provider is MMT_2
    # The testeruser retrieving the draft
    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_mmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser"}', response_headers: { 'Content-Type': 'application/json; charset=utf-8' }))
    request.headers.merge!({ 'User' => 'testuser' })
    get :show, params: { id: @tool_draft.id, draft_type: "tool_drafts" }
    parsed_body = JSON.parse(response.body)
    if !parsed_body.is_a?(Hash)
      parsed_body = JSON.parse(parsed_body)
    end
    response_draft = parsed_body['draft']
    draft_json = @tool_draft.draft
    assert_equal(response_draft['a new draft'], draft_json['a new draft'])
  end

  it 'retrieve a draft with error if a user does not belong to a provider list.' do
    # The draft is created by testuser and Provider is MMT_2
    # testeruser2 requesting the document does not have MMT_2 in their provider list, only 'LARC'
    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_mmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser2"}', response_headers: { 'Content-Type': 'application/json; charset=utf-8' }))
    request.headers.merge!({ 'User' => 'testuser2' })
    get :show, params: { id: @tool_draft.id, draft_type: "tool_drafts" }
    parsed_body = JSON.parse(response.body)
    assert_equal(parsed_body['error'], 'unauthorized')
  end

  it 'create draft record with correct request headers and send update' do
    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_mmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser"}', response_headers: { 'Content-Type': 'application/json; charset=utf-8' }))
    jsonContent = { "draft": {
      "Name": "a name",
      "LongName": "a long name",
      "Version": "10.0"
    }}.to_json
    request.headers.merge!({ 'User' => 'testuser' })
    post :create, body: jsonContent, params: { draft_type: "tool_drafts", provider: 'LARC' }
    assert_equal(response.status, 200)
    parsed_body = JSON.parse(response.body)
    assert_equal(parsed_body['draft']['Name'], 'a name')
    jsonContent = { "draft": {
      "Name": "a name updated",
      "LongName": "a long name",
      "Version": "10.0"
    }}.to_json
    request.headers.merge!({ 'User' => 'testuser' })
    put :update, body: jsonContent, params: { id: parsed_body['id'], draft_type: "tool_drafts", provider: 'LARC' }
    assert_equal(response.status, 200)
    parsed_body = JSON.parse(response.body)
    assert_equal(parsed_body['draft']['Name'], 'a name updated')
  end

  it 'create draft record with incorrect request headers' do
    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_mmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser"}', response_headers: { 'Content-Type': 'application/json; charset=utf-8' }))
    jsonContent = { "draft": {
      "Name": "a name",
      "LongName": "a long name",
      "Version": "10.0"
    }}.to_json
    post :create, body: jsonContent, params: { draft_type: "tool_drafts" }
    assert_equal(response.status, 401)
    parsed_body = JSON.parse(response.body)
    assert_equal(parsed_body['error'], 'unauthorized')
  end

  it 'can publish a tool record with errors' do
    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_mmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser"}', response_headers: { 'Content-Type': 'application/json; charset=utf-8' }))
    jsonContent = {"draft": @empty_tool_draft.draft}.to_json
    request.headers.merge!({ 'User' => 'testuser' })
    post :publish, body: jsonContent, params: { id: @empty_tool_draft.id, draft_type: "tool_drafts", provider: 'MMT_1' }
    result = response.parsed_body
    assert_equal(response.status, 500)
    assert_equal(result.dig('errors'), [
      "#: required key [Name] not found",
      "#: required key [LongName] not found",
      "#: required key [Type] not found",
      "#: required key [Version] not found",
      "#: required key [Description] not found",
      "#: required key [ToolKeywords] not found",
      "#: required key [Organizations] not found",
      "#: required key [URL] not found"]
    )
  end

  it 'can publish a tool record with success' do
    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_mmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser"}', response_headers: { 'Content-Type': 'application/json; charset=utf-8' }))
    tool_draft_json = {"draft": @tool_draft.draft}.to_json
    request.headers.merge!({ 'User' => 'testuser' })
    post :publish, body: tool_draft_json, params: { id: @tool_draft.id, draft_type: "tool_drafts", provider: 'MMT_1' }
    result = response.parsed_body
    assert_equal(response.status, 200)
    expect(result.dig("concept_id")).not_to be(nil)
    expect(result.dig("revision_id")).not_to be(nil)
  end

  context 'ingest variable draft' do
    before do
      @variable_draft = create(:full_variable_draft, user: create(:user, :multiple_providers))
      @collection_ingest_response, _concept_response = publish_collection_draft
    end
    it 'can publish a variable record with success' do
      allow_any_instance_of(Cmr::UrsClient).to receive(:validate_mmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser"}', response_headers: { 'Content-Type': 'application/json; charset=utf-8' }))
      variable_draft_json = {"draft": @variable_draft.draft, "associatedCollectionId": @collection_ingest_response['concept-id']}.to_json
      request.headers.merge!({ 'User' => 'testuser' })
      post :publish, body: variable_draft_json, params: { id: @variable_draft.id, draft_type: 'variable_drafts', provider: 'MMT_1' }
      result = response.parsed_body
      assert_equal(response.status, 200)
      expect(result.dig("concept_id")).not_to be(nil)
      expect(result.dig("revision_id")).not_to be(nil)
    end
    it 'can publish a variable record with empty elements successfully' do
      allow_any_instance_of(Cmr::UrsClient).to receive(:validate_mmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser"}', response_headers: { 'Content-Type': 'application/json; charset=utf-8' }))
      variable_draft = {
        'AdditionalIdentifiers'=>[{}],
        'IndexRanges'=>{'LatRange'=>[nil, nil], 'LonRange'=>[nil, nil]},
        'Name'=> 'a name',
        'LongName'=> 'a long name',
        'Definition'=> 'a definition'
      }
      variable_draft_json = {"draft": variable_draft, "associatedCollectionId": @collection_ingest_response['concept-id']}.to_json
      request.headers.merge!({ 'User' => 'testuser' })
      post :publish, body: variable_draft_json, params: { id: @variable_draft.id, draft_type: 'variable_drafts', provider: 'MMT_1' }
      result = response.parsed_body
      assert_equal(response.status, 200)
      expect(result.dig("concept_id")).not_to be(nil)
      expect(result.dig("revision_id")).not_to be(nil)
    end
  end
end
