# :nodoc:
module EchoSoap
  extend ActiveSupport::Concern

  # Get the provider data from ECHO by the provider Guid
  def get_provider_by_guid(provider_guid)
    # Dont bother searching if the provided information is nil
    return {} if provider_guid.nil?

    @result ||= echo_client.get_provider_names(token_with_client_id, provider_guid)

    # The result is nil if there is nothing to return
    return @result.parsed_body.fetch('Item', {}) if @result.success?

    {}
  end

  # Get the provider data from ECHO by the provider Name
  def get_provider(provider_id)
    # Dont bother searching if the provided information is nil
    return {} if provider_id.nil?

    @result ||= echo_client.get_provider_names(token_with_client_id, nil)

    # The result is nil if there is nothing to return
    if @result.success?
      providers = @result.parsed_body.fetch('Item', {})

      # Look for the current provider in the list, this will get us the guid we need
      Array.wrap(providers).each do |provider|
        # If we find the provider we're looking for, ask ECHO for the DQSDs
        return provider if provider.fetch('Name', nil) == provider_id
      end
    end
    
    {}
  end

  def get_provider_guid(provider_id)
    # Dont bother searching if the provided information is nil
    return nil if provider_id.nil?

    get_provider(provider_id).fetch('Guid', nil)
  end

  def get_provider_name(provider_id)
    # Dont bother searching if the provided information is nil
    return nil if provider_id.nil?

    get_provider(provider_id).fetch('Name', nil)
  end

  # Retrieve the current provider guid based on the provider id
  def current_provider_guid
    @current_provider_guid ||= get_provider_guid(current_user.provider_id)
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

    @summaries.sort_by! { |summary| summary.parsed_body['Name'].downcase }
  end

  # Get all of the collections for the current provider
  def set_collections
    # Initialize the collections array to provide to the view
    @collections = []

    # Default the params that we'll send to CMR
    collection_params = {
      provider_id: current_user.provider_id,
      page_num: 1,
      page_size: 50
    }

    # Retrieve the first page of collections
    response = cmr_client.get_collections_by_post(collection_params, token)

    # Request collections
    until response.error? || response.body['items'].empty?
      # Add the retrieved collections to our array
      @collections.concat(response.body['items'])

      # Tests within this controller family mock the response of `get_collections`
      # which means that the criteria set to break on will never be met and will
      # result in an infinite loop
      break if Rails.env.test?

      # Increment the page number
      collection_params[:page_num] += 1

      # Request the next page
      response = cmr_client.get_collections_by_post(collection_params, token)
    end

    @collections
  end
end
