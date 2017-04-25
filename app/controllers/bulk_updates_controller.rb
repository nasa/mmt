# :nodoc:
class BulkUpdatesController < ManageMetadataController

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

    bulk_updates_jobs_response = cmr_client.get_bulk_updates_tasks_list(@provider_id, filters, token)

    if bulk_updates_jobs_response.success?
      @tasks = bulk_updates_jobs_response.body.fetch('tasks', [])
    else
      Rails.logger.error("Error retrieving Bulk Updates Jobs List: #{bulk_updates_jobs_response.inspect}")
      flash[:error] = Array.wrap(bulk_updates_jobs_response.body['errors'])[0]
    end
  end

  def show
    @concept_id = params[:id]
    @provider_id = current_user.provider_id

    @task = {}

    task_status_response = cmr_client.bulk_updates_task_status(@provider_id, @concept_id, token)
    if task_status_response.success?
      @task = task_status_response.body

      add_breadcrumb @concept_id, bulk_update_path(@concept_id)
    else
      Rails.logger.error("Error retrieving Bulk Update Task: #{task_status_response.inspect}")
      flash[:error] = Array.wrap(task_status_response.body['errors'])[0]
    end
  end
end
