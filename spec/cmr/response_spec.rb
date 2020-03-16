describe 'CMR Response' do
  context 'when trying to remove tokens from error messages' do

    let(:test_urs_token) { "#{Faker::Lorem.characters(number: 40)}:client_id" }
    let(:test_launchpad_token) { Faker::Lorem.characters(number: 800) }
    # these should mirror how the token is shortened
    let(:test_urs_snippet) { test_urs_token.truncate([40 / 4, 8].max, omission: '') }
    let(:test_launchpad_snippet) { test_launchpad_token.truncate(50, omission: '') }

    it 'truncates URS tokens in hash responses' do
      cmr_response = cmr_fail_response('errors' => ["Token [#{test_urs_token}] is not a valid URS or Launchpad token."])
      expect(cmr_response.clean_inspect).to include({ 'errors' => ["Token beginning with #{test_urs_snippet} is not a valid URS or Launchpad token."] }.to_s)
    end

    it 'truncates URS tokens in string responses' do
      cmr_response = cmr_fail_response("Token [#{test_urs_token}] is not a valid URS or Launchpad token.")
      expect(cmr_response.clean_inspect).to include("Token beginning with #{test_urs_snippet} is not a valid URS or Launchpad token.")
    end

    it 'truncates Launchpad tokens in hash responses' do
      cmr_response = cmr_fail_response('errors' => ["Token [#{test_launchpad_token}] is not a valid URS or Launchpad token."])
      expect(cmr_response.clean_inspect).to include({ 'errors' => ["Token beginning with #{test_launchpad_snippet} is not a valid URS or Launchpad token."] }.to_s)
    end

    it 'truncates Launchpad tokens in string responses' do
      cmr_response = cmr_fail_response("Token [#{test_launchpad_token}] is not a valid URS or Launchpad token.")
      expect(cmr_response.clean_inspect).to include("Token beginning with #{test_launchpad_snippet} is not a valid URS or Launchpad token.")
    end

    it 'does not alter errors in hash responses with no tokens' do
      cmr_response = cmr_fail_response('errors' => ['Only one collection allowed in the list because a variable can only be associated with one collection.'])
      expect(cmr_response.clean_inspect).to include({ 'errors' => ['Only one collection allowed in the list because a variable can only be associated with one collection.'] }.to_s)
    end

    it 'does not alter errors in string responses with no tokens' do
      cmr_response = cmr_fail_response('Only one collection allowed in the list because a variable can only be associated with one collection.')
      expect(cmr_response.clean_inspect).to include('Only one collection allowed in the list because a variable can only be associated with one collection.')
    end
  end
end
