# :nodoc:
class BulkUpdatesSearchesController < ManageMetadataController
  before_filter :bulk_updates_enabled?

  RESULTS_PER_PAGE = 25

  def new
    add_breadcrumb 'Bulk Update Collection Search', :new_bulk_updates_search_path

    cmr_params = {
      page_size: RESULTS_PER_PAGE,
      page_num: params['page'],
      provider: current_user.provider_id
    }

    # Default values
    collection_count = 0
    collection_results = []

    if search_params.key?(:field) && search_params.key?(:query)
      cmr_params[search_params[:field]] = search_params[:query].dup

      collection_response = cmr_client.get_collections_by_post(
        hydrate_params(cmr_params), token
      )

      if collection_response.success?
        collection_count = collection_response.body['hits']
        collection_results = collection_response.body['items']
      end
    end

    @collections = Kaminari.paginate_array(collection_results, total_count: collection_count).page(params['page']).per(RESULTS_PER_PAGE)
  end

  private

  def search_params
    params.permit(:query, :field)
  end

  # CMR requires some additional data in the payload when particular
  # keys are provided so we need to compensate for that here
  def hydrate_params(high_level_params)
    fancy = %w(
      archive_center
      data_center entry_title
      instrument
      platform
      processing_level_id
      project
      sensor
      short_name
      spatial_keyword
      version
    )

    fancy.each do |key|
      next unless high_level_params.key?(key)

      # Allow for wildcard searching
      high_level_params[key].concat('*')

      # In order to search with the wildcard parameter we need to tell CMR to use it
      high_level_params['options'] = {
        key => {
          'pattern'     => true,
          'ignore_case' => true
        }
      }
    end

    high_level_params
  end
end
