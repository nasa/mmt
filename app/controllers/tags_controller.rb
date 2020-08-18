class TagsController < ManageMetadataController
  # what actions need to be skipped?

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

  # Not needed at the moment - was used for initial implementation retrieving
  # tags one at a time.
  def show
    tag_key = params[:id]

    cmr_tag_response = cmr_client.get_tag(tag_key)

    tag_response = if cmr_tag_response.success?
                     cmr_tag_response.body
                   else
                     Rails.logger.error("Retrieve Tag #{tag_key} Error: #{cmr_tag_response.clean_inspect}")

                     { error: cmr_tag_response.error_message(i18n: I18n.t('controllers.tags.show.error')) }
                   end

    render json: tag_response
  end
end
