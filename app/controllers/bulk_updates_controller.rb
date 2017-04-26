# :nodoc:
class BulkUpdatesController < ManageMetadataController
  before_filter :bulk_updates_enabled?

  add_breadcrumb 'Bulk Updates', :bulk_updates_path

  def index
    @provider_id = current_user.provider_id

    @tasks = []

    # We cannot implement pagination yet, because the cmr dummy responses do not include it
    # when the response has `hits` and accepts page information, we should implement it in accordance with other resources (i.e. groups)
    filters = {}

    # filters[:page_size] = RESULTS_PER_PAGE
    # default page to 1
    # page = params.fetch('page', 1)
    # @filters[:page_num] = page.to_i

    bulk_updates_list_response = cmr_client.get_bulk_updates(@provider_id, filters, token)

    if bulk_updates_list_response.success?
      @tasks = bulk_updates_list_response.body.fetch('tasks', [])
    else
      Rails.logger.error("Error retrieving Bulk Updates Jobs List: #{bulk_updates_list_response.inspect}")
    end
  end

  def show
    @task_id = params[:id]
    @provider_id = current_user.provider_id

    @task = {}

    bulk_update_status_response = cmr_client.get_bulk_update(@provider_id, @task_id, token)
    if bulk_update_status_response.success?
      @task = bulk_update_status_response.body

      add_breadcrumb @task_id, bulk_update_path(@task_id)
    else
      Rails.logger.error("Error retrieving Bulk Update Task: #{bulk_update_status_response.inspect}")
    end
  end
end
