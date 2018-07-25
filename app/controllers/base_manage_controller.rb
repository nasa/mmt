# :nodoc:
class BaseManageController < ManageMetadataController
  include ManageMetadataHelper

  def show
    Rails.logger.info ">>>>>>>>>>>>>>>>>>>>>> #{params[:not_authorized_request_params]}"
    if params[:not_authorized_request_params]
      @record_action = 'manage-collection-associations' if params.fetch(:not_authorized_request_params, {})['controller'] == 'collection_associations'

      set_user_permissions
    end

    @draft = resource_class.where(provider_id: @provider_id, native_id: @native_id).first
    add_breadcrumb breadcrumb_name(get_resource, resource_name), send("#{resource_name}_path", params[:id])
  end

  def edit
    if @native_id
      draft = resource_class.send("create_from_#{resource_name}", get_resource, current_user, @native_id)
      Rails.logger.info("Audit Log: #{resource_name.classify} Draft for #{draft.entry_title} was created by #{current_user.urs_uid} in provider #{current_user.provider_id}")
      redirect_to send("#{resource_name}_path", draft), flash: { success: I18n.t("controllers.draft.#{resource_name}_drafts.create.flash.success") }
    else
      Rails.logger.info("User #{current_user.urs_uid} attempted to edit #{resource_name.classify} #{@concept_id} in provider #{current_user.provider_id} but a #{resource_name.classify} Draft was not created to edit because there was no native_id (#{@native_id}) found.")
      # if we cannot locate the native_id for the Variable, we should discontinue editing
      redirect_to send("#{resource}_path", @concept_id, revision_id: @revision_id), flash: { error: I18n.t("controllers.#{pluralized_name}.edit.flash.native_id_error") }
    end
  end

  def clone
    draft = resource_class.send("create_from_#{resource_name}", get_resource, current_user, nil)
    Rails.logger.info("Audit Log: Cloned #{capitalized_name} Draft for #{draft.short_name} was created by #{current_user.urs_uid} in provider #{current_user.provider_id}")
    flash[:notice] = view_context.link_to I18n.t("controllers.#{pluralized_name}.clone.flash.notice"), send("edit_#{resource_name}_draft_path", draft, "#{resource_name}_information", anchor: "#{resource_name}_draft_draft_name")
    redirect_to send("#{resource_name}_draft_path", draft)
  end

  def create
    draft = resource_class.find(params[:id])

    ingested_response = cmr_client.send("ingest_#{resource_name}", draft.draft.to_json, draft.provider_id, draft.native_id, token)

    if ingested_response.success?
      # get information for publication email notification before draft is deleted
      Rails.logger.info("Audit Log: #{capitalized_name} Draft #{draft.entry_title} was published by #{current_user.urs_uid} in provider: #{current_user.provider_id}")
      short_name = draft.short_name

      # Delete draft
      draft.destroy

      concept_id = ingested_response.body['concept-id']
      revision_id = ingested_response.body['revision-id']

      # instantiate and deliver notification email
      DraftMailer.send("#{resource_name}_draft_published_notification", get_user_info, concept_id, revision_id, short_name).deliver_now

      redirect_to send("#{resource_name}_path", concept_id, revision_id: revision_id), flash: { success: I18n.t("controllers.#{pluralized_name}.create.flash.success") }
    else
      # Log error message
      Rails.logger.error("Ingest #{capitalized_name} Metadata Error: #{ingested_response.inspect}")
      Rails.logger.info("User #{current_user.urs_uid} attempted to ingest #{resource_name} draft #{draft.entry_title} in provider #{current_user.provider_id} but encountered an error.")

      @ingest_errors = generate_ingest_errors(ingested_response)
      redirect_to send("#{resource_name}_draft_path", draft), flash: { error: I18n.t("controllers.#{pluralized_name}.create.flash.error") }
    end
  end

  def destroy
    delete_response = cmr_client.send("delete_#{resource_name}", @provider_id, @native_id, token)

    if delete_response.success?
      flash[:success] = I18n.t("controllers.#{pluralized_name}.destroy.flash.success")
      Rails.logger.info("Audit Log: #{capitalized_name} #{@concept_id} with native_id #{@native_id} was deleted for #{@provider_id} by #{session[:urs_uid]}")

      redirect_to send("#{resource_name}_revisions_path", id: delete_response.body['concept-id'], revision_id: delete_response.body['revision-id'])
    else
      Rails.logger.error("Delete #{capitalized_name} Error: #{delete_response.inspect}")
      Rails.logger.info("User #{current_user.urs_uid} attempted to delete #{capitalized_name} #{@concept_id} with native_id #{@native_id} in provider #{@provider_id} but encountered an error.")

      set_preview

      flash[:error] = delete_response.error_message(i18n: I18n.t("controllers.#{pluralized_name}.destroy.flash.error"))
      render :show
    end
  end

  def revisions
    add_breadcrumb breadcrumb_name(get_resource, pluralized_name), send("#{resource_name}_path", @concept_id)
    add_breadcrumb 'Revision History', send("#{resource_name}_revisions_path", @concept_id)
  end

  def revert
    latest_revision_id = @revisions.first['meta']['revision-id']

    # Ingest revision
    ingested_response = cmr_client.send("ingest_#{resource_name}", get_resource.to_json, @provider_id, @native_id, token)

    if ingested_response.success?
      flash[:success] = I18n.t("controllers.#{pluralized_name}.revert.flash.success")
      Rails.logger.info("Audit Log: #{capitalized_name} Revision for record #{@concept_id} with native_id: #{@native_id} for provider: #{@provider_id} by user #{session[:urs_uid]} has been successfully revised")
      redirect_to send("#{resource_name}_revisions_path", revision_id: latest_revision_id.to_i + 1)
    else
      Rails.logger.error("Ingest (Revert) #{capitalized_name} Error: #{ingested_response.inspect}")
      Rails.logger.info("User #{current_user.urs_uid} attempted to revert #{capitalized_name} #{@concept_id} by ingesting a previous revision in provider #{current_user.provider_id} but encountered an error.")

      @errors = generate_ingest_errors(ingested_response)
      flash[:error] = ingested_response.error_message(i18n: I18n.t("controllers.#{pluralized_name}.revert.flash.error"))
      render action: 'revisions'
    end
  end

  def download_json
    send_data get_resource.to_json, type: 'application/json; charset=utf-8', disposition: "attachment; filename=#{@concept_id}.json"
  end

  # Returns the resource from the created instance variable
  # @return [Object]
  def get_resource
    instance_variable_get("@#{resource_name}")
  end
  helper_method :get_resource

  # The resource class based on the controller
  # @return [Class]
  def resource_class
    @resource_class ||= "#{resource_name}_draft".classify.constantize
  end

  # The singular name for the resource class based on the controller
  # @return [String]
  def resource_name
    @resource_name ||= controller_name.singularize
  end

  def pluralized_name
    @pluralized_name ||= controller_name
  end

  def capitalized_name
    resource_name.capitalize
  end
end
