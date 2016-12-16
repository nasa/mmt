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
      @current_provider_guid = get_provider_guid(current_user.provider_id)
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
    response = cmr_client.get_collections(collection_params, token)

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
      response = cmr_client.get_collections(collection_params, token)
    end

    @collections
  end

  # Controller action tied to a route for retrieving provider collections
  def provider_collections
    render json: get_provider_collections(params.permit(:provider, :keyword, :page_size, :page_num, :short_name, concept_id: []))
  end

  # Controller method that allows developers to get this data without
  # making an HTTP request (with the exception of the CMR call)
  def get_provider_collections(params = {})
    collection_params = {
      'provider' => current_user.provider_id
    }.merge(params)

    if collection_params.key?('short_name')
      collection_params['short_name'].concat('*')

      # In order to search with the wildcard parameter we need to tell CMR to use it
      collection_params['options'] = {
        'short_name' => {
          'pattern' => true
        }
      }
    end

    # Adds wildcard searching
    collection_params['keyword'].concat('*') if collection_params.key?('keyword')

    # Retreive the collections from CMR, allowing a few additional parameters
    response = cmr_client.get_collections(collection_params, token)

    if response.success?
      # The chooser expects an array of arrays, so that's what we'll give it
      response.body.fetch('items', []).map do |collection|
        [
          collection.fetch('meta', {}).fetch('concept-id'),
          [
            collection.fetch('umm', {}).fetch('short-name'),
            collection.fetch('umm', {}).fetch('entry-title')
          ].join(' | ')
        ]
      end
    else
      response.body
    end
  end
end
