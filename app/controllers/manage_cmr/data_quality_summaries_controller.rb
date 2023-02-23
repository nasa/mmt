class DataQualitySummariesController < ManageCmrController
  include DataManagementHelper

  before_action :set_summary, only: [:show, :edit]

  add_breadcrumb 'Data Quality Summaries', :data_quality_summaries_path

  RESULTS_PER_PAGE = 25

  def index
    if use_legacy_order_service?
      legacy_load_data_quality_summaries
    else
      load_data_quality_summaries
    end
  end

  def show
    if use_legacy_order_service?
      add_breadcrumb @summary.fetch('Name'), data_quality_summary_path(@summary.fetch('Guid', nil))
    else
      add_breadcrumb @summary.fetch('umm', {}).fetch('Name', ''), data_quality_summary_path(@summary.fetch('umm', {}).fetch('Id', ''))
    end
  end

  def new
    @summary = {}

    add_breadcrumb 'New', new_data_quality_summary_path
  end

  def edit
    if use_legacy_order_service?
      add_breadcrumb @summary.fetch('Name'), data_quality_summary_path(@summary.fetch('Guid', nil))
      add_breadcrumb 'Edit', edit_data_quality_summary_path(@summary.fetch('Guid', nil))
    else
      add_breadcrumb @summary.fetch('umm', {}).fetch('Name', ''), data_quality_summary_path(@summary.fetch('umm', {}).fetch('Id', ''))
      add_breadcrumb 'Edit', edit_data_quality_summary_path(@summary.fetch('umm', {}).fetch('Id', ''))
    end
  end

  def create
    @summary = legacy_generate_payload

    response = echo_client.create_data_quality_summary_definition(token, @summary)

    if response.error?
      Rails.logger.error("Create Data Quality Summary Error: #{response.clean_inspect}")
      flash[:error] = response.error_message

      render :new
    else
      redirect_to data_quality_summary_path(response.parsed_body), flash: { success: 'Data Quality Summary successfully created' }
    end
  end

  def update
    if use_legacy_order_service?
      legacy_update_data_quality_summary
    else
      update_data_quality_summary
    end
  end

  def destroy
    response = echo_client.remove_data_quality_summary_definition(token, params[:id])

    if response.error?
      Rails.logger.error("Delete Data Quality Summary Error: #{response.clean_inspect}")
      flash[:error] = response.error_message
    else
      flash[:success] = 'Data Quality Summary successfully deleted'
    end

    redirect_to data_quality_summaries_path
  end

  private

  def legacy_update_data_quality_summary
    @summary = legacy_generate_payload

    response = echo_client.update_data_quality_summary_definition(token, @summary)

    if response.error?
      Rails.logger.error("Update Data Quality Summary Error: #{response.clean_inspect}")
      flash[:error] = response.error_message

      render :edit
    else
      redirect_to data_quality_summary_path(response.parsed_body), flash: { success: 'Data Quality Summary successfully updated' }
    end
  end

  def update_data_quality_summary
    summary_id = params.fetch('id', '')

    summary_response = cmr_client.get_data_quality_summaries(id: summary_id, provider_id: current_user.provider_id, token: token)

    if summary_response.error?
      Rails.logger.error("#{request.uuid} - DataQualitySummariesController#update_data_quality_summary - Retrieving Data Quality Summary Error: #{summary_response.clean_inspect}")
      flash[:error] = summary_response.error_message
      render :edit and return
    end

    existing_summary = summary_response.body.fetch('items', [])[0] unless summary_response.body.fetch('items', []).empty?
    native_id = existing_summary.fetch('meta', {}).fetch('native-id', '')
    updating_summary = existing_summary.fetch('umm', {})

    updating_summary['Name'] = params.fetch('name', '')
    updating_summary['Summary'] = params.fetch('summary', '')

    puts("@@@@@@@@ updating summary payload=#{updating_summary.inspect}")

    response = cmr_client.create_update_data_quality_summary(data_quality_summary: updating_summary, provider_id: current_user.provider_id, native_id: native_id, token: token)
    puts("@@@@@@@@ updating summary response=#{response.inspect}")
    if response.error?
      Rails.logger.error("Update Data Quality Summary Error: #{response.clean_inspect}")
      flash[:error] = response.error_message
      render :edit
    else
      redirect_to data_quality_summary_path(summary_id), flash: { success: 'Data Quality Summary successfully updated' }
    end
  end

  def load_data_quality_summaries
    permitted = params.to_unsafe_h unless params.nil?# need to understand what this is doing more, think related to nested parameters not permitted.
    # Default the page to 1
    page = permitted.fetch('page', 1)

    response = cmr_client.get_data_quality_summaries(provider_id: current_user.provider_id, token: token)
    if response.error?
      Rails.logger.error("#{request.uuid} - DataQualitySummariesController#index - Retrieve Data Quality Summary Definition Name GUIDs Error: #{response.clean_inspect}")
      flash[:error] = response.error_message
    end
    summary_list = response.body.fetch('items', []) unless response.error?
    summary_list = summary_list.sort_by{ |summary| summary.fetch('umm', {}).fetch('Name', '').downcase }
    @summaries = Kaminari.paginate_array(summary_list, total_count: summary_list.count).page(page).per(RESULTS_PER_PAGE)
  end

  def legacy_load_data_quality_summaries
    permitted = params.to_unsafe_h unless params.nil?# need to understand what this is doing more, think related to nested parameters not permitted.

    response = echo_client.get_data_quality_summary_definition_name_guids(token, current_provider_guid)

    summary_guids = []
    # No ruby idioms exist that will allow us to ensure this is a list, because it
    # is a list of dictionaries, not a list of strings
    unless response.error? || response.parsed_body.nil?
      parsed_response = response.parsed_body.fetch('Item', [])
      if parsed_response.is_a?(Hash)
        summary_guids << parsed_response.fetch('Guid', nil)
      else
        parsed_response.each do |item|
          summary_guids << item.fetch('Guid', nil)
        end
      end
      summary_guids = summary_guids.reject(&:blank?)
    end

    if response.error?
      Rails.logger.error("#{request.uuid} - DataQualitySummariesController#index - Retrieve Data Quality Summary Definition Name GUIDs Error: #{response.clean_inspect}")
      flash[:error] = I18n.t("controllers.data_quality_summaries.index.flash.timeout_error", data: "data quality summary definition name guids", request: request.uuid) if response.timeout_error?
    end

    summary_list = []
    summary_guids.each do |guid|
      summary_response = echo_client.get_data_quality_summary_definition(token, guid)

      if summary_response.success?
        summary_list << summary_response
      else
        Rails.logger.error("#{request.uuid} - DataQualitySummariesController#index - Retrieve Data Quality Summary Definition Error: #{summary_response.clean_inspect}")
        flash[:error] = I18n.t("controllers.data_quality_summaries.index.flash.timeout_error", data: "data quality summary definitions", request: request.uuid) if summary_response.timeout_error?
      end
    end

    summary_list.sort_by! { |summary| summary.parsed_body.fetch('Name', '').downcase }

    # Default the page to 1
    page = permitted.fetch('page', 1)

    @summaries = Kaminari.paginate_array(summary_list, total_count: summary_list.count).page(page).per(RESULTS_PER_PAGE)
  end

  def legacy_generate_payload
    {
      'Guid'              => params.fetch('id'),
      'Name'              => params.fetch('name'),
      'Summary'           => sanitize_for_echo(params.fetch('summary')),
      'OwnerProviderGuid' => current_provider_guid
    }
  end

  def legacy_set_summary
    result = echo_client.get_data_quality_summary_definition(token, params[:id])

    if result.success?
      @summary = result.parsed_body
    else
      Rails.logger.error("#{request.uuid} - DataQualitySummariesController#set_summary - Retrieve Data Quality Summary Definition Error: #{result.clean_inspect}")
      flash[:error] = I18n.t("controllers.data_quality_summaries.set_summary.flash.timeout_error", request: request.uuid) if result.timeout_error?
    end
  end

  def set_data_quality_summary
    response = cmr_client.get_data_quality_summaries(id: params[:id], provider_id: current_user.provider_id, token: token)
    puts("$$$$$$$$$$ set_data_quality_summary response=#{response.body.inspect}")
    if response.success?
      @summary = response.body.fetch('items', []).first unless response.body.fetch('items', []).empty?
    else
      Rails.logger.error("#{request.uuid} - DataQualitySummariesController#set_data_quality_summary - Retrieving Data Quality Summary Error: #{response.clean_inspect}")
      flash[:error] = response.error_message
    end
  end

  def set_summary
    puts("@@@@@@@@@@@@@@@@@@@@@@@@ Set summary called")
    if use_legacy_order_service?
      legacy_set_summary
    else
      set_data_quality_summary
    end
  end
end
