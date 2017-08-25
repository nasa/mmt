# :nodoc:
class VariablesController < ManageVariablesController
  before_action :set_variable, only: [:show, :edit, :destroy]
  before_action :set_schema, only: [:show, :edit]
  before_action :set_form, only: [:show, :edit]
  before_action :ensure_correct_variable_provider, only: [:edit, :destroy]

  add_breadcrumb 'Variables' # there is no variables index action, so not providing a link

  def show
    add_breadcrumb @variable.fetch('Name', '<Blank Name>'), variable_path(params[:id])
  end

  def edit
    if @native_id
      draft = VariableDraft.create_from_variable(@variable, current_user, @native_id)
      Rails.logger.info("Audit Log: Variable Draft for #{draft.entry_title} was created by #{current_user.urs_uid} in provider #{current_user.provider_id}")
      flash[:success] = I18n.t('controllers.draft.variable_drafts.create.flash.success')
      redirect_to variable_draft_path(draft)
    else
      # if we cannot locate the native_id for the Variable, we should discontinue editing
      redirect_to variable_path(@concept_id, revision_id: @revision_id), flash: { error: I18n.t('controllers.variables.edit.flash.native_id_error') }
    end
  end

  def create
    variable_draft = VariableDraft.find(params[:id])

    ingested = cmr_client.ingest_variable(variable_draft.draft.to_json, variable_draft.provider_id, variable_draft.native_id, token)

    if ingested.success?
      # get information for publication email notification before draft is deleted
      Rails.logger.info("Audit Log: Variable Draft #{variable_draft.entry_title} was published by #{current_user.urs_uid} in provider: #{current_user.provider_id}")
      short_name = variable_draft.short_name

      # Delete draft
      variable_draft.destroy

      concept_id = ingested.body['concept-id']
      revision_id = ingested.body['revision-id']

      # instantiate and deliver notification email
      DraftMailer.variable_draft_published_notification(get_user_info, concept_id, revision_id, short_name).deliver_now

      redirect_to variable_path(concept_id, revision_id: revision_id), flash: { success: I18n.t('controllers.variables.create.flash.success') }
    else
      # Log error message
      Rails.logger.error("Ingest Variable Metadata Error: #{ingested.inspect}")
      Rails.logger.info("User #{current_user.urs_uid} attempted to ingest variable draft #{variable_draft.entry_title} in provider #{current_user.provider_id} but encountered an error.")
      @ingest_errors = generate_ingest_errors(ingested)

      redirect_to variable_draft_path(variable_draft), flash: { error: I18n.t('controllers.variables.create.flash.error') }
    end
  end

  def destroy
    delete = cmr_client.delete_variable(@provider_id, @native_id, token)
    if delete.success?
      flash[:success] = I18n.t('controllers.variables.destroy.flash.success')
      Rails.logger.info("Audit Log: Variable with native_id #{@native_id} was deleted for #{@provider_id} by #{session[:urs_uid]}")

      redirect_to manage_variables_path
    else
      flash[:error] = I18n.t('controllers.variables.destroy.flash.error')
      render :show
    end
  end

  private

  def set_variable
    @concept_id = params[:id]
    @revision_id = params[:revision_id]

    # retrieve the variable metadata
    variable_concept_response = cmr_client.get_concept(@concept_id, token, {}, @revision_id)

    @variable = if variable_concept_response.success?
                  variable_concept_response.body
                else
                  Rails.logger.error("Error retrieving concept for Variable #{@concept_id}: #{variable_concept_response.inspect}")
                  {}
                end

    set_variable_information
  end

  def set_variable_information
    # search for variable by concept id to get the native_id and provider_id
    # if the variable is not found, try again because CMR might be a little slow to index if it is a newly published record
    attempts = 0
    while attempts < 20
      variables_search_response = cmr_client.get_variables(concept_id: @concept_id)

      variable_data = if variables_search_response.success?
                        variables_search_response.body['items'].first
                      else
                        {}
                      end

      break if !variable_data.nil? && variable_data.fetch('meta', {})['concept-id'] == @concept_id
      attempts += 1
      sleep 0.05
    end

    if variable_data.blank?
      Rails.logger.error("Error searching for Variable #{@concept_id}: #{variables_search_response.inspect}")
    else
      @provider_id = variable_data.fetch('meta', {})['provider-id']
      @native_id = variable_data.fetch('meta', {})['native-id']
    end
  end

  def set_schema
    @schema = UmmJsonSchema.new('umm-var-json-schema.json')
    @schema.fetch_references(@schema.parsed_json)
  end

  def set_form
    @json_form = UmmJsonForm.new('umm-var-form.json', @schema, @variable, 'field_prefix' => 'variable_draft/draft')
  end

  def ensure_correct_variable_provider
    return if @provider_id == current_user.provider_id

    @variable_action = if request.original_url.include?('edit')
                         'edit'
                       elsif request.original_url.include?('delete')
                         'delete'
                       end

    @user_permissions = if available_provider?(@provider_id)
                          'wrong_provider'
                        else
                          'none'
                        end

    render :show
  end
end
