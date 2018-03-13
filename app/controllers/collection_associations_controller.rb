# :nodoc:
class CollectionAssociationsController < CmrSearchController
  include ChooserEndpoints

  before_action :set_resource
  before_action :add_high_level_breadcrumbs
  before_action :ensure_correct_provider, only: [:index, :new]

  def index
    # Default the page to 1
    page = params.fetch('page', 1)

    association_list = cmr_client.get_collections_by_post({ "#{lower_resource_name}_concept_id" => resource_id }, token).body.fetch('items')

    @associations = Kaminari.paginate_array(association_list, total_count: association_list.count).page(page).per(RESULTS_PER_PAGE)
  end

  def new
    add_breadcrumb 'New', send("new_#{lower_resource_name}_collection_association_path", resource_id)

    super

    association_response = cmr_client.get_collections_by_post({ "#{lower_resource_name}_concept_id" => resource_id }, token)

    @previously_associated_collections = if association_response.success?
                                           association_response.body
                                           .fetch('items', [])
                                           .map { |collection| collection['meta']['concept-id'] }
                                         end
  end

  def create
    association_response = cmr_client.send("add_collection_assocations_to_#{lower_resource_name}", resource_id, params[:selected_collections], token)

    # Log any issues found in the response
    log_issues(association_response)

    if association_response.success?
      redirect_to send("#{lower_resource_name}_collection_associations_path", resource_id), flash: { success: I18n.t('controllers.collection_associations.create.flash.success') }
    else
      Rails.logger.error("Collection Associations Error: #{association_response.inspect}")
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
      Rails.logger.error("Collection Associations Error: #{association_response.inspect}")
      Rails.logger.info("User #{current_user.urs_uid} attempted to delete Collection Associations for #{resource_name} #{resource_id} with Collections #{params[:selected_collections]} in provider #{current_user.provider_id} but encountered an error.")

      redirect_to send("#{lower_resource_name}_collection_associations_path", resource_id), flash: { error: association_response.error_message(i18n: I18n.t('controllers.collection_associations.destroy.flash.error')) }
    end
  end

  private

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
    add_breadcrumb breadcrumb_name(@resource, lower_resource_name), send("#{lower_resource_name}_path", resource_id)

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
end
