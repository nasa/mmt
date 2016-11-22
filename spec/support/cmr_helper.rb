module Helpers
  module CmrHelper
    def cmr_client
      Cmr::Client.client_for_environment(Rails.configuration.cmr_env, Rails.configuration.services)
    end

    # Synchronously wait for CMR to complete the ingest work
    def wait_for_cmr
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::CmrHelper#wait_for_cmr' do
        # Wait for the CMR queue to be empty
        cmr_conn = Faraday.new(url: 'http://localhost:2999')
        cmr_response = cmr_conn.post('message-queue/wait-for-terminal-states')

        Rails.logger.error "Error checking CMR Queue [#{cmr_response.status}] #{cmr_response.body}" unless cmr_response.success?

        # Refresh the ElasticSearch index
        elastic_conn = Faraday.new(url: 'http://localhost:9210')
        elastic_response = elastic_conn.get('_refresh')
        
        Rails.logger.error "Error refreshing ElasticSearch [#{elastic_response.status}] #{elastic_response.body}" unless elastic_response.success?
      end
    end
  end
end
