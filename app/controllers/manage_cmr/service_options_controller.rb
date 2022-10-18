#:nodoc:
class ServiceOptionsController < ManageCmrController
  before_action :set_service_option, only: [:show, :edit]

  add_breadcrumb 'Service Options', :service_options_path

  RESULTS_PER_PAGE = 25

  def index
    if echo_provider_token.blank?
      flash[:error] = "Error retrieving echo provider token.  Try logging in with launchpad"
      redirect_back(fallback_location: manage_collections_path)
      return
    end

    # Default the page to 1
    #
    permitted = params.to_unsafe_h unless params.nil?# need to understand what this is doing more, think related to nested parameters not permitted.
    page = permitted.fetch('page', 1)

    service_option_response = get_service_option_list(echo_provider_token)

    service_option_list = Array.wrap(service_option_response.fetch('Result', [])).sort_by { |option| option.fetch('Name', '').downcase }

    @service_options = Kaminari.paginate_array(service_option_list, total_count: service_option_list.count).page(page).per(RESULTS_PER_PAGE)
  end

  def show
    add_breadcrumb @service_option.fetch('Name'), service_option_path(@service_option.fetch('Guid', nil))
  end

  def new
    @service_option = {}

    add_breadcrumb 'New', new_service_option_path
  end

  def edit
    add_breadcrumb @service_option.fetch('Name'), service_option_path(@service_option.fetch('Guid', nil))
    add_breadcrumb 'Edit', edit_service_option_path(@service_option.fetch('Guid', nil))
  end

  def create
    @service_option = generate_payload

    if echo_provider_token.blank?
      flash[:error] = "Error retrieving echo provider token.  Try logging in with launchpad"
      redirect_back(fallback_location: manage_collections_path)
      return
    end

    response = echo_client.create_service_option(echo_provider_token, @service_option)

    if response.error?
      Rails.logger.error("Create Service Option Error: #{response.clean_inspect}")
      flash[:error] = response.error_message

      render :new
    else
      flash[:success] = 'Service Option successfully created.'

      redirect_to service_option_path(response.parsed_body['Item'])
    end
  end

  def update
    @service_option = generate_payload

    response = echo_client.update_service_option(token, @service_option)

    if response.error?
      Rails.logger.error("Update Service Option Error: #{response.clean_inspect}")
      flash[:error] = response.error_message

      render :edit
    else
      redirect_to service_option_path(params[:id]), flash: { success: 'Service Option successfully updated' }
    end
  end

  def destroy
    response = echo_client.remove_service_option(token, params[:id])

    if response.error?
      Rails.logger.error("Delete Service Option Error: #{response.clean_inspect}")
      flash[:error] = response.error_message
    else
      flash[:success] = 'Service Option successfully deleted'
    end

    redirect_to service_options_path
  end

  private

  def service_option_params
    params.require(:service_option).permit(:id, :name, :provider_id, :description, :form)
  end

  def generate_payload
    {
      'Guid'         => params[:id],
      'ProviderGuid' => current_provider_guid,
      'Name'         => service_option_params['name'],
      'Description'  => service_option_params['description'],
      'Form'         => service_option_params['form']
    }
  end

  def set_service_option
    if echo_provider_token.blank?
      flash[:error] = "Error retrieving echo provider token.  Try logging in with launchpad"
      redirect_back(fallback_location: manage_collections_path)
      return
    end

    service_option_response = get_service_option_list(echo_provider_token, params[:id])
    service_options = Array.wrap(service_option_response.fetch('Result', []))
    @service_option = service_options[0] unless service_options.empty?
  end
end
