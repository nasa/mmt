# :nodoc:
class CollectionAssociationsController < CmrSearchController
  include ChooserEndpoints

  RESULTS_PER_PAGE = 25
  CMR_MAX_PAGE_SIZE = 2000

  before_action :set_resource
  before_action :ensure_not_variable, only: [:new, :create, :destroy]
  before_action :ensure_variable, only: [:edit, :update]
  before_action :add_high_level_breadcrumbs
  before_action :ensure_correct_provider, only: [:edit, :new]

  def index
    permitted = params.to_unsafe_h unless params.nil?# need to understand what this is doing more, think related to nested parameters not permitted.

    # Default the page to 1
    page = permitted.fetch('page', 1)

    search_params = {
      "#{lower_resource_name}_concept_id": resource_id,
      page_size: RESULTS_PER_PAGE,
      page_num: page
    }

    association_response = cmr_client.get_collections_by_post(search_params, token)

    if association_response.success?
      association_count = association_response.body['hits']
      association_results = association_response.body['items']
    else
      association_count = 0
      association_results = []
      Rails.logger.error("An error occurred while trying to fetch collection associations for a #{lower_resource_name}.  CMR Response: #{association_response.clean_inspect}")
      flash[:error] = "An error occurred while trying to retrieve associations for this #{lower_resource_name}. Please try again before contacting #{view_context.mail_to('support@earthdata.nasa.gov', 'Earthdata Support')}"
    end

    # Variables are associated on ingest and can only be associated with one
    # collection. We should hide the button if it is a variable record
    @can_associate = not_variable?
    @associations = Kaminari.paginate_array(association_results, total_count: association_count).page(page).per(RESULTS_PER_PAGE)
  end

  def new
    # Variables are associated on ingest and can only be associated with one
    # collection. They should be blocked from this action.
    @previously_associated_collections = get_all_collection_associations

    add_breadcrumb 'New', send("new_#{lower_resource_name}_collection_association_path", resource_id)

    super
  end

  def create
    # Variables are associated on ingest and can only be associated with one
    # collection. They should be blocked from this action.
    association_response = cmr_client.add_collection_associations(resource_id, params[:selected_collections], token, plural_lower_resource_name)

    # Log any issues found in the response
    log_issues(association_response)

    if association_response.success?
      redirect_to send("#{lower_resource_name}_collection_associations_path", resource_id), flash: { success: I18n.t("controllers.collection_associations.#{resource_name.downcase.pluralize}.create.flash.success") }
    else
      Rails.logger.error("Collection Associations Error: #{association_response.clean_inspect}")
      Rails.logger.info("User #{current_user.urs_uid} attempted to create Collection Associations for #{resource_name} #{resource_id} with Collections #{params[:selected_collections]} in provider #{current_user.provider_id} but encountered an error.")

      flash[:error] = association_response.error_message(i18n: I18n.t("controllers.collection_associations.#{resource_name.downcase.pluralize}.create.flash.error"))
      render :new
    end
  end

  # Only variables should be allowed to be edited and updated in this fashion.
  # This is because the variable must be associated to one and only one collection
  def edit
    @previously_associated_collections = get_all_collection_associations

    add_breadcrumb 'Edit', send("edit_#{lower_resource_name}_collection_association_path", resource_id)

    super
  end

  # Only variables should be allowed to be updated in this fashion.
  def update
    # Get metadata in its native format so that we can reingest it.
    search_response = cmr_client.get_concept(resource_id, token, {})
    if search_response.success?
      format = search_response.headers['content-type']
      metadata = search_response.body
    else
      Rails.logger.error("Search #{resource_name} Metadata Error: #{search_response.clean_inspect}")

      flash[:error] = search_response.error_message(i18n: I18n.t("controllers.collection_associations.#{resource_name.downcase.pluralize}.update.flash.error"), force_i18n_preface: true)
      redirect_to send("#{lower_resource_name}_collection_associations_path", concept_id) and return
    end

    # Override headers to reingest same version.
    ingest_response = cmr_client.send("ingest_#{lower_resource_name}", metadata: metadata.to_json, provider_id: @provider_id, native_id: @native_id, collection_concept_id: params['selected_collection'], token: token, headers_override: { 'Content-Type' => format })

    if ingest_response.success?
      non_collection_concept_id = ingest_response.body['concept-id']
      col_concept_id = ingest_response.body['associated-item']['concept-id']
      Rails.logger.info("Audit Log: #{resource_name} with concept_id: #{non_collection_concept_id} republished with a new collection association. The new associated collection has a concept_id of: #{col_concept_id} in provider: #{@provider_id}")
      redirect_to send("#{lower_resource_name}_collection_associations_path", non_collection_concept_id), flash: { success: I18n.t("controllers.collection_associations.#{resource_name.downcase.pluralize}.update.flash.success") }
    else
      Rails.logger.error("Ingest #{resource_name} Metadata Error: #{ingest_response.clean_inspect}")
      Rails.logger.info("User #{current_user.urs_uid} attempted to ingest #{resource_name} from the manage collection associations page in provider #{current_user.provider_id} but encountered an error.")

      flash[:error] = ingest_response.error_message(i18n: I18n.t("controllers.collection_associations.#{resource_name.downcase.pluralize}.update.flash.error"), force_i18n_preface: true)
      redirect_to send("#{lower_resource_name}_collection_associations_path", concept_id)
    end
  end

  def destroy
    # Variables must be associated with one collection. They should be blocked
    # from this action.
    association_response = cmr_client.delete_collection_associations(resource_id, params[:selected_collections], token, plural_lower_resource_name)

    # Log any issues found in the response
    log_issues(association_response)

    if association_response.success?
      redirect_to send("#{lower_resource_name}_collection_associations_path", resource_id), flash: { success: I18n.t("controllers.collection_associations.#{resource_name.downcase.pluralize}.destroy.flash.success") }
    else
      Rails.logger.error("Collection Associations Error: #{association_response.clean_inspect}")
      Rails.logger.info("User #{current_user.urs_uid} attempted to delete Collection Associations for #{resource_name} #{resource_id} with Collections #{params[:selected_collections]} in provider #{current_user.provider_id} but encountered an error.")

      redirect_to send("#{lower_resource_name}_collection_associations_path", resource_id), flash: { error: association_response.error_message(i18n: I18n.t("controllers.collection_associations.#{resource_name.downcase.pluralize}.destroy.flash.error")) }
    end
  end

  private

  def get_all_collection_associations

    page_num_var = 1
    incomplete = true
    associated_collections = []

    while incomplete
      search_params = {
        "#{lower_resource_name}_concept_id": resource_id,
        page_size: CMR_MAX_PAGE_SIZE,
        page_num: page_num_var
      }

      association_response = cmr_client.get_collections_by_post(search_params, token)

      partial_associated_collections = if association_response.success?
                                         association_response.body
                                                             .fetch('items', [])
                                                             .map { |collection| collection['meta']['concept-id'] }
                                       else
                                         Rails.logger.error("Error retrieving collections associated to #{resource_id}: #{association_response.clean_inspect}")
                                         []
                                       end

      if partial_associated_collections.any?
        associated_collections += partial_associated_collections
        page_num_var += 1
      end

      if CMR_MAX_PAGE_SIZE > partial_associated_collections.length
        incomplete = false
      end
    end

    associated_collections
  end

  def set_resource
    set_metadata
    @resource = if variable_id
                  @variable
                elsif params[:service_id]
                  @service
                elsif params[:tool_id]
                  @tool
                end
  end

  def resource_name
    name = 'Variable' unless @variable.nil?
    name = 'Service' unless @service.nil?
    name = 'Tool' unless @tool.nil?
    name
  end
  helper_method :resource_name

  def lower_resource_name
    resource_name.downcase
  end
  helper_method :lower_resource_name

  def plural_resource_name
    resource_name.pluralize
  end

  def plural_lower_resource_name
    lower_resource_name.pluralize
  end

  def resource_id
    params[:service_id] || params[:tool_id] || variable_id
  end
  helper_method :resource_id

  def variable_id
    return params[:variable_id] if params[:variable_id]
    return nil unless params[:id]

    params[:id] if params[:id].split('-').first.starts_with?(/V\d/)
  end

  def add_high_level_breadcrumbs
    add_breadcrumb plural_resource_name # there is no variables index action, so not providing a link
    add_breadcrumb fetch_entry_id(@resource, lower_resource_name), send("#{lower_resource_name}_path", resource_id)

    add_breadcrumb 'Collection Associations', send("#{lower_resource_name}_collection_associations_path", resource_id)
  end

  def log_issues(response)
    # if the response is a failure these messages are not returned
    return unless response.success?

    response.body.select { |assocation_response| assocation_response.fetch('warnings', []).any? }.each do |warnings|
      warnings.each do |warning|
        Rails.logger.error "#{resource_name} Assocation [warning]: #{warning}"
      end
    end

    response.body.select { |assocation_response| assocation_response.fetch('errors', []).any? }.each do |errors|
      errors.each do |error|
        Rails.logger.error "#{resource_name} Assocation [error]: #{error}"
      end
    end
  end

  def ensure_correct_provider
    return if current_provider?(@provider_id)

    redirect_to send("#{lower_resource_name}_path", @concept_id, not_authorized_request_params: request.params)
  end

  def not_variable?
    !variable?
  end
  helper_method :not_variable?

  def variable?
    resource_name == 'Variable'
  end
  helper_method :variable?

  def ensure_not_variable
    redirect_to send("#{lower_resource_name}_collection_associations_path", resource_id) if variable?
  end

  def ensure_variable
    redirect_to send("#{lower_resource_name}_collection_associations_path", resource_id) unless variable?
  end
end
