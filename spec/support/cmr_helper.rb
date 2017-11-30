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
        elastic_response = elastic_conn.post('_refresh')

        Rails.logger.error "Error refreshing ElasticSearch [#{elastic_response.status}] #{elastic_response.body}" unless elastic_response.success?
      end
    end

    def cmr_success_response(response_body)
      Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(response_body)))
    end

    def create_provider(provider_name)
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::CmrHelper#create_provider' do
        cmr_conn = Faraday.new
        provider_response = cmr_conn.post do |req|
          req.url('http://localhost:3002/providers')
          req.headers['Content-Type'] = 'application/json'
          req.headers['Echo-Token'] = 'mock-echo-system-token'

          # CMR expects double quotes in the JSON body
          req.body = "{\"provider-id\": \"#{provider_name}\", \"short-name\": \"#{provider_name}\", \"cmr-only\": true}"
        end

        raise Array.wrap(JSON.parse(provider_response.body)['errors']).join(' /// ') unless provider_response.success?

        wait_for_cmr
      end
    end

    def delete_provider(provider_id)
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::CmrHelper#delete_provider' do
        cmr_conn = Faraday.new
        provider_response = cmr_conn.delete do |req|
          req.headers['Echo-Token'] = 'mock-echo-system-token'
          req.url("http://localhost:3002/providers/#{provider_id}")
        end

        raise Array.wrap(JSON.parse(provider_response.body)['errors']).join(' /// ') unless provider_response.success?

        wait_for_cmr
      end
    end
  end
end
