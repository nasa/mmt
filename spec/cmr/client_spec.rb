require 'rails_helper'

describe Cmr::Client do
  let(:connection) { Object.new }
  let(:req) { double(headers: {}) }
  let(:cmr_client) { Cmr::CmrClient.new('http://example.com', '1234') }

  before { allow(cmr_client).to receive(:connection).and_return(connection) }

  context 'dataset search' do
    let(:dataset_search_url) { "http://localhost:3001/concepts/search/collections" }

    context 'using Entry Id' do
      it 'performs searches using exact matches' do
        expect(connection).to receive(:get).with(dataset_search_url, 'entry-id' => "term").and_return(:response)

        response = cmr_client.get_collections('entry-id' => "term")
        expect(response.faraday_response).to eq(:response)
      end
    end
  end

  context 'headers' do
    let(:basic_client) do
      # New class with a public request method
      Class.new(Cmr::BaseClient) do
        def request(*args)
          super(*args)
        end
      end.new(nil, nil)
    end

    let(:dummy_url) { '/dummy' }
    before { allow(basic_client).to receive(:connection).and_return(connection) }

    it 'defaults Content-Type to application/json for POST requests' do
      expect(connection).to receive(:post).with(dummy_url, nil).and_yield(req)

      basic_client.request(:post, dummy_url, nil, nil, {})
      expect(req.headers['Content-Type']).to eq('application/json')
    end

    it 'does not default Content-Type for GET requests' do
      expect(connection).to receive(:get).with(dummy_url, nil).and_yield(req)

      basic_client.request(:get, dummy_url, nil, nil, {})
      expect(req.headers['Content-Type']).to be_nil
    end

    it 'sets a client id compatible with catalog-rest requests' do
      expect(connection).to receive(:post).with(dummy_url, nil).and_yield(req)

      basic_client.request(:post, dummy_url, nil, nil, {})
      expect(req.headers['Client-Id']).to eq('MMT')
    end

    it 'sets a client id compatible with echo-rest requests' do
      expect(connection).to receive(:post).with(dummy_url, nil).and_yield(req)

      basic_client.request(:post, dummy_url, nil, nil, {})
      expect(req.headers['Echo-ClientId']).to eq('MMT')
    end
  end

end
