# :nodoc:
class ServicesController < ManageServicesController
  include ManageMetadataHelper

  before_action :set_service, only: [:show, :edit, :clone, :destroy, :revisions, :revert, :download_json]
  before_action :set_schema, only: [:show, :edit, :clone, :destroy]
  before_action :set_form, only: [:show, :edit, :clone, :destroy]
  before_action :ensure_correct_service_provider, only: [:edit, :clone, :destroy]
  before_action :set_preview, only: [:show]

  add_breadcrumb 'Services' # there is no services index action, so not providing a link

  def show
    if params[:not_authorized_request_params]
      @record_action = 'manage-collection-associations' if params.fetch(:not_authorized_request_params, {})['controller'] == 'collection_associations'

      set_user_permissions
    end

    @draft = ServiceDraft.where(provider_id: @provider_id, native_id: @native_id).first

    add_breadcrumb breadcrumb_name(@service, 'service'), service_path(params[:id])
  end

  def edit
    if @native_id
      draft = ServiceDraft.create_from_service(@service, current_user, @native_id)
      Rails.logger.info("Audit Log: Service Draft for #{draft.entry_title} was created by #{current_user.urs_uid} in provider #{current_user.provider_id}")
      redirect_to service_draft_path(draft), flash: { success: I18n.t('controllers.draft.service_drafts.create.flash.success') }
    else
      Rails.logger.info("User #{current_user.urs_uid} attempted to edit Service #{@concept_id} in provider #{current_user.provider_id} but a Service Draft was not created to edit because there was no native_id (#{@native_id}) found.")
      # if we cannot locate the native_id for the Service, we should discontinue editing
      redirect_to service_path(@concept_id, revision_id: @revision_id), flash: { error: I18n.t('controllers.services.edit.flash.native_id_error') }
    end
  end

  def clone
    draft = ServiceDraft.create_from_service(@service, current_user, nil)
    Rails.logger.info("Audit Log: Cloned Service Draft for #{draft.short_name} was created by #{current_user.urs_uid} in provider #{current_user.provider_id}")
    flash[:notice] = view_context.link_to I18n.t('controllers.services.clone.flash.notice'), edit_service_draft_path(draft, 'service_information', anchor: 'service_draft_draft_name')
    redirect_to service_draft_path(draft)
  end

  def create
    service_draft = ServiceDraft.find(params[:id])

    ingested_response = cmr_client.ingest_service(service_draft.draft.to_json, service_draft.provider_id, service_draft.native_id, token)

    if ingested_response.success?
      # get information for publication email notification before draft is deleted
      Rails.logger.info("Audit Log: Service Draft #{service_draft.entry_title} was published by #{current_user.urs_uid} in provider: #{current_user.provider_id}")
      short_name = service_draft.short_name

      # Delete draft
      service_draft.destroy

      concept_id = ingested_response.body['concept-id']
      revision_id = ingested_response.body['revision-id']

      # instantiate and deliver notification email
      DraftMailer.service_draft_published_notification(get_user_info, concept_id, revision_id, short_name).deliver_now

      redirect_to service_path(concept_id, revision_id: revision_id), flash: { success: I18n.t('controllers.services.create.flash.success') }
    else
      # Log error message
      Rails.logger.error("Ingest Service Metadata Error: #{ingested_response.inspect}")
      Rails.logger.info("User #{current_user.urs_uid} attempted to ingest service draft #{service_draft.entry_title} in provider #{current_user.provider_id} but encountered an error.")

      @ingest_errors = generate_ingest_errors(ingested_response)
      redirect_to service_draft_path(service_draft), flash: { error: ingested_response.error_message(i18n: I18n.t('controllers.services.create.flash.error')) }
    end
  end

  def destroy
    delete_response = cmr_client.delete_service(@provider_id, @native_id, token)

    if delete_response.success?
      flash[:success] = I18n.t('controllers.services.destroy.flash.success')
      Rails.logger.info("Audit Log: Service #{@concept_id} with native_id #{@native_id} was deleted for #{@provider_id} by #{session[:urs_uid]}")

      redirect_to service_revisions_path(id: delete_response.body['concept-id'], revision_id: delete_response.body['revision-id'])
    else
      Rails.logger.error("Delete Service Error: #{delete_response.inspect}")
      Rails.logger.info("User #{current_user.urs_uid} attempted to delete Service #{@concept_id} with native_id #{@native_id} in provider #{@provider_id} but encountered an error.")

      flash[:error] = delete_response.error_message(i18n: I18n.t('controllers.services.destroy.flash.error'))
      render :show
    end
  end

  def revisions
    add_breadcrumb breadcrumb_name(@service, 'services'), service_path(@concept_id)
    add_breadcrumb 'Revision History', service_revisions_path(@concept_id)
  end

  def revert
    latest_revision_id = @revisions.first['meta']['revision-id']

    # Ingest revision
    ingested_response = cmr_client.ingest_service(@service.to_json, @provider_id, @native_id, token)

    if ingested_response.success?
      flash[:success] = I18n.t('controllers.services.revert.flash.success')
      Rails.logger.info("Audit Log: Service Revision for record #{@concept_id} with native_id: #{@native_id} for provider: #{@provider_id} by user #{session[:urs_uid]} has been successfully revised")
      redirect_to service_revisions_path(revision_id: latest_revision_id.to_i + 1)
    else
      Rails.logger.error("Ingest (Revert) Service Error: #{ingested_response.inspect}")
      Rails.logger.info("User #{current_user.urs_uid} attempted to revert Service #{@concept_id} by ingesting a previous revision in provider #{current_user.provider_id} but encountered an error.")

      @errors = generate_ingest_errors(ingested_response)
      flash[:error] = ingested_response.error_message(i18n: I18n.t('controllers.services.revert.flash.error'))
      render action: 'revisions'
    end
  end

  def download_json
    send_data @service.to_json, type: 'application/json; charset=utf-8', disposition: "attachment; filename=#{@concept_id}.json"
  end

  private

  def set_schema
    @schema = UmmJsonSchema.new('services', 'umm-s-json-schema.json')
    @schema.fetch_references(@schema.parsed_json)
  end

  def set_form
    @json_form = UmmJsonForm.new('services', 'umm-s-form.json', @schema, @service, field_prefix: 'service_draft/draft')
  end

  def set_preview
    @preview = UmmPreview.new(
      schema_type: 'services',
      preview_filename: 'umm-s-preview.json',
      data: @service,
      id: nil,
      resource_name: 'service'
    )
  end

  def ensure_correct_service_provider
    return if current_provider?(@provider_id)

    set_record_action

    set_user_permissions

    render :show
  end
end
