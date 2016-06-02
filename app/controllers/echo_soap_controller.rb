class EchoSoapController < ApplicationController
  def get_provider_guid(provider_id)
    # Dont bother searching if the provided information is nil
    return nil if provider_id.nil?

    result = echo_client.get_provider_names(token_with_client_id, nil).parsed_body

    # The result is nil if there is nothing to return
    if result
      providers = result.fetch('Item', [])

      # Look for the current provider in the list, this will get us the guid we need
      providers.each do |provider|
        # If we find the provider we're looking for, ask ECHO for the DQSDs
        if provider.fetch('Name', nil) == provider_id
          return provider.fetch('Guid', nil)
        end
      end
    end
  end

  def current_provider_guid
    if @current_provider_guid.nil?
      @current_provider_guid = get_provider_guid(@current_user.provider_id)
    end

    @current_provider_guid
  end

  def set_summaries
    response = echo_client.get_data_quality_summary_definition_name_guids(token_with_client_id, current_provider_guid)

    summary_guids = []
    # No ruby idioms exist that will allow us to ensure this is a list, because it
    # is a list of dictionaries, not a list of strings
    unless response.error? || response.parsed_body.nil?
      parsed_response = response.parsed_body.fetch('Item', [])
      if parsed_response.is_a?(Hash)
        summary_guids << parsed_response.fetch('Guid', nil)
      else
        parsed_response.each do |item|
          summary_guids << item.fetch('Guid', nil)
        end
      end
      summary_guids = summary_guids.reject(&:blank?)
    end

    @summaries = []
    summary_guids.each do |guid|
      @summaries << echo_client.get_data_quality_summary_definition(token_with_client_id, guid)
    end
  end

  def set_collections
    @collections = cmr_client.get_collections({ provider_id: @current_user.provider_id }, token).body.fetch('items', [])
  end
end
