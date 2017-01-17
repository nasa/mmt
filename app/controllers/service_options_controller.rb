#:nodoc:
class ServiceOptionsController < ManageCmrController
  include EchoSoap

  before_action :set_service_option, only: [:show, :edit]

  add_breadcrumb 'Service Options', :service_options_path

  RESULTS_PER_PAGE = 25

  def index
    # Default the page to 1
    page = params.fetch('page', 1)

    service_option_response = echo_client.get_service_options_names(echo_provider_token)

    service_option_list = if service_option_response.success?
                            # Retreive the service options and sort by name, ignoring case
                            service_option_response.parsed_body.fetch('Item', []).sort_by { |option| option['Name'].downcase }
                          else
                            []
                          end

    @service_options = Kaminari.paginate_array(service_option_list, total_count: service_option_response.parsed_body.fetch('Item', []).count).page(page).per(RESULTS_PER_PAGE)
  end

  def show
    add_breadcrumb @service_option.fetch('Name'), service_option_path(@service_option.fetch('Guid', nil))
  end

  def new
    @service_option = {}

    add_breadcrumb 'New', new_service_option_path
  end

  def create
    @service_option = generate_payload

    response = echo_client.create_service_option(echo_provider_token, @service_option)

    if response.error?
      flash[:error] = response.error_message

      render :new
    else
      flash[:success] = 'Service Option successfully created'

      redirect_to service_option_path(response.parsed_body['Item'])
    end
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
    result = echo_client.get_service_options(echo_provider_token, params[:id])

    @service_option = result.parsed_body.fetch('Item', {}) unless result.error?
  end
end
