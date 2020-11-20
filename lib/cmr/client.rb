module Cmr
  class Client
    def self.client_for_environment(env, service_configs)
      service_config = service_configs['earthdata'][env]
      mmt_mode = Rails.configuration.proposal_mode ? 'mmt_proposal_mode' : 'mmt_proper'
      urs_client_id = service_configs['urs'][mmt_mode][Rails.env.to_s][service_config['urs_root']]
      Cmr::Client.new(service_config, urs_client_id)
    end

    def initialize(service_config, urs_client_id)
      @config = service_config
      clients = []
      clients << CmrClient.new(@config['cmr_root'], urs_client_id)
      clients << EchoClient.new(@config['echo_root'], urs_client_id)
      clients << UrsClient.new(@config['urs_root'], urs_client_id)
      launchpad_root = 'launchpad_sbx_root'
      launchpad_root = 'launchpad_root' if ENV['launchpad_production'] == 'true'
      clients << LaunchpadClient.new(@config[launchpad_root], urs_client_id)
      clients << UvgClient.new(@config['uvg_root'], urs_client_id)
      clients << DmmtClient.new(@config['dmmt_root'], urs_client_id)
      clients << GkrClient.new(@config['gkr_root'], urs_client_id)
      @clients = clients
    end

    def method_missing(method_name, *arguments, &block)
      client = @clients.find {|c| c.respond_to?(method_name)}
      if client
        client.send(method_name, *arguments, &block)
      else
        super
      end
    end

    def respond_to?(method_name, include_private = false)
      @clients.any? {|c| c.respond_to?(method_name, include_private)} || super
    end

    # when setting the timeout to the cmr client, it needs to tell each service
    # the new timeout value to use for faraday connections, as the cmr client
    # delegates the operations to these services.
    def timeout=(value)
      @clients.each do |client|
        client.timeout = value
      end
    end
  end
end
