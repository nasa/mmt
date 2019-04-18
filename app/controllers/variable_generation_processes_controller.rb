# :nodoc:
class VariableGenerationProcessesController < ManageVariablesController
  before_action :uvg_enabled?, :log_before_timestamp
  after_action :log_after_timestamp

  def create
    payload = {}
    payload[:collection_concept_id] = params[:selected_collection]
    payload[:provider] = current_user.provider_id
    uvg_parameters = { payload: payload }

    # response = cmr_client.uvg_generate_stub(uvg_parameters)
    response = cmr_client.uvg_generate(uvg_parameters, token)

    # temporarily logging all responses
    # TODO: remove when UVG functionality is stable
    Rails.logger.debug "UVG Generate response: #{response.inspect}"

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
    # response = cmr_client.send("uvg_#{@operation}_stub", uvg_parameters)
    response = cmr_client.send("uvg_#{@operation}", uvg_parameters, token)

    # temporarily logging all responses
    # TODO: remove when UVG functionality is stable
    Rails.logger.debug "UVG Augment #{augmentation_type.titleize} response: #{response.inspect}"

    if response.success?
      full_response = response.body
      @variables = full_response.fetch('variables', [])
      @collection_id = full_response.fetch('collection_concept_id', 'not found')
      @statistics = full_response.fetch('statistics', {})

      flash.now[:success] = "#{@variables.count} UMM Variables Augmented with #{augmentation_type} from collection #{@collection_id} augmented with #{augmentation_type}"
      render :show
    else
      Rails.logger.error "User #{current_user.urs_uid} encountered an error with an UMM Variable Generation (UVG) Augmentation for #{params[:augmentation_type]} response: #{response.body.inspect}"

      @variables = JSON.parse(params[:variables_json])
      @variables_string = params[:variables_json]
      @collection_id = params[:collection_id]

      flash.now[:error] = response.error_message
      render :edit
    end
  end

  def save_variable_drafts

    @collection_id = params[:collection_id]
    generated_variables = JSON.parse(params[:variables_json])
    num_generated_vars = generated_variables.count

    import_result, drafts_saved = import_variable_drafts(generated_variables)

    # TODO: import_result may work slightly differently in SIT. once we are
    # able to test there we should verify that no other checks on `import_result` are needed
    if drafts_saved && import_result.failed_instances.blank? && import_result.num_inserts > 0
      Rails.logger.info "User #{current_user.urs_uid} successfully saved #{num_generated_vars} UMM Variable Generation (UVG) variable records generated from collection #{@collection_id} as Variable Drafts!"

      redirect_to manage_variables_path, flash: { success: "#{num_generated_vars} variable records generated from collection #{@collection_id} saved as Variable Drafts!" }
    else
      Rails.logger.error "User #{current_user.urs_uid} encountered an error trying to save #{num_generated_vars} UMM Variable Generation (UVG) generated variables. import_result: #{import_result}"

      @variables = generated_variables
      @operation = params[:operation]
      @statistics = JSON.parse(params[:statistics])

      flash.now[:error] = "#{num_generated_vars} generated variable records failed to save as Drafts"
      render :show
    end
  end

  private

  def import_variable_drafts(generated_variables)
    total_record_count = generated_variables.count
    # in case of failure, we need to preserve the original variables
    vars_to_save = generated_variables.dup
    first_generated_var = vars_to_save.shift

    mass_import_result = nil

    # transaction will return true if it is successful
    drafts_saved = VariableDraft.transaction do
                     first_var = create_single_variable_draft(first_generated_var)
                     Rails.logger.info "User #{current_user.urs_uid} is saving #{total_record_count} Variable Drafts from UMM Variable Generation (UVG) records generated from collection #{@collection_id}. The first variable draft was saved in the transaction: #{first_var.inspect}"

                     return if first_var.id.nil?

                     id_to_start = first_var.id + 1
                     mass_import_result = import_remaining_variable_drafts(vars_to_save, id_to_start)
                     Rails.logger.info "User #{current_user.urs_uid} is saving #{total_record_count} Variable Drafts from UMM Variable Generation (UVG) records generated from collection #{@collection_id} and saved the rest of the variable drafts. result: #{mass_import_result.inspect}"
                   end

    [mass_import_result, drafts_saved]
  end

  def create_single_variable_draft(generated_var)
    VariableDraft.create(
      user_id: current_user.id,
      draft: generated_var,
      provider_id: current_user.provider_id
    )
  end

  def import_remaining_variable_drafts(generated_variables, starting_id)
    variable_drafts = []

    generated_variables.each_with_index do |generated_var, index|
      variable_drafts << VariableDraft.new(
                           user_id: current_user.id,
                           provider_id: current_user.provider_id,
                           draft: generated_var,
                           entry_title: generated_var['LongName'],
                           short_name: generated_var['Name'],
                           native_id: "mmt_variable_#{starting_id + index}"
                         )
    end

    VariableDraft.import variable_drafts
  end

  def log_before_timestamp
    log_timestamp('Before starting')
  end

  def log_after_timestamp
    log_timestamp('After running')
  end

  def log_timestamp(starting_phrase)
    Rails.logger.debug "#{starting_phrase} running #{params[:controller].classify}##{params[:action]} at #{Time.now.to_i} by user #{current_user.urs_uid}"
  end
end
