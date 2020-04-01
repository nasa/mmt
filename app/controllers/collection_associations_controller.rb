# :nodoc:
class CollectionAssociationsController < CmrSearchController
  include ChooserEndpoints

  RESULTS_PER_PAGE = 25
  CMR_MAX_PAGE_SIZE = 2000

  before_action :set_resource
  before_action :add_high_level_breadcrumbs
  before_action :ensure_correct_provider, only: [:index, :new]

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

    @can_associate = not_variable? || association_results.blank?
    @associations = Kaminari.paginate_array(association_results, total_count: association_count).page(page).per(RESULTS_PER_PAGE)
  end

  def new
    @previously_associated_collections = get_all_collection_associations
    if variable? && @previously_associated_collections.present?
      flash[:error] = "This #{lower_resource_name} already has a Collection Association. To change the association, you must first remove the existing collection association."
      redirect_to send("#{lower_resource_name}_collection_associations_path", resource_id)
      return
    end

    add_breadcrumb 'New', send("new_#{lower_resource_name}_collection_association_path", resource_id)

    super
  end

  def create
    association_response = if variable?
                             cmr_client.send("add_collection_assocations_to_#{lower_resource_name}", resource_id, [params[:selected_collection]], token)
                           else
                             cmr_client.send("add_collection_assocations_to_#{lower_resource_name}", resource_id, params[:selected_collections], token)
                           end

    # Log any issues found in the response
    log_issues(association_response)

    if association_response.success?
      redirect_to send("#{lower_resource_name}_collection_associations_path", resource_id), flash: { success: I18n.t('controllers.collection_associations.create.flash.success') }
    else
      Rails.logger.error("Collection Associations Error: #{association_response.clean_inspect}")
      Rails.logger.info("User #{current_user.urs_uid} attempted to create Collection Associations for #{resource_name} #{resource_id} with Collections #{params[:selected_collections]} in provider #{current_user.provider_id} but encountered an error.")

      flash[:error] = association_response.error_message(i18n: I18n.t('controllers.collection_associations.create.flash.error'))
      render :new
    end
  end

  def destroy
    association_response = cmr_client.send("delete_collection_assocations_to_#{lower_resource_name}", resource_id, params[:selected_collections], token)

    # Log any issues found in the response
    log_issues(association_response)

    if association_response.success?
      redirect_to send("#{lower_resource_name}_collection_associations_path", resource_id), flash: { success: I18n.t('controllers.collection_associations.destroy.flash.success') }
    else
      Rails.logger.error("Collection Associations Error: #{association_response.clean_inspect}")
      Rails.logger.info("User #{current_user.urs_uid} attempted to delete Collection Associations for #{resource_name} #{resource_id} with Collections #{params[:selected_collections]} in provider #{current_user.provider_id} but encountered an error.")

      redirect_to send("#{lower_resource_name}_collection_associations_path", resource_id), flash: { error: association_response.error_message(i18n: I18n.t('controllers.collection_associations.destroy.flash.error')) }
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
    if params[:variable_id]
      set_variable
      @resource = @variable
    elsif params[:service_id]
      set_service
      @resource = @service
    end
  end

  def resource_name
    name = 'Variable' unless @variable.nil?
    name = 'Service' unless @service.nil?
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
    params[:variable_id] || params[:service_id]
  end
  helper_method :resource_id

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
end
