require 'rails_helper'

describe Cmr::Client do
  context 'Cmr Client' do
    it 'cmr_client delegates have assigned timeouts' do
      env = Rails.configuration.cmr_env
      service_configs = Rails.configuration.services
      service_config = service_configs['earthdata'][env]
      mmt_mode = Rails.configuration.proposal_mode ? 'mmt_proposal_mode' : 'mmt_proper'
      urs_client_id = service_configs['urs'][mmt_mode][Rails.env.to_s][service_config['urs_root']]
      cmr_client = Cmr::Client.new(service_config, urs_client_id)

      cmr_client.timeout = 50
      sum = 0
      clients = cmr_client.instance_variable_get(:@clients)
      clients.each do |clients|
        sum += clients.timeout
      end
      expect(sum).to eq(clients.count * 50)
    end
  end

end
