# :nodoc:
class VariableGenerationProcessesController < ManageVariablesController
  before_action :uvg_enabled?

  def create
    payload = {}
    payload[:collection_concept_id] = params[:selected_collection]
    payload[:provider] = current_user.provider_id
    uvg_parameters = { payload: payload }

    response = cmr_client.uvg_generate_stub(uvg_parameters)

    if response.success?
      full_response = response.body
      @operation = 'generate'
      @variables = full_response.fetch('variables', [])
      @collection_id = full_response.fetch('collection_concept_id', 'not found')
      @statistics = full_response.fetch('statistics', {})

      flash.now[:success] = "#{@variables.count} UMM Variables generated from collection #{@collection_id}"
      render :show
    else
      Rails.logger.error "User #{current_user.urs_uid} encountered an error with an UMM Variable Generation (UVG) request: #{response.body.inspect}"
      redirect_to new_variable_generation_processes_search_path, flash: { error: response.error_message } # need to pass in/create i18n message?
    end
  end

  def show; end

  def edit
    @variables = JSON.parse(params[:variables_json])
    @variables_string = params[:variables_json]
    @collection_id = params[:collection_id]
  end

  def update
    augmentation_type = params[:augmentation_type]

    payload = {}
    payload[:collection_concept_id] = params[:collection_id]
    payload[:provider] = current_user.provider_id
    payload[:variables] = JSON.parse(params[:variables_json])

    uvg_parameters = { payload: payload }

    @operation = "augment_#{augmentation_type}"
    response = cmr_client.send("uvg_#{@operation}_stub", uvg_parameters)

    if response.success?
      full_response = response.body
      @variables = full_response.fetch('variables', [])
      @collection_id = full_response.fetch('collection_concept_id', 'not found')
      @statistics = full_response.fetch('statistics', {})

      flash.now[:success] = "#{@variables.count} UMM Variables Augmented with #{augmentation_type} from collection #{@collection_id} augmented with #{augmentation_type}"
      render :show
    else
      Rails.logger.error "User #{current_user.urs_uid} encountered an error with an UMM Variable Generation (UVG) Augmentation for #{params[:augmentation_type]} request: #{response.body.inspect}"

      @variables = JSON.parse(params[:variables_json])
      @variables_string = params[:variables_json]
      @collection_id = params[:collection_id]

      flash.now[:error] = response.error_message
      render :edit
    end
  end
end
