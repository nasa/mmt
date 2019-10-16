#:nodoc:
class ServiceEntriesController < ManageCmrController
  include ServiceTags

  before_action :set_service_entry, only: [:show, :edit]

  after_action :verify_authorized, only: [:new, :edit, :create, :update, :destroy]

  add_breadcrumb 'Service Entries', :service_entries_path

  RESULTS_PER_PAGE = 25

  def index
    permitted = params.to_unsafe_h unless params.nil?# need to understand what this is doing more, think related to nested parameters not permitted.

    # Default the page to 1
    page = permitted.fetch('page', 1)

    service_entry_response = echo_client.get_service_entries_by_provider(echo_provider_token, current_provider_guid)

    service_entry_list = if service_entry_response.success?
                           # Retreive the service options and sort by name, ignoring case
                           Array.wrap(service_entry_response.parsed_body.fetch('Item', [])).sort_by { |option| option.fetch('Name', '').downcase }
                         else
                           []
                         end

    @service_entries = Kaminari.paginate_array(service_entry_list, total_count: service_entry_list.count).page(page).per(RESULTS_PER_PAGE)

    set_allowed_actions(:service_entry, %w(update destroy))
  end

  def show
    add_breadcrumb @service_entry.fetch('Name'), service_entry_path(@service_entry.fetch('Guid', nil))
  end

  def new
    @service_entry = {}

    authorize :service_entry

    add_breadcrumb 'New', new_service_entry_path
  end

  def edit
    authorize :service_entry

    add_breadcrumb @service_entry.fetch('Name'), service_entry_path(@service_entry.fetch('Guid', nil))
    add_breadcrumb 'Edit', edit_service_entry_path(@service_entry.fetch('Guid', nil))
  end

  def create
    authorize :service_entry

    @service_entry = generate_payload

    response = echo_client.create_service_entry(echo_provider_token, @service_entry)

    if response.error?
      Rails.logger.error("Create Service Entry Error: #{response.inspect}")
      flash[:error] = response.error_message

      render :new
    else
      flash[:success] = 'Service Entry successfully created'

      redirect_to service_entry_path(response.parsed_body)
    end
  end

  def update
    authorize :service_entry

    @service_entry = generate_payload

    response = echo_client.update_service_entry(echo_provider_token, @service_entry)

    if response.error?
      Rails.logger.error("Update Service Entry Error: #{response.inspect}")
      flash[:error] = response.error_message

      render :edit
    else
      redirect_to service_entry_path(params[:id]), flash: { success: 'Service Entry successfully updated' }
    end
  end

  def destroy
    authorize :service_entry

    response = echo_client.remove_service_entry(echo_provider_token, params[:id])

    if response.error?
      Rails.logger.error("Delete Service Entry Error: #{response.inspect}")
      flash[:error] = response.error_message
    else
      flash[:success] = 'Service Entry successfully deleted'
    end

    redirect_to service_entries_path
  end

  private

  def service_entry_params
    params.require(:service_entry).permit(:id, :provider_id, :name, :url, :description, :entry_type, :service_interface_guid)
  end

  def generate_payload
    # Constructs guids for the selected collections
    tag_guids = construct_tags(current_provider_guid, params.fetch('tag_guids_toList', []))

    # If a service interface was selected we need to also include its guid in the tags
    tag_guids.push(service_entry_params['service_interface_guid']) if service_entry_params.key?('service_interface_guid')

    {
      'Guid'         => params[:id],
      'ProviderGuid' => current_provider_guid,
      'Name'         => service_entry_params['name'],
      'Url'          => service_entry_params['url'],
      'Description'  => service_entry_params['description'],
      'EntryType'    => service_entry_params['entry_type'],
      'TagGuids'     => tag_guids
    }
  end

  def set_service_entry
    result = echo_client.get_service_entries(echo_provider_token, params[:id])

    @service_entry = result.parsed_body.fetch('Item', {}) unless result.error?

    # To ensure a consistent value here we're converting to an array
    @service_entry['TagGuids'] = (@service_entry['TagGuids'] || {}).fetch('Item', [])
  end
end
