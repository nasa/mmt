describe 'CMR Response' do
  context 'when trying to remove tokens from error messages' do
    it 'removes tokens in hash responses' do
      cmr_response = cmr_fail_response('errors' => ['Token [definitelyafaketoken] is not a valid launchpad token.'])
      expect(cmr_response.clean_inspect).to include({ 'errors' => ['Token beginning with defini is not a valid launchpad token.'] }.to_s)
    end

    it 'removes tokens in string responses' do
      cmr_response = cmr_fail_response('Token [definitelyafaketoken] is not a valid launchpad token.')
      expect(cmr_response.clean_inspect).to include('Token beginning with defini is not a valid launchpad token.')
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
