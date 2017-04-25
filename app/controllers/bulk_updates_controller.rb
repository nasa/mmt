# nodoc
class BulkUpdatesController < ApplicationController

  add_breadcrumb 'Bulk Updates', :bulk_updates_path

  # RESULTS_PER_PAGE = 25

  def index
    @provider_id = current_user.provider_id

    @tasks = []
    # pagination? Response does not have `hits`
    # @filters = { page_size: RESULTS_PER_PAGE }
    # # default page to 1
    # page = params.fetch('page', 1)
    # @filters[:page_num] = page.to_i

    bulk_updates_jobs_response = cmr_client.get_bulk_updates_tasks_list(@provider_id, token) # TODO add filters for pagination?

    if bulk_updates_jobs_response.success?
      @tasks = bulk_updates_jobs_response.body.fetch('tasks', [])
      @http_status = bulk_updates_jobs_response.body.fetch('status', nil)
    else
      Rails.logger.error("Error retrieving Bulk Updates Jobs List: #{bulk_updates_jobs_response.inspect}")
      flash[:error] = Array.wrap(bulk_updates_jobs_response.body['errors'])[0]
    end
  end

  def show
    @concept_id = params[:id]
    @provider_id = current_user.provider_id

    task = {}

    task_status_response = cmr_client.bulk_updates_task_status(@provider_id, @concept_id, token)
    if task_status_response.success?
      task = task_status_response.body
      @http_status = task.fetch('status', nil)
      @task_status = task.fetch('task-status', 'unknown')
      @status_message = task.fetch('status-message', 'unknown')
      @task_errors = task.fetch('collection-statuses', [])

      add_breadcrumb @concept_id, bulk_update_path(@concept_id)
    else
      Rails.logger.error("Error retrieving Bulk Update Task: #{task_status_response.inspect}")
      flash[:error] = Array.wrap(task_status_response.body['errors'])[0]
    end
  end
end
