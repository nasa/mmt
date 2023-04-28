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
    request.headers.merge!({ 'User' => 'testuser2' })
    request.headers.merge!({ 'Provider' => 'MMT_2' })
    get :index, params: { draft_type: "ToolDraft" }
    array = JSON.parse(response.body)
    assert_equal(3, array.count)

    # Load a LARC tool_draft and expect the query to still be 3 for MMT_2
    @tool_draft = create(:larc_empty_tool_draft, user: create(:user))
    get :index, params: { draft_type: "ToolDraft" }
    array = JSON.parse(response.body)
    assert_equal(response.headers['MMT_Hits'], 3)
    assert_equal(3, array.count)

    # Check to see how many LARC tool drafts, should only be 1
    request.headers.merge!({ 'User' => 'testuser2' })
    request.headers.merge!({ 'Provider' => 'LARC' })
    get :index, params: { draft_type: "ToolDraft" }
    array = JSON.parse(response.body)
    assert_equal(response.headers['MMT_Hits'], 1)
    assert_equal(1, array.count)
  end

  it 'shows draft tool record for mmt proper' do
    # The draft is created by a MMT_2 user
    # The user requesting the document does have MMT_2 in their provider list.
    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_mmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser"}', response_headers: { 'Content-Type': 'application/json; charset=utf-8' }))
    get :show, params: { id: @tool_draft.id, draft_type: "ToolDraft" }
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
    get :show, params: { id: @tool_draft.id, draft_type: "ToolDraft" }
    parsed_body = JSON.parse(response.body)
    assert_equal(parsed_body['error'], 'unauthorized')
  end

  it 'delete a tool draft' do
    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_mmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser"}', response_headers: { 'Content-Type': 'application/json; charset=utf-8' }))
    request.headers.merge!({ 'User' => 'testuser' })
    request.headers.merge!({ 'Provider' => 'MMT_2' })
    delete :destroy, params: { id: @tool_draft_to_delete.id, draft_type: "ToolDraft" }
    assert_equal(response.status, 200)
    parsed_body = JSON.parse(response.body)
    assert_equal(parsed_body['result'], 'Draft deleted')
  end

  it 'can not delete if the user does not belong to the provider list.' do
    # The draft is created by a MMT_2 user
    # The user requesting the document does not have MMT_2 in their provider list, only 'LARC'
    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_mmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser2"}', response_headers: { 'Content-Type': 'application/json; charset=utf-8' }))
    request.headers.merge!({ 'User' => 'testuser2' })
    request.headers.merge!({ 'Provider' => 'LARC' })
    delete :destroy, params: { id: @tool_draft.id, draft_type: "ToolDraft" }
    parsed_body = JSON.parse(response.body)
    assert_equal(parsed_body['error'], 'unauthorized')
  end

  it 'can not update a draft if the user does not belong to the provider list.' do
    # The draft is created by a MMT_2 user
    # The testuser2 updating the document does not have MMT_2 in their available provider list, only 'LARC'
    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_mmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser2"}', response_headers: { 'Content-Type': 'application/json; charset=utf-8' }))
    jsonContent = { "json": {
      "Name": "a name",
      "LongName": "a long name",
      "Version": "10.0"
    }}.to_json
    put :update, body: jsonContent, params: { id: @tool_draft.id, draft_type: "ToolDraft" }
    assert_equal(response.status, 401)
    parsed_body = JSON.parse(response.body)
    assert_equal(parsed_body['error'], 'unauthorized')
  end

  it 'create a draft record.' do
    # The draft is created by testuser and Provider is MMT_2
    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_mmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser"}', response_headers: { 'Content-Type': 'application/json; charset=utf-8' }))
    jsonContent = { "json": {
      "Name": "a new draft",
      "LongName": "long name",
      "Version": "10.0"
    }}.to_json
    request.headers.merge!({ 'User' => 'testuser' })
    request.headers.merge!({ 'Provider' => 'MMT_2' })
    post :create, body: jsonContent, params: { draft_type: "ToolDraft" }
    assert_equal(response.status, 200)
    parsed_body = JSON.parse(response.body)
    assert_equal(parsed_body['draft']['Name'], 'a new draft')
  end

  it 'can not create a draft if the user does not belong to the provider list.' do
    # The testuser2 creating a draft does not  belong to their available provider list, only 'LARC'
    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_mmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser2"}', response_headers: { 'Content-Type': 'application/json; charset=utf-8' }))
    jsonContent = { "json": {
      "Name": "a name",
      "LongName": "a long name",
      "Version": "10.0"
    }}.to_json
    request.headers.merge!({ 'User' => 'testuser2' })
    request.headers.merge!({ 'Provider' => 'MMT_2' })
    post :create, body: jsonContent, params: { draft_type: "ToolDraft" }
    assert_equal(response.status, 401)
    parsed_body = JSON.parse(response.body)
    assert_equal(parsed_body['error'], 'unauthorized')
  end

  it 'retrieve a draft record' do
    # The draft is created by testuser and Provider is MMT_2
    # The testeruser retrieving the draft
    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_mmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser"}', response_headers: { 'Content-Type': 'application/json; charset=utf-8' }))
    get :show, params: { id: @tool_draft.id, draft_type: "ToolDraft" }
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
    get :show, params: { id: @tool_draft.id, draft_type: "ToolDraft" }
    parsed_body = JSON.parse(response.body)
    assert_equal(parsed_body['error'], 'unauthorized')
  end

  it 'create draft record with correct request headers and send update' do
    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_mmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser"}', response_headers: { 'Content-Type': 'application/json; charset=utf-8' }))
    jsonContent = { "json": {
      "Name": "a name",
      "LongName": "a long name",
      "Version": "10.0"
    }}.to_json
    request.headers.merge!({ 'User' => 'testuser' })
    request.headers.merge!({ 'Provider' => 'LARC' })
    post :create, body: jsonContent, params: { draft_type: "ToolDraft" }
    assert_equal(response.status, 200)
    parsed_body = JSON.parse(response.body)
    assert_equal(parsed_body['draft']['Name'], 'a name')
    jsonContent = { "json": {
      "Name": "a name updated",
      "LongName": "a long name",
      "Version": "10.0"
    }}.to_json
    request.headers.merge!({ 'User' => 'testuser' })
    request.headers.merge!({ 'Provider' => 'LARC' })
    put :update, body: jsonContent, params: { id: parsed_body['id'], draft_type: "ToolDraft" }
    assert_equal(response.status, 200)
    parsed_body = JSON.parse(response.body)
    assert_equal(parsed_body['draft']['Name'], 'a name updated')
  end

  it 'create draft record with incorrect request headers' do
    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_mmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser"}', response_headers: { 'Content-Type': 'application/json; charset=utf-8' }))
    jsonContent = { "json": {
      "Name": "a name",
      "LongName": "a long name",
      "Version": "10.0"
    }}.to_json
    post :create, body: jsonContent, params: { draft_type: "ToolDraft" }
    assert_equal(response.status, 401)
    parsed_body = JSON.parse(response.body)
    assert_equal(parsed_body['error'], 'unauthorized')
  end

  it 'can publish a tool record with errors' do
    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_mmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser"}', response_headers: { 'Content-Type': 'application/json; charset=utf-8' }))
    jsonContent = {"json": @empty_tool_draft.draft}.to_json
    request.headers.merge!({ 'User' => 'testuser' })
    request.headers.merge!({ 'Provider' => 'MMT_1' })
    post :publish, body: jsonContent, params: { id: @empty_tool_draft.id, draft_type: "ToolDraft" }
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
    tool_draft_json = {"json": @tool_draft.draft}.to_json
    request.headers.merge!({ 'User' => 'testuser' })
    request.headers.merge!({ 'Provider' => 'MMT_1' })
    post :publish, body: tool_draft_json, params: { id: @tool_draft.id, draft_type: "ToolDraft" }
    result = response.parsed_body
    assert_equal(response.status, 200)
    expect(result.dig("concept_id")).not_to be(nil)
    expect(result.dig("revision_id")).not_to be(nil)
  end
end
