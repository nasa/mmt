module ManageCmr
  class OrderOptionsController < ManageCmrController
    add_breadcrumb 'Order Options', :order_options_path

    RESULTS_PER_PAGE = 25

    def index
      set_order_options
    end

    def new
      @order_option = {}

      add_breadcrumb 'New', new_order_option_path
    end

    def create
      create_order_option
    end

    def show
      show_order_option
    end

    def edit
      edit_order_option
    end

    def update
      update_order_option
    end

    def destroy
      delete_order_option
    end

    def deprecate
      deprecate_order_option
    end

    private

    def create_order_option
      order_option = params[:order_option]
      if order_option.fetch(:SortKey, '').blank?
        order_option.delete(:SortKey)
      end
      # Scope will always be PROVIDER
      order_option['Scope'] = 'PROVIDER'
      order_option['Id'] = get_order_option_id
      native_id = get_native_id

      metadata_specification = {}
      metadata_specification['Name'] = Rails.configuration.order_option_label
      metadata_specification['Version'] = Rails.configuration.order_option_version
      metadata_specification['URL'] = Rails.configuration.order_option_url
      order_option['MetadataSpecification'] = metadata_specification

      response = cmr_client.create_update_order_option(order_option: order_option, provider_id: current_user.provider_id, native_id: native_id, token: token)
      order_option_response_concept_id = response.body.fetch('concept-id', '')
      if response.success?
        order_option_response = retrieve_new_order_option(concept_id: order_option_response_concept_id, count: 3)
        if order_option_response.error?
          Rails.logger.error("#{request.uuid} - OrderOptionsController#create_order_option - Retrieving Order Option Error: #{response.clean_inspect}")
          flash[:error] = order_option_response.error_message
          redirect_back(fallback_location: manage_collections_path)
          return
        end
        new_order_option = order_option_response.body.fetch('items', [])[0] unless order_option_response.body.fetch('items', []).empty?
        order_option_concept_id = new_order_option.fetch('meta', {}).fetch('concept-id', '')
        flash[:success] = 'Order Option was successfully created.'
        redirect_to order_option_path(order_option_concept_id)
      else
        Rails.logger.error("Create Order Option Error: #{response.clean_inspect}")
        flash.now[:error] = response.error_message
        render :new
      end
    end

    def deprecate_order_option
      order_option_concept_id = params[:id]

      response = cmr_client.get_order_options(concept_id: order_option_concept_id, provider_id: current_user.provider_id, token: token)
      if response.error?
        Rails.logger.error("#{request.uuid} - OrderOptionsController#deprecate_order_option - Retrieving Order Option Error: #{response.clean_inspect}")
        flash[:error] = response.error_message
        redirect_back(fallback_location: manage_collections_path)
        return
      end

      existing_order_option = response.body.fetch('items', [])[0] unless response.body.fetch('items', []).empty?
      native_id = existing_order_option.fetch('meta', {}).fetch('native-id', '')
      updating_order_option = existing_order_option.fetch('umm', {})

      updating_order_option['Deprecated'] = true

      update_response = cmr_client.create_update_order_option(order_option: updating_order_option, provider_id: current_user.provider_id, native_id: native_id, token: token)

      if update_response.success?
        flash[:success] = 'Order Option was successfully deprecated.'
      else
        Rails.logger.error("Deprecate Order Option Error: #{update_response.clean_inspect}")
        flash[:error] = update_response.error_message
      end
      redirect_to order_options_path
    end

    def delete_order_option
      response = cmr_client.remove_order_option(native_id: params[:id], provider_id: current_user.provider_id, token: token)
      if response.success?
        flash[:success] = 'Order Option was successfully deleted.'
      else
        Rails.logger.error("#{request.uuid} - OrderOptionsController#delete_order_option - Delete Order Option Error: #{response.clean_inspect}")
        flash[:error] = response.error_message
      end
      redirect_to order_options_path
    end

    def edit_order_option
      @order_option_concept_id = params[:id]
      response = cmr_client.get_order_options(concept_id: @order_option_concept_id, provider_id: current_user.provider_id, token: token)
      if response.success?
        @order_option = response.body.fetch('items', [])[0] unless response.body.fetch('items', []).empty?
        add_breadcrumb @order_option.fetch('umm', {}).fetch('Name', ''), order_option_path(@order_option_concept_id)
        add_breadcrumb 'Edit', edit_order_option_path(@order_option_concept_id)
      else
        Rails.logger.error("#{request.uuid} - OrderOptionsController#edit_order_option - Retrieving Order Option Error: #{response.clean_inspect}")
        flash[:error] = response.error_message
        redirect_to order_options_path
      end
    end

    def update_order_option
      order_option_concept_id = params[:id]
      order_option_param = params[:order_option]

      response = cmr_client.get_order_options(concept_id: order_option_concept_id, provider_id: current_user.provider_id, token: token)
      if response.error?
        Rails.logger.error("#{request.uuid} - OrderOptionsController#update_order_option - Retrieving Order Option Error: #{response.clean_inspect}")
        flash[:error] = response.error_message
        render :edit and return
      end

      existing_order_option = response.body.fetch('items', [])[0] unless response.body.fetch('items', []).empty?
      native_id = existing_order_option.fetch('meta', {}).fetch('native-id', '')
      updating_order_option = existing_order_option.fetch('umm', {})

      if order_option_param.fetch(:SortKey, '').blank?
        updating_order_option.delete(:SortKey)
      else
        updating_order_option['SortKey'] = order_option_param.fetch(:SortKey, '')
      end
      updating_order_option['Name'] = order_option_param.fetch('Name', '')
      updating_order_option['Description'] = order_option_param.fetch('Description', '')
      updating_order_option['Form'] = order_option_param.fetch('Form', '')
      updating_order_option['Scope'] = 'PROVIDER'

      update_response = cmr_client.create_update_order_option(order_option: updating_order_option, provider_id: current_user.provider_id, native_id: native_id, token: token)
      if update_response.success?
        flash[:success] = 'Order Option was successfully updated.'
        redirect_to order_option_path(order_option_concept_id)
      else
        Rails.logger.error("Update Order Option Error: #{update_response.clean_inspect}")
        flash[:error] = update_response.error_message
        render :edit
      end
    end

    def show_order_option
      response = cmr_client.get_order_options(concept_id: params[:id], provider_id: current_user.provider_id, token: token)
      if response.success?
        @order_option = response.body.fetch('items', [])[0] unless response.body.fetch('items', []).empty?
      else
        Rails.logger.error("#{request.uuid} - OrderOptionsController#show_order_option - Retrieving Order Option Error: #{response.clean_inspect}")
        flash[:error] = response.error_message
        redirect_to order_options_path
      end
    end

    def set_order_options
      permitted = params.to_unsafe_h unless params.nil?# need to understand what this is doing more, think related to nested parameters not permitted.
      # Default the page to 1
      page = permitted.fetch('page', 1)
      order_options_response = cmr_client.get_order_options(provider_id: current_user.provider_id, token: token)
      if order_options_response.error?
        Rails.logger.error("#{request.uuid} - OrderOptionsController#set_order_options - Retrieving Order Options Error: #{order_options_response.clean_inspect}")
        flash[:error] = order_options_response.error_message
      end
      order_options = order_options_response.body.fetch('items', []) unless order_options_response.error?
      order_options = order_options.sort_by{ |option| option.fetch('umm', {}).fetch('Name', '').downcase }
      @order_options = Kaminari.paginate_array(order_options, total_count: order_options.count).page(page).per(RESULTS_PER_PAGE)
    end

    def retrieve_new_order_option(concept_id:, count: 1)
      start = Time.new
      response = {}
      count.times do |i|
        response = cmr_client.get_order_options(concept_id: concept_id, provider_id: current_user.provider_id, token: token)
        if (response.success? && response.body.fetch('hits', 0) > 0) || response.error?
          return response
        end
        # Wait for CMR indexing
        sleep 1
      end
      duration = Time.new - start
      Rails.logger.error("#{request.uuid} - OrderOptionsController#retrieve_new_order_option - Tried #{count} times to fetch new Order Option. Duration: #{duration} seconds")
      response
    end

    def get_native_id
      SecureRandom.uuid
    end

    def get_order_option_id
      SecureRandom.uuid
    end
  end
end
