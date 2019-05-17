require 'rails_helper'

describe Echo::Client do
  let(:echo_client) { Echo::Client.new('http://example.com', Rails.configuration.services['echo_soap']['services']) }

  context 'Echo Client' do
    it 'echo_client delegates have assigned timeouts' do
      echo_client.timeout = 50
      sum = 0
      services = echo_client.instance_variable_get(:@services)
      services.each do |service|
        sum += service.timeout
      end
      expect(sum).to eq(services.count * 50)
    end
  end

end
