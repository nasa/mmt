# :nodoc:
class BulkUpdatesController < ManageCollectionsController
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

      add_breadcrumb @task_id, bulk_update_path(@task_id)

      hydrate_task(@task)
      hydrate_collections(@task)
    else
      Rails.logger.error("Error retrieving Bulk Update Task: #{bulk_update_status_response.inspect}")
    end
  end

  def new
    redirect_to new_bulk_updates_search_path if request.get?

    add_breadcrumb 'New', new_bulk_updates_path

    @science_keywords = cmr_client.get_controlled_keywords('science_keywords')
  end

  def preview
    redirect_to new_bulk_updates_search_path if request.get?

    add_breadcrumb 'Preview', bulk_update_preview_path

    @task = construct_task(params)

    @collections = retrieve_task_collections
  end

  def create
    @task = construct_task(params)

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
      'update-field'  => params['update_field'].upcase,
      'update-type'   => params['update_type']
    }

    # Requirements from the Bulk Updates Wiki
    # If type FIND_AND_REMOVE or FIND_AND_REPLACE, Find value required
    # If NOT type FIND_AND_REMOVE, New value required
    if params['update_type'] == 'FIND_AND_REMOVE' || params['update_type'] == 'FIND_AND_REPLACE'
      bulk_update_object['find-value'] = prune_science_keyword(params['find_value'])
    end

    unless params['update_type'] == 'FIND_AND_REMOVE'
      bulk_update_object['update-value'] = prune_science_keyword(params['update_value'])
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

    keyword
  end
end
