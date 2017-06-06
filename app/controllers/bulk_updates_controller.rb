# :nodoc:
class BulkUpdatesController < ManageMetadataController
  before_filter :bulk_updates_enabled?

  add_breadcrumb 'Bulk Updates', :bulk_updates_path

  def index
    @tasks = retrieve_bulk_updates
  end

  def show
    @task_id = params[:id]
    @task = {}

    bulk_update_status_response = cmr_client.get_bulk_update(current_user.provider_id, @task_id, token)
    if bulk_update_status_response.success?
      @task = bulk_update_status_response.body

      add_breadcrumb @task_id, bulk_update_path(@task_id)
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

    @collections = if params[:concept_ids].blank?
                     []
                   else
                     collections_response = cmr_client.get_collections_by_post({ concept_id: params[:concept_ids], page_size: params[:concept_ids].count }, token)
                     if collections_response.success?
                       collections_response.body['items']
                     else
                       []
                     end
                   end
  end

  def create; end
end
