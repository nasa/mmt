# :nodoc:
class BasePublishedRecordController < ManageMetadataController
  include ManageMetadataHelper

  before_action :add_top_level_breadcrumbs

  def show
    if params[:not_authorized_request_params]
      @record_action = 'manage-collection-associations' if params.fetch(:not_authorized_request_params, {})['controller'] == 'collection_associations'

      set_user_permissions
    end

    @draft = draft_resource_class.where(provider_id: @provider_id, native_id: @native_id).first
    add_breadcrumb fetch_entry_id(get_resource, resource_name), send("#{resource_name}_path", params[:id])
  end

  def edit
    # grab the concept_id of the associated collection of latest
    associated_concept_id = @revisions.dig(0, 'associations', 'collections', 0, 'concept-id')

    if @native_id
      draft = draft_resource_class.send("create_from_#{resource_name}", get_resource, current_user, @native_id, associated_concept_id)
      Rails.logger.info("Audit Log: #{resource_name.classify} Draft for #{draft.entry_title} was created by #{current_user.urs_uid} in provider #{current_user.provider_id}")
      redirect_to send("#{resource_name}_draft_path", draft), flash: { success: I18n.t("controllers.draft.#{resource_name}_drafts.create.flash.success") }
    else
      Rails.logger.info("User #{current_user.urs_uid} attempted to edit #{resource_name.classify} #{@concept_id} in provider #{current_user.provider_id} but a #{resource_name.classify} Draft was not created to edit because there was no native_id (#{@native_id}) found.")
      # if we cannot locate the native_id for the Variable, we should discontinue editing
      redirect_to send("#{resource_name}_path", @concept_id, revision_id: @revision_id), flash: { error: I18n.t("controllers.#{plural_resource_name}.edit.flash.native_id_error") }
    end
  end

  def clone
    draft = draft_resource_class.send("create_from_#{resource_name}", get_resource, current_user, nil, nil)
    Rails.logger.info("Audit Log: Cloned #{capitalized_resource_name} Draft for #{draft.short_name} was created by #{current_user.urs_uid} in provider #{current_user.provider_id}")
    flash[:notice] = view_context.link_to I18n.t("controllers.#{plural_resource_name}.clone.flash.notice"), send("edit_#{resource_name}_draft_path", draft, "#{resource_name}_information", anchor: "#{resource_name}_draft_draft_name")
    redirect_to send("#{resource_name}_draft_path", draft)
  end

  # This may not be an intuitive way to publish variable_drafts, service_drafts,
  # and tool_drafts. Adding some terms people might search to find this as comments.
  # def publish_variable def publish_service def publish_tool
  def create
    draft = draft_resource_class.find(params[:id])
    user_token = token
    if Rails.env.development?
      user_token = 'ABC-1'
    end
    ingested_response = cmr_client.send("ingest_#{resource_name}", metadata: draft.draft.to_json, provider_id: draft.provider_id, native_id: draft.native_id, collection_concept_id: draft.collection_concept_id, token: user_token)

    if ingested_response.success?
      # get information for publication email notification before draft is deleted
      Rails.logger.info("Audit Log: #{capitalized_resource_name} Draft #{draft.entry_title} was published by #{current_user.urs_uid} in provider: #{current_user.provider_id}")
      short_name = draft.short_name

      # Delete draft
      draft.destroy

      concept_id = ingested_response.body['concept-id']
      revision_id = ingested_response.body['revision-id']

      begin
        # instantiate and deliver notification email
        DraftMailer.send("#{resource_name}_draft_published_notification", get_user_info, concept_id, revision_id, short_name).deliver_now
      rescue => e
        Rails.logger.error "Error trying to send email in #{self.class} Error: #{e}"
        flash[:error] = "Couldn't send confirmation email"
      end
      redirect_to send("#{resource_name}_path", concept_id, revision_id: revision_id), flash: { success: I18n.t("controllers.#{plural_resource_name}.create.flash.success") }
    else
      # Log error message
      Rails.logger.error("Ingest #{capitalized_resource_name} Metadata Error: #{ingested_response.clean_inspect}")
      Rails.logger.info("User #{current_user.urs_uid} attempted to ingest #{resource_name} draft #{draft.entry_title} in provider #{current_user.provider_id} but encountered an error.")

      @ingest_errors = generate_ingest_errors(ingested_response)
      flash[:error] = ingested_response.error_message(i18n: I18n.t("controllers.#{plural_resource_name}.create.flash.error"), force_i18n_preface: true)
      redirect_to send("#{resource_name}_draft_path", draft)
    end
  end

  def destroy
    delete_response = cmr_client.send("delete_#{resource_name}", @provider_id, @native_id, token)

    if delete_response.success?
      flash[:success] = I18n.t("controllers.#{plural_resource_name}.destroy.flash.success")
      Rails.logger.info("Audit Log: #{capitalized_resource_name} #{@concept_id} with native_id #{@native_id} was deleted for #{@provider_id} by #{session[:urs_uid]}")

      redirect_to send("#{resource_name}_revisions_path", id: delete_response.body['concept-id'], revision_id: delete_response.body['revision-id'])
    else
      Rails.logger.error("Delete #{capitalized_resource_name} Error: #{delete_response.clean_inspect}")
      Rails.logger.info("User #{current_user.urs_uid} attempted to delete #{capitalized_resource_name} #{@concept_id} with native_id #{@native_id} in provider #{@provider_id} but encountered an error.")

      set_preview

      flash[:error] = delete_response.error_message(i18n: I18n.t("controllers.#{plural_resource_name}.destroy.flash.error"))
      render :show
    end
  end

  def revisions
    add_breadcrumb fetch_entry_id(get_resource, plural_resource_name), send("#{resource_name}_path", @concept_id)
    add_breadcrumb 'Revision History', send("#{resource_name}_revisions_path", @concept_id)
  end

  def revert
    latest_revision_id = @revisions.dig(0, 'meta', 'revision-id')

    # grab the collection concept_id for the most recent revision;
    # we have decided to revert the metadata and leave the association alone
    # if users want or expect another behavior, we can respond to that feedback
    associated_concept_id = first_non_deleted_revision.dig('associations', 'collections', 0, 'concept-id')

    # Ingest revision
    ingested_response = cmr_client.send("ingest_#{resource_name}", metadata: get_resource.to_json, provider_id: @provider_id, collection_concept_id: associated_concept_id, native_id: @native_id, token: token)

    if ingested_response.success?
      flash[:success] = I18n.t("controllers.#{plural_resource_name}.revert.flash.success")
      Rails.logger.info("Audit Log: #{capitalized_resource_name} Revision for record #{@concept_id} with native_id: #{@native_id} for provider: #{@provider_id} by user #{session[:urs_uid]} has been successfully revised")
      redirect_to send("#{resource_name}_revisions_path", revision_id: latest_revision_id.to_i + 1)
    else
      Rails.logger.error("Ingest (Revert) #{capitalized_resource_name} Error: #{ingested_response.clean_inspect}")
      Rails.logger.info("User #{current_user.urs_uid} attempted to revert #{capitalized_resource_name} #{@concept_id} by ingesting a previous revision in provider #{current_user.provider_id} but encountered an error.")

      @errors = generate_ingest_errors(ingested_response)
      flash[:error] = ingested_response.error_message(i18n: I18n.t("controllers.#{plural_resource_name}.revert.flash.error"))
      render action: 'revisions'
    end
  end

  def download_json
    send_data get_resource.to_json, type: 'application/json; charset=utf-8', disposition: "attachment; filename=#{@concept_id}.json"
  end

  private

  def ensure_correct_provider
    return if current_provider?(@provider_id)

    set_record_action

    set_user_permissions

    set_preview

    compare_resource_umm_version

    render :show
  end

  def ensure_supported_version
    compare_resource_umm_version

    return if params[:action] == 'show' || !@unsupported_version

    set_preview

    render :show
  end

  def resource_schema_file; end

  def resource_form_file; end

  def resource_preview_schema; end

  def add_top_level_breadcrumbs
    add_breadcrumb capitalized_resource_name.pluralize
  end

  def set_schema
    @schema = JsonSchemaForm::UmmJsonSchema.new(plural_resource_name, resource_schema_file)
    @schema.fetch_references(@schema.parsed_json)
  end

  def set_form
    @json_form = JsonSchemaForm::UmmJsonForm.new(plural_resource_name, resource_form_file, @schema, get_resource, field_prefix: "#{resource_name}_draft/draft")
  end

  def set_preview
    @preview = JsonSchemaForm::UmmPreview.new(
      schema_type: resource_name,
      preview_filename: resource_preview_schema,
      data: get_resource
    )
  end

  # Returns the resource from the created instance variable
  # @return [Object]
  def get_resource
    instance_variable_get("@#{resource_name}")
  end
  helper_method :get_resource

  # The plural name for the resource class based on the controller
  # @return [String]
  def plural_resource_name
    @plural_resource_name ||= controller_name
  end

  # The singular name for the resource class based on the controller
  # @return [String]
  def resource_name
    @resource_name ||= plural_resource_name.singularize
  end

  # The resource class based on the controller
  # @return [Class]
  def resource_class
    # TODO does this need to have draft?
    @resource_class ||= resource_name.classify.constantize
  end

  # The resource class based on the controller. Slightly redundant for published resources, but may be helpful for methods shared with drafts
  # @return [Class]
  def published_resource_class
    @published_resource_class ||= resource_name.classify.pluralize.constantize
  end

  # The draft resource class associated with this resource
  # @return [Class]
  def draft_resource_class
    # TODO does this need to have draft?
    @draft_resource_class ||= "#{resource_name}_draft".classify.constantize
  end

  # The singular name for the resource class based on the controller
  # @return [String]
  # this is slightly redundant for published resources, but is useful for methods shared with drafts to ensure reference to the published resource
  def published_resource_name
    @published_resource_name ||= plural_resource_name.singularize
  end

  # The plural name for the resource class based on the controller
  # @return [String]
  # this is slightly redundant for published resources, but is useful for methods shared with drafts to ensure reference to the published resource
  def plural_published_resource_name
    @plural_published_resource_name ||= controller_name
  end

  # @return [String]
  def capitalized_resource_name
    resource_name.capitalize
  end

  def first_non_deleted_revision
    @revisions.reject { |revision| revision.dig('meta', 'deleted') }.first
  end
end
