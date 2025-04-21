module ManageCmr
  class DataQualitySummariesController < ManageCmrController
    include DataManagementHelper

    add_breadcrumb 'Data Quality Summaries', :data_quality_summaries_path

    RESULTS_PER_PAGE = 25

    def index
      load_data_quality_summaries
    end

    def show
      set_data_quality_summary
      add_breadcrumb @summary.fetch('umm', {}).fetch('Name', ''), data_quality_summary_path(@summary.fetch('umm', {}).fetch('Id', ''))
    end

    def new
      @summary = {}

      add_breadcrumb 'New', new_data_quality_summary_path
    end

    def edit
      set_data_quality_summary
      add_breadcrumb @summary.fetch('umm', {}).fetch('Name', ''), data_quality_summary_path(@summary.fetch('umm', {}).fetch('Id', ''))
      add_breadcrumb 'Edit', edit_data_quality_summary_path(@summary.fetch('umm', {}).fetch('Id', ''))
    end

    def create
      create_data_quality_summary
    end

    def update
      update_data_quality_summary
    end

    def destroy
      destroy_data_quality_summary
    end

    private

    def create_data_quality_summary
      @summary = generate_payload
      native_id = get_native_id
      response = cmr_client.create_update_data_quality_summary(data_quality_summary: @summary, provider_id: current_user.provider_id, native_id: native_id, token: token)
      if response.error?
        Rails.logger.error("Create Data Quality Summary Error: #{response.clean_inspect}")
        flash[:error] = response.error_message
        render :new
      else
        summary = get_data_quality_summary(concept_id: response.body.fetch('concept-id', ''), count: 3)
        if summary.blank?
          flash[:success] = 'Data Quality Summary successfully created but not yet available, please try again in a few minutes.'
          redirect_to data_quality_summaries_path and return
        end

        redirect_to data_quality_summary_path(response.body.fetch('concept-id', '')), flash: { success: 'Data Quality Summary successfully created' }
      end
    end

    def generate_payload
      summary = {}
      summary['Name'] = params.fetch('name', '')
      summary['Summary'] = params.fetch('summary', '')
      summary['Id'] = SecureRandom.uuid

      metadata_specification = {}
      metadata_specification['Name'] = Rails.configuration.data_quality_summary_label
      metadata_specification['Version'] = Rails.configuration.data_quality_summary_version
      metadata_specification['URL'] = Rails.configuration.data_quality_summary_url
      summary['MetadataSpecification'] = metadata_specification
      summary
    end

    def destroy_data_quality_summary
      native_id = params[:id]
      response = cmr_client.remove_data_quality_summary(provider_id: current_user.provider_id, native_id: native_id, token: token)
      if response.error?
        Rails.logger.error("Delete Data Quality Summary Error: #{response.clean_inspect}")
        flash[:error] = response.error_message
      else
        flash[:success] = 'Data Quality Summary successfully deleted'
      end
      redirect_to data_quality_summaries_path
    end

    def update_data_quality_summary
      concept_id = params.fetch('id', '')
      summary_response = cmr_client.get_data_quality_summaries(concept_id: concept_id, provider_id: current_user.provider_id, token: token)
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

      response = cmr_client.create_update_data_quality_summary(data_quality_summary: updating_summary, provider_id: current_user.provider_id, native_id: native_id, token: token)
      if response.error?
        Rails.logger.error("Update Data Quality Summary Error: #{response.clean_inspect}")
        flash[:error] = response.error_message
        render :edit
      else
        redirect_to data_quality_summary_path(concept_id), flash: { success: 'Data Quality Summary successfully updated' }
      end
    end

    def load_data_quality_summaries
      permitted = params.to_unsafe_h unless params.nil?# need to understand what this is doing more, think related to nested parameters not permitted.
      # Default the page to 1
      page = permitted.fetch('page', 1)
      response = cmr_client.get_data_quality_summaries(provider_id: current_user.provider_id, token: token)
      if response.error?
        Rails.logger.error("#{request.uuid} - DataQualitySummariesController#load_data_quality_summaries - Retrieve Data Quality Summary Definition Name GUIDs Error: #{response.clean_inspect}")
        flash[:error] = response.error_message
      end
      summary_list = response.body.fetch('items', []) unless response.error?
      summary_list = summary_list.sort_by{ |summary| summary.fetch('umm', {}).fetch('Name', '').downcase }
      @summaries = Kaminari.paginate_array(summary_list, total_count: summary_list.count).page(page).per(RESULTS_PER_PAGE)
    end

    def set_data_quality_summary
      @summary = get_data_quality_summary(concept_id: params[:id], count: 3)
    end

    def get_data_quality_summary(concept_id:, count: 1)
      start = Time.new
      count.times do |i|
        response = cmr_client.get_data_quality_summaries(concept_id: concept_id, provider_id: current_user.provider_id, token: token)
        if (response.success? && response.body.fetch('hits', 0) > 0) || response.error?
          summary = response.body.fetch('items', []).first unless response.body.fetch('items', []).empty?
          return summary
        end
        # Wait for CMR indexing
        sleep 1
      end
      duration = Time.new - start
      Rails.logger.error("#{request.uuid} - DataQualitySummariesController#get_data_quality_summary - Tried #{count} times to fetch new Order Option. Duration: #{duration} seconds")
      return {}
    end

    def get_native_id
      SecureRandom.uuid
    end
  end
end
