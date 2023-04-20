describe Api::DraftsController do
  before do
    set_as_mmt_proper
    sign_in
    @request.headers['Authorization'] = 'Bearer access-token'
    @empty_tool_draft = create(:empty_tool_draft, user: create(:user, :multiple_providers))
    @tool_draft = create(:full_tool_draft, user: create(:user, :multiple_providers))
    @test_user2 = create(:user2) # belong to LARC
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

  it 'can not update if the user does not belong to the provider list.' do
    # The draft is created by a MMT_2 user
    # The user requesting the document does not have MMT_2 in their provider list, only 'LARC'
    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_mmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser2"}', response_headers: { 'Content-Type': 'application/json; charset=utf-8' }))
    request.headers.merge!({ 'User' => 'testuser2' })
    request.headers.merge!({ 'Provider' => 'LARC' })
    get :update, params: { id: @tool_draft.id, draft_type: "ToolDraft" }
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
