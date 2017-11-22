# :nodoc:
class BulkUpdatesController < ManageCollectionsController
  include BulkUpdates
  include ControlledKeywords
  before_filter :bulk_updates_enabled?

  add_breadcrumb 'Bulk Updates', :bulk_updates_path

  RESULTS_PER_PAGE = 25

  def index
    # Default the page to 1
    page = params.fetch('page', 1)

    bulk_updates_list = retrieve_bulk_updates

    @bulk_updates = Kaminari.paginate_array(bulk_updates_list, total_count: bulk_updates_list.count).page(page).per(RESULTS_PER_PAGE)
  end

  def show
    @task_id = params[:id]
    @task = {}

    bulk_update_status_response = cmr_client.get_bulk_update(current_user.provider_id, @task_id, token)
    if bulk_update_status_response.success?
      @task = bulk_update_status_response.body

      add_breadcrumb @task.fetch('name'), bulk_update_path(@task_id)

      hydrate_task(@task)
      hydrate_collections(@task)
    else
      Rails.logger.error("Error retrieving Bulk Update Task: #{bulk_update_status_response.inspect}")
    end
  end

  def new
    if params[:selected_collections].blank?
      redirect_to new_bulk_updates_search_path
    else
      add_breadcrumb 'New', new_bulk_updates_path

      set_science_keywords
      set_location_keywords
      set_data_centers
      set_platform_types
      set_instruments

      set_science_keyword_facets(params[:selected_collections])
    end
  end

  def preview
    add_breadcrumb 'Preview', bulk_update_preview_path

    @task = construct_task(params)

    @collections = retrieve_task_collections
  end

  def create
    @task = construct_task(params)
    ensure_correct_data_center_update_value(@task)

    bulk_update_response = cmr_client.create_bulk_update(current_user.provider_id, @task, token)

    if bulk_update_response.success?
      redirect_to bulk_update_path(bulk_update_response.body['task-id']), flash: { success: 'Bulk Update was successfully created.' }
    else
      Rails.logger.error("Error creating Bulk Update: #{bulk_update_response.inspect}")
      flash[:error] = Array.wrap(bulk_update_response.body['errors'])[0]

      @collections = retrieve_task_collections

      render :preview
    end
  end

  private

  def construct_task(params)
    # CMR expects update-field values to be in ALL_CAPS with underscores, but the
    # downcase version works better for Rails partials, so we need to
    # make sure to upcase them before sending to CMR

    bulk_update_object = {
      'concept-ids'   => params['concept_ids'],
      'name'          => params['name'],
      'update-field'  => params['update_field'].upcase,
      'update-type'   => params['update_type']
    }

    params['update_value'] = fix_location_category(params.fetch('update_value', {}))
    params['find_value'] = fix_location_category(params.fetch('find_value', {}))

    # Requirements from the Bulk Updates Wiki
    # IF type FIND_AND_REMOVE or FIND_AND_REPLACE or FIND_AND_UPDATE, Find value required
    # IF NOT type FIND_AND_REMOVE, New value required
    if params['update_type'] == 'FIND_AND_REMOVE' || params['update_type'] == 'FIND_AND_REPLACE' || params['update_type'] == 'FIND_AND_UPDATE'
      bulk_update_object['find-value'] = prune_science_keyword(params['find_value'])
    end

    unless params['update_type'] == 'FIND_AND_REMOVE'
      bulk_update_object['update-value'] = prune_science_keyword(params.fetch('update_value', {}).to_hash.to_camel_keys)
    end

    bulk_update_object
  end

  def retrieve_task_collections
    if @task['concept-ids'].blank?
      []
    else
      collections_response = cmr_client.get_collections_by_post({ concept_id: @task['concept-ids'], page_size: @task['concept-ids'].count }, token)

      if collections_response.success?
        collections_response.body['items']
      else
        []
      end
    end
  end

  def prune_science_keyword(keyword)
    return {} if keyword.blank?

    # we are only concerned with passing along science keyword key-value pairs
    # that have a value, so we are deleting any that do not
    BulkUpdatesHelper::SCIENCE_KEYWORDS_HIERARCHY.reverse.each do |level|
      keyword.delete(level) if keyword[level].blank?
    end
    BulkUpdatesHelper::LOCATION_KEYWORDS_HIERARCHY.reverse.each do |level|
      keyword.delete(level) if keyword[level].blank?
    end

    keyword
  end

  # Form validation doesn't work with two different fields named 'Category',
  # so we named one of them 'LocationCategory'. This method renames
  # 'LocationCategory' to 'Category' to match the schema. It also puts
  # it at the front of the hash so everything looks pretty
  def fix_location_category(keyword)
    if keyword['LocationCategory']
      category = keyword.delete('LocationCategory')
      keyword = { 'Category': category }.merge(keyword)
    end
    keyword
  end

  # comment about special case
  def ensure_correct_data_center_update_value(task)
    if task['update-type'] == 'FIND_AND_UPDATE' && task['update-value'].key?('ContactInformation')
      task['update-type'] = 'FIND_AND_UPDATE_HOME_PAGE_URL'
    end
  end
end
