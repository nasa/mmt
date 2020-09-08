class VariableDraftsCollectionSearchesController < CmrSearchController

  before_action :set_resource
  before_action :ensure_not_editing

  def new
    add_top_level_breadcrumbs

    unless @draft.collection_concept_id.blank?
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

  def ensure_not_editing
    # temporarily we are blocking the changing of a collection association for
    # published variables. so if we are editing a published variable they should
    # not be able to access this page and clear the existing association

    # search for a variable by native id
    variable_params = { native_id: @draft.native_id, provider: @draft.provider_id }
    variable_search_response = cmr_client.get_variables(variable_params, token)
    editing = if variable_search_response.success?
                variable_search_response.body['hits'].to_i > 0 ? true : false
              else
                Rails.logger.error("Error searching for published Variable before VariableDraftsCollectionSearchesController#new: #{variable_search_response.clean_inspect}")
                true
              end

    redirect_to variable_draft_path(@draft) if editing
  end
end
