# Controller methods that allows developers to get this data without
# making an HTTP request (with the exception of the CMR call)
module ProviderHoldings
  extend ActiveSupport::Concern

  def set_data_providers(token = nil)
    providers = cmr_client.get_providers.body

    providers.each do |provider|
      # Request the collections that belong to this provider
      holdings_response = cmr_client.get_provider_holdings(false, provider['provider-id'], token)

      # No additional work is necessary on error
      next if holdings_response.error?

      holdings = holdings_response.body

      # Append the additional information necessary for the view
      provider['collection_count'] = holdings.size
      provider['granule_count'] = holdings.map { |h| h['granule-count'] }.inject(:+) || 0
    end

    @providers = providers.sort_by { |provider| provider['short-name'] }
  end

  def set_provider_holdings(provider_id, token = nil)
    @collections = []

    provider_holdings_response = cmr_client.get_echo_provider_holdings(provider_id)

    @provider = provider_holdings_response.body.fetch('provider', {})

    if provider_holdings_response.success?
      content_type = "application/#{Rails.configuration.umm_version}; charset=utf-8"

      add_breadcrumb @provider['provider_id'], provider_holding_path(@provider['provider_id'])
      
      provider_holdings_response = cmr_client.get_provider_holdings(false, @provider['provider_id'], token)

      # Prevent processing the request if an error occurred
      return if provider_holdings_response.error?

      provider_holdings_response.body.each do |collection|
        concept_id = collection['concept-id']
        title = collection['entry-title']
        granules = collection['granule-count']

        collection_info = cmr_client.get_concept(concept_id, token, content_type).body

        @collections << {
          'id'         => concept_id,
          'title'      => title,
          'short_name' => collection_info['ShortName'],
          'version'    => collection_info['Version'],
          'granules'   => granules
        }
      end
    end
  end
end
