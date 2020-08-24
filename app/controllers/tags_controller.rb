class TagsController < ManageMetadataController
  # this controller is used by an ajax call and another controller action, so
  # many of our normal before actions can be skipped
  skip_before_action :setup_query
  skip_before_action :refresh_urs_if_needed
  skip_before_action :refresh_launchpad_if_needed
  skip_before_action :provider_set?
  skip_before_action :proposal_mode_enabled?
  skip_before_action :proposal_approver_permissions

  def index
    tag_keys = params[:tag_key]
    query = { tag_key: tag_keys }

    cmr_tag_response = cmr_client.get_tags(query)
    if cmr_tag_response.success?
      render json: cmr_tag_response.body['items'], status: :ok
    else
      Rails.logger.error("Retrieve Tag #{tag_keys} Error: #{cmr_tag_response.clean_inspect}")

      render json: { error: cmr_tag_response.error_message(i18n: I18n.t('controllers.tags.index.error')) }, status: cmr_tag_response.status
    end
  end
end
