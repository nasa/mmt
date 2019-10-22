describe Cmr::Client do
  let(:connection) { Faraday.new }
  let(:req) { double(headers: {}) }
  let(:cmr_client) { Cmr::CmrClient.new('http://example.com', '1234') }

  before { allow(cmr_client).to receive(:connection).and_return(connection) }

  context 'collection search' do
    let(:collection_search_url) { 'http://localhost:3003/collections.umm-json' }

    context 'using Short Name' do
      it 'performs searches using exact matches' do
        expect(connection).to receive(:get).with(collection_search_url, 'short_name' => 'term').and_return(:response)

        response = cmr_client.get_collections('short_name' => 'term')
        expect(response.faraday_response).to eq(:response)
      end
    end
  end

  context 'error_messages' do
    let(:collection_search_url) { 'http://localhost:3003/collections.umm-json' }

    it 'returns errors from a CMR response' do
      expect(connection).to receive(:get).with(collection_search_url, 'short_name' => 'term').and_return(Cmr::Response.new(Faraday::Response.new(status: 500, body: { 'errors' => ['something went wrong'] }, response_headers: {})))

      response = cmr_client.get_collections('short_name' => 'term')
      expect(response.errors).to eq(['something went wrong'])
    end

    it 'does not error when returning errors from an html response' do
      expect(connection).to receive(:get).with(collection_search_url, 'short_name' => 'term').and_return(Cmr::Response.new(Faraday::Response.new(status: 500, body: "<html>\r\n<head><title>500 Internal Server Error</title></head>\r\n<body bgcolor=\"white\">\r\n<center><h1>500 Internal Server Error</h1></center>\r\n errors error <hr><center>nginx/1.12.2</center>\r\n</body>\r\n</html>\r\n", response_headers: { 'content-type' => 'text/html' })))

      response = cmr_client.get_collections('short_name' => 'term')
      expect(response.errors).to eq(['There was an error with the operation you were trying to perform. There may be an issue with one of the services we depend on. Please contact your provider administrator or the CMR OPS team.'])
    end

    context 'error logging' do
      let(:collection_search_url) { 'http://localhost:3003/collections.umm-json' }

      before { allow_any_instance_of(Cmr::BaseClient).to receive(:token_header).with('bad-bad-bad-token-bad-bad-bad-token:somethingsomethingso').and_return('Echo-Token' => 'bad-bad-bad-token-bad-bad-bad-token:somethingsomethingso') }

      it '`clean_inspect` does not contain the full token' do
        response = cmr_client.get_collections({ 'short_name' => 'term' }, 'bad-bad-bad-token-bad-bad-bad-token:somethingsomethingso')

        expect(response.clean_inspect).to include('Echo-Token-snippet')
        expect(response.clean_inspect).to include('bad-bad-...:somet...')

        expect(response.clean_inspect).not_to include('"Echo-Token"=>')
        # TODO: we should not be logging the full token, but it comes back with
        # the cmr response body. the message containing tokens may change with CMR-5274
        # expect(response.clean_inspect).not_to include('bad-bad-bad-token-bad-bad-bad-token:somethingsomethingso')
      end

      it 'the first error logging only contains the response body' do
        # TODO: we should not be logging the full token, but it comes back with
        # the cmr response body. the message containing tokens may change with CMR-5274

        # for testing logs, we need to put the expectation before the message is logged
        # the first error logging happens in base_client, with just the response body
        expect(Rails.logger).to receive(:error).with("Cmr::CmrClient Response Error: \"{\\\"errors\\\":[\\\"Token does not exist\\\"]}\"")

        response = cmr_client.get_collections_by_post({ 'short_name' => 'term' }, 'bad-bad-bad-token-bad-bad-bad-token:somethingsomethingso')
      end
    end
  end
end
