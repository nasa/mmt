class VariableDraftsCollectionSearchesController < CmrSearchController

  before_action :set_resource

  def new
    add_top_level_breadcrumbs

    current_collection_response = cmr_client.get_collections_by_post(
      { concept_id: @draft ['collection_concept_id'] }, token
    )
    if current_collection_response.success?
      if current_collection_response.body['hits'] > 0
        @current_collection_info = current_collection_response.body.dig('items', 0)
      else
        @current_collection_error = "There was an error retrieving Collection #{@draft.collection_concept_id} because the collection does not exist."
      end
    else
      Rails.logger.info("Error retrieving Collection #{@draft.collection_concept_id} that is intended to be associated with Variable Draft #{@draft.id}: #{current_collection_response.clean_inspect}")
      @current_collection_error = "There was an error retrieving Collection #{@draft.collection_concept_id} that is currently selected as the Collection to be associated with this Variable Draft."
    end

    add_breadcrumb 'Collection Association Search', :collection_search_variable_draft_path

    super
  end

  private

  def add_top_level_breadcrumbs
    add_breadcrumb 'Variable Drafts', variable_drafts_path
    add_breadcrumb fetch_entry_id(@draft['draft'], @draft['draft_type']), variable_draft_path(@draft['id'])
  end

  def set_resource
    if Rails.configuration.cmr_drafts_api_enabled
      native_id = params[:id]
      draft_type = "#{params[:draft_type].tableize.singularize.sub('_','-')}s"

      cmr_response = cmr_client.search_draft(draft_type: draft_type, native_id: native_id, token: token)

      if cmr_response.success?
        result = cmr_response.body['items'][0]

        if result['umm'].key?('_meta')
          collection_concept_id = result['umm']['_meta']['collection_concept_id']
        end

        @draft={
          "id" => result['meta']['native-id'],
          "user_id" => result['meta']['user-id'],
          "draft" => result['umm'],
          "updated_at" => result['meta']['revision-date'],
          "short_name" => result['umm']['Name'],
          "entry_title" => result['umm']["LongName"],
          "provider_id" => result['meta']['provider-id'],
          "draft_type" => draft_type,
          "collection_concept_id" => collection_concept_id
        }
      else
        render json: cmr_response.errors, status: 500
      end
    else
      @draft = VariableDraft.find(params[:id])
    end
  end
end
