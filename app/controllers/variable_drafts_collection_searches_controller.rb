class VariableDraftsCollectionSearchesController < CmrSearchController

  def new
    @draft = VariableDraft.find(params[:id])
    add_top_level_breadcrumbs

    unless @draft.collection_concept_id.blank?
      current_collection_response = cmr_client.get_collections_by_post(
        # for error, use collection_concept_id as param key
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
    end

    add_breadcrumb 'Collection Association Search', :collection_search_variable_draft_path

    super
  end

  # TODO: is new the appropriate action? can we send an existing concept id to 'new'?

  private

  def add_top_level_breadcrumbs
    add_breadcrumb 'Variable Drafts', variable_drafts_path
    add_breadcrumb fetch_entry_id(@draft.draft, @draft.draft_type), variable_draft_path(@draft.id)
  end
end
