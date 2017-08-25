# :nodoc:
class CollectionAssociationsController < CmrSearchController
  include ChooserEndpoints

  before_action :set_variable
  before_action :add_high_level_breadcrumbs

  def index
    # Default the page to 1
    page = params.fetch('page', 1)

    association_response = cmr_client.get_variables({ concept_id: params[:variable_id] }, token)

    association_list = if association_response.success?
                         # Retreive the service options and sort by name, ignoring case
                         concept_ids = association_response.body.fetch('items', []).first.fetch('associations', {}).fetch('collections', []).map { |collection| collection['concept-id'] }

                         concept_ids.any? ? get_provider_collections(concept_id: concept_ids, sort_key: 'entry-title').fetch('items', []) : []
                       else
                         []
                       end

    @associations = Kaminari.paginate_array(association_list, total_count: association_list.count).page(page).per(RESULTS_PER_PAGE)
  end

  def new
    add_breadcrumb 'New', new_variable_collection_association_path(params[:variable_id])

    super

    association_response = cmr_client.get_variables({ concept_id: params[:variable_id] }, token)

    @previously_associated_collections = association_response.body.fetch('items', []).first.fetch('associations', {}).fetch('collections', []).map { |collection| collection['concept-id'] }
  end

  def create
    association_response = cmr_client.add_collection_assocations_to_variable(params[:variable_id], params[:selected_collections], token)

    if association_response.success?
      redirect_to variable_path(params[:variable_id]), flash: { success: 'Collection Associations successfully saved.' }
    else
      Rails.logger.error("Collection Associations Error: #{association_response.inspect}")

      group_creation_error = Array.wrap(association_response.body['errors'])[0]

      flash[:error] = group_creation_error

      render :new
    end
  end

  private

  def add_high_level_breadcrumbs
    add_breadcrumb 'Variables' # there is no variables index action, so not providing a link
    add_breadcrumb breadcrumb_name(@variable, 'variable'), variable_path(params[:variable_id])

    add_breadcrumb 'Collection Associations', variable_collection_associations_path(params[:variable_id])
  end
end
