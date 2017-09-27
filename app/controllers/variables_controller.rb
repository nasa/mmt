# :nodoc:
class VariablesController < ManageVariablesController
  include ManageMetadataHelper

  before_action :set_variable, only: [:show, :edit, :clone, :destroy, :revisions, :revert, :download_json]
  before_action :set_schema, only: [:show, :edit, :clone, :destroy]
  before_action :set_form, only: [:show, :edit, :clone, :destroy]
  before_action :ensure_correct_variable_provider, only: [:edit, :clone, :destroy]

  add_breadcrumb 'Variables' # there is no variables index action, so not providing a link

  def show
    if params[:not_authorized_request_params]
      @record_action = 'manage-collection-associations' if params.fetch(:not_authorized_request_params, {})['controller'] == 'collection_associations'

      set_user_permissions
    end

    @draft = VariableDraft.where(provider_id: @provider_id, native_id: @native_id).first

    add_breadcrumb breadcrumb_name(@variable, 'variable'), variable_path(params[:id])
  end

  def edit
    if @native_id
      draft = VariableDraft.create_from_variable(@variable, current_user, @native_id)
      Rails.logger.info("Audit Log: Variable Draft for #{draft.entry_title} was created by #{current_user.urs_uid} in provider #{current_user.provider_id}")
      redirect_to variable_draft_path(draft), flash: { success: I18n.t('controllers.draft.variable_drafts.create.flash.success') }
    else
      Rails.logger.info("User #{current_user.urs_uid} attempted to edit Variable #{@concept_id} in provider #{current_user.provider_id} but a Variable Draft was not created to edit because there was no native_id (#{@native_id}) found.")
      # if we cannot locate the native_id for the Variable, we should discontinue editing
      redirect_to variable_path(@concept_id, revision_id: @revision_id), flash: { error: I18n.t('controllers.variables.edit.flash.native_id_error') }
    end
  end

  def clone
    draft = VariableDraft.create_from_variable(@variable, current_user, nil)
    Rails.logger.info("Audit Log: Cloned Variable Draft for #{draft.short_name} was created by #{current_user.urs_uid} in provider #{current_user.provider_id}")
    flash[:notice] = view_context.link_to I18n.t('controllers.variables.clone.flash.notice'), edit_variable_draft_path(draft, 'variable_information', anchor: 'variable_draft_draft_name')
    redirect_to variable_draft_path(draft)
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
      Rails.logger.info("Audit Log: Variable #{@concept_id} with native_id #{@native_id} was deleted for #{@provider_id} by #{session[:urs_uid]}")

      redirect_to variable_revisions_path(id: delete.body['concept-id'], revision_id: delete.body['revision-id'])
    else
      Rails.logger.error("Delete Variable Metadata Error: #{delete.inspect}")
      Rails.logger.info("User #{current_user.urs_uid} attempted to delete Variable #{@concept_id} with native_id #{@native_id} in provider #{@provider_id} but encountered an error.")
      flash[:error] = I18n.t('controllers.variables.destroy.flash.error')
      render :show
    end
  end

  def revisions
    add_breadcrumb breadcrumb_name(@variable, 'variables'), variable_path(@concept_id)
    add_breadcrumb 'Revision History', variable_revisions_path(@concept_id)
  end

  def revert
    latest_revision_id = @revisions.first['meta']['revision-id']

    # Ingest revision
    ingested = cmr_client.ingest_variable(@variable.to_json, @provider_id, @native_id, token)

    if ingested.success?
      flash[:success] = I18n.t('controllers.variables.revert.flash.success')
      Rails.logger.info("Audit Log: Variable Revision for draft with native_id: #{@native_id} for provider: #{@provider_id} by user #{session[:urs_uid]} has been successfully revised")
      redirect_to variable_revisions_path(revision_id: latest_revision_id.to_i + 1)
    else
      Rails.logger.error("Ingest Metadata Error: #{ingested.inspect}")
      Rails.logger.info("User #{current_user.urs_uid} attempted to revert Variable #{@concept_id} by ingesting a previous revision in provider #{current_user.provider_id} but encountered an error.")

      @errors = generate_ingest_errors(ingested)

      flash[:error] = I18n.t('controllers.variables.revert.flash.error')
      render action: 'revisions'
    end
  end

  def download_json
    send_data @variable.to_json, type: 'application/json; charset=utf-8', disposition: "attachment; filename=#{@concept_id}.json"
  end

  private

  def set_schema
    @schema = UmmJsonSchema.new('umm-var-json-schema.json')
    @schema.fetch_references(@schema.parsed_json)
  end

  def set_form
    @json_form = UmmJsonForm.new('umm-var-form.json', @schema, @variable, 'field_prefix' => 'variable_draft/draft')
  end

  def ensure_correct_variable_provider
    return if current_provider?(@provider_id)

    set_record_action

    set_user_permissions

    render :show
  end
end
