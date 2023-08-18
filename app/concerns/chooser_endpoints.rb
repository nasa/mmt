# Controller methods that allows developers to get this data without
# making an HTTP request (with the exception of the CMR call)
module ChooserEndpoints
  extend ActiveSupport::Concern

  def render_collections_for_chooser(collections)
    # The chooser expects an array of arrays, so that's what we'll give it
    items = collections.fetch('items', [])

    render json: {
      'hits': collections.fetch('hits', 0),
      'items': items.map do |collection|
        s3_links = Array.wrap(collection.dig('meta','s3-links')).map { |link| '<br><b>S3 Prefix:</b> ' + link }.join('')

        bucket = [
          collection.dig('meta','concept-id'),
          "#{collection.dig('umm','entry-id')} | #{collection.dig('umm','entry-title')}"
        ]
        bucket << s3_links unless s3_links.blank?
        bucket
      end
    }
  end

  # Retrieve collections from CMR
  def get_provider_collections(params = {})
    collection_params = {
      'provider' => current_user.provider_id,
      'page_size' => 500
    }.stringify_keys.merge(params.stringify_keys)

    Rails.logger.debug "Provider Collection Request parameters: #{collection_params}" unless request.xhr?

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
    response = cmr_client.get_collections_by_post(collection_params, token)
    if response.success?
      response.body
    else
      {}
    end
  end

end
