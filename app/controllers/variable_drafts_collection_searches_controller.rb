class VariableDraftsCollectionSearchesController < CmrSearchController

  before_action :set_resource

  def new
    add_top_level_breadcrumbs

    current_collection_response = cmr_client.get_collections_by_post(
      { concept_id: @draft.collection_concept_id }, token
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
    add_breadcrumb fetch_entry_id(@draft.draft, @draft.draft_type), variable_draft_path(@draft.id)
  end

  def set_resource
    @draft = VariableDraft.find(params[:id])
  end
end
