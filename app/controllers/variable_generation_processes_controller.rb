# :nodoc:
class VariableGenerationProcessesController < ManageVariablesController
  before_action :uvg_enabled?

  def create
    payload = {}
    payload[:collection_concept_id] = params[:selected_collection]
    payload[:provider] = current_user.provider_id
    uvg_parameters = { payload: payload }

    response = cmr_client.uvg_generate(uvg_parameters)

    if response.success?
      full_response = response.body
      @variables = full_response.fetch('variables', [])
      @collection_id = full_response.fetch('collection_concept_id', 'not found')
      @statistics = full_response.fetch('statistics', {})

      flash.now[:success] = "#{@variables.count} UMM Variables generated from collection #{@collection_id}"
      render :show
    else
      Rails.logger.error "User #{current_user.urs_uid} encountered an error with an UMM Variable Generation request: #{response.body.inspect}"
      redirect_to new_variable_generation_processes_search_path, flash: { error: response.error_message } # need to pass in/create i18n message?
    end
  end

  def show; end
end
