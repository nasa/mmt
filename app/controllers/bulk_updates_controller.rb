# :nodoc:
class BulkUpdatesController < ManageMetadataController
  before_filter :bulk_updates_enabled?

  add_breadcrumb 'Bulk Updates', :bulk_updates_path

  def index
    @tasks = []

    bulk_updates_list_response = cmr_client.get_bulk_updates(current_user.provider_id, token)

    if bulk_updates_list_response.success?
      @tasks = bulk_updates_list_response.body.fetch('tasks', [])
    else
      Rails.logger.error("Error retrieving Bulk Updates Jobs List: #{bulk_updates_list_response.inspect}")
    end
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
end
