module ManageCmr
  # :nodoc:
  class OrderPoliciesController < ManageCmrController
    before_action :set_collections, only: [:index, :new, :edit]
    before_action :set_policy, only: [:index, :new, :edit]

    add_breadcrumb 'Order Policies', :order_policies_path

    def index
      set_policy
    end

    def new
      set_policy

      add_breadcrumb 'New', new_order_policies_path
      redirect_to edit_order_policies_path, flash: { notice: "Order Policies already exist for #{current_user.provider_id}." } unless @policy.empty?
    end

    def edit
      set_policy

      add_breadcrumb 'Edit', edit_order_policies_path
    end

    def create
      upsert_response = create_provider_policy

      if upsert_response.error?
        @policy.deep_stringify_keys!
        Rails.logger.error("Create Order Policies Error: #{upsert_response.clean_inspect}")
        flash[:error] = upsert_response.error_message
        render :new
      else
        redirect_to order_policies_path, flash: { success: 'Order Policies successfully created' }
      end
    end

    def update
      upsert_response = update_provider_policy

      if upsert_response.error?
        @policy.deep_stringify_keys!
        Rails.logger.error("Update Order Policies Error: #{upsert_response.clean_inspect}")
        flash[:error] = upsert_response.error_message
        render :edit
      else
        redirect_to order_policies_path, flash: { success: 'Order Policies successfully updated' }
      end
    end

    def destroy
      response = remove_policy

      if response.error?
        Rails.logger.error("Delete Order Policies Error: #{response.clean_inspect}")
        flash[:error] = response.error_message
      else
        flash[:success] = 'Order Policies successfully removed'
      end

      redirect_to order_policies_path
    end

    def test_endpoint_connection
      response = cmr_client.test_endpoint_connection(token, current_user.provider_id)

      if response.error?
        Rails.logger.error("Test Endpoint Connection Error: #{response.clean_inspect}")
        message = 'Test endpoint connection failed. Please try again.'
      else
        message = 'Test endpoint connection was successful.'
      end

      render json: { message: message }
    end

    private

    def remove_policy
      cmr_client.remove_provider_policy(token, current_user.provider_id)
    end

    def set_policy
      result = cmr_client.get_provider_policy(token, current_user.provider_id)
      @policy = result.body.fetch('data', {}).fetch('providerPolicy', {}) unless result.error?
      if result.error?
        Rails.logger.error("#{request.uuid} - OrderPoliciesController#set_policy - Retrieve Providers Policies Error: #{result.clean_inspect}")
        flash[:error] = I18n.t("controllers.order_policies.set_policy.flash.timeout_error", request: request.uuid) if result.timeout_error?
      end
      @policy = {} if @policy.nil?
    end

    def generate_order_policy_payload
      @policy = {
        retryAttempts: params.fetch('retry_attempts'),
        retryWaitTime: params.fetch('retry_wait_time'),
        endpoint: params.fetch('end_point'),
        overrideNotifyEnabled: params.fetch('override_notification_enabled', '0'),
        sslPolicy: {
          sslEnabled: params.fetch('ssl_policy', {}).fetch('ssl_enabled', '0'),
          sslCertificate: params.fetch('ssl_policy', {}).fetch('ssl_certificate', '')
        }
      }
      unless params.fetch('max_items_per_order').empty?
        @policy[:maxItemsPerOrder] = params.fetch('max_items_per_order')
      end

      unless params.fetch('ordering_suspended_until_date').empty?
        @policy[:orderingSuspendedUntilDate] = params.fetch('ordering_suspended_until_date')
      end

      unless params.fetch('properties').empty?
        @policy[:referenceProps] = params.fetch('properties')
      end
      @policy
    end

    def update_provider_policy
      response = cmr_client.update_provider_policy(token, current_user.provider_id, generate_order_policy_payload)
      if response.error?
        Rails.logger.error("#{request.uuid} - OrderPoliciesController#update_provider_policy - Update Providers Policies Error: #{response.clean_inspect}")
        flash[:error] = I18n.t("controllers.order_policies.upsert_policy.flash.timeout_error", request: request.uuid) if response.timeout_error?
      end
      response
    end

    def create_provider_policy
      response = cmr_client.create_provider_policy(token, current_user.provider_id, generate_order_policy_payload)
      if response.error?
        Rails.logger.error("#{request.uuid} - OrderPoliciesController#create_provider_policy - Create Providers Policies Error: #{response.clean_inspect}")
        flash[:error] = I18n.t("controllers.order_policies.upsert_policy.flash.timeout_error", request: request.uuid) if response.timeout_error?
      end
      response
    end
  end
end
