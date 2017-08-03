# :nodoc:
class VariablesController < ManageMetadataController
  before_action :set_variable, only: [:show, :edit]

  def show
  end

  def edit
    draft = VariableDraft.create_from_variable(@variable, current_user, @native_id)
    Rails.logger.info("Audit Log: Variable Draft for #{draft.entry_title} was created by #{current_user.urs_uid} in provider #{current_user.provider_id}")
    flash[:success] = I18n.t('controllers.draft.variable_drafts.create.flash.success')
    redirect_to variable_draft_path(draft)
  end

  def create
    @variable_draft = VariableDraft.find(params[:id])

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

      redirect_to variable_draft_path(variable_draft, flash: { error: I18n.t('controllers.variables.create.flash.error') })
    end
  end

  private


  def set_variable
    @concept_id = params[:id]
    @revision_id = params[:revision_id]

    # search for variable by concept id to get the native_id
    variables_search_response = cmr_client.get_variables({ concept_id: @concept_id })#.body['items']

    variable_data = if variables_search_response.success?
                      variables_search_response.body['items'].first
                    else
                      Rails.logger.error("Error searching for Variable #{@concept_id}: #{variables_search_response.inspect}")
                      {}
                    end

    @provider_id = variable_data['provider_id']
    @native_id = variable_data['native_id']

    # retrieve the variable metadata
    variable_concept_response = cmr_client.get_concept(@concept_id, token, {}, @revision_id)

    @variable = if variable_concept_response.success?
                  variable_concept_response.body
                else
                  Rails.logger.error("Error retrieving concept for Variable #{@concept_id}: #{variable_concept_response.inspect}")
                  {}
                end
  end
end
