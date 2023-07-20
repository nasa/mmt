require 'rails_helper'

describe Cmr::BaseClient do
  let(:connection) { Faraday.new }
  let(:req) { double(headers: {}) }

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
      expect(connection).to receive(:post).with(dummy_url).and_yield(req)

      basic_client.request(:post, dummy_url, nil, nil, {})
      expect(req.headers['Content-Type']).to eq('application/json')
    end

    it 'does not default Content-Type for GET requests' do
      expect(connection).to receive(:get).with(dummy_url).and_yield(req)

      basic_client.request(:get, dummy_url, nil, nil, {})
      expect(req.headers['Content-Type']).to be_nil
    end

    it 'sets a client id compatible with catalog-rest requests' do
      expect(connection).to receive(:post).with(dummy_url).and_yield(req)

      basic_client.request(:post, dummy_url, nil, nil, {})
      expect(req.headers['Client-Id']).to eq('MMT')
    end

    it 'sets a client id compatible with rest requests' do
      expect(connection).to receive(:post).with(dummy_url).and_yield(req)

      basic_client.request(:post, dummy_url, nil, nil, {})
      expect(req.headers['Echo-ClientId']).to eq('MMT')
    end
  end
end
