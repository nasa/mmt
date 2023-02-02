# :nodoc:
class OrderPoliciesController < ManageCmrController
  before_action :set_collections, only: [:index, :new, :edit]

  if Rails.configuration.use_legacy_order_service
    before_action :legacy_set_policy, only: [:index, :new, :edit]
  else
    before_action :set_policy, only: [:index, :new, :edit]
  end

  add_breadcrumb 'Order Policies', :order_policies_path

  def index
    if use_legacy_order_service?
      legacy_set_policy
    else
      set_policy
    end
  end

  def new
    if use_legacy_order_service?
      legacy_set_policy
    else
      set_policy
    end

    add_breadcrumb 'New', new_order_policies_path
    redirect_to edit_order_policies_path, flash: { notice: "Order Policies already exist for #{current_user.provider_id}." } unless @policy.empty?
  end

  def edit
    if use_legacy_order_service?
      legacy_set_policy
    else
      set_policy
    end

    add_breadcrumb 'Edit', edit_order_policies_path
  end

  def create
    upsert_response = if use_legacy_order_service?
                        legacy_upsert_policy
                      else
                        create_provider_policy
                      end

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
    upsert_response = if use_legacy_order_service?
                        legacy_upsert_policy
                      else
                        update_provider_policy
                      end

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
    response = if use_legacy_order_service?
                 legacy_remove_policy
               else
                 remove_policy
               end

    if response.error?
      Rails.logger.error("Delete Order Policies Error: #{response.clean_inspect}")
      flash[:error] = response.error_message
    else
      flash[:success] = 'Order Policies successfully removed'
    end

    redirect_to order_policies_path
  end

  def test_endpoint_connection
    response = if use_legacy_order_service?
                 echo_client.test_endpoint_connection(token, current_provider_guid)
               else
                 cmr_client.test_endpoint_connection(token, current_user.provider_id)
               end

    if response.error?
      Rails.logger.error("Test Endpoint Connection Error: #{response.clean_inspect}")
      message = 'Test endpoint connection failed. Please try again.'
    else
      message = 'Test endpoint connection was successful.'
    end

    render json: { message: message }
  end

  private

  def legacy_set_policy
    # Get the provider's policies (will only ever be one)
    result = echo_client.get_providers_policies(token, current_provider_guid)

    # Check for an error OR nil, rather than returning an empty list or error it returns nil
    @policy = result.parsed_body.fetch('Item', {}) unless result.error? || result.parsed_body.fetch('Item', {}).fetch('xsi:nil', 'false') == 'true'

    if result.error?
      Rails.logger.error("#{request.uuid} - OrderPoliciesController#set_policy - Retrieve Providers Policies Error: #{result.clean_inspect}")
      flash[:error] = I18n.t("controllers.order_policies.set_policy.flash.timeout_error", request: request.uuid) if result.timeout_error?
    end

    # Default value in case of error
    @policy = {} if defined?(@policy).nil?

    # This comes to us as a Hash containing 'Item' but is returned as a simple array. For the purposes
    # of rendering this and DRYing up the code, we'll convert this here so its the same in all uses
    if @policy.key?('SupportedTransactions')
      @policy['SupportedTransactions'] = @policy.fetch('SupportedTransactions', {}).fetch('Item', [])
    end

    if @policy.key?('CollectionsSupportingDuplicateOrderItems')
      @policy['CollectionsSupportingDuplicateOrderItems'] = @policy.fetch('CollectionsSupportingDuplicateOrderItems', {}).fetch('Item', [])
    end
  end

  def legacy_generate_upsert_payload
    # SUBMIT is given to all orders, no need to select it
    provided_supported_transactions = %w(SUBMIT)

    @policy = {
      RetryAttempts: params.fetch('retry_attempts'),
      RetryWaitTime: params.fetch('retry_wait_time'),
      EndPoint: params.fetch('end_point'),
      Routing: 'ORDER_FULFILLMENT_V9', # Only one value exists for this key, so we're hardcoding it and hiding it from the form
      overrideNotificationEnabled: params.fetch('override_notification_enabled', 'false'),
      SslPolicy: {
        SslEnabled: params.fetch('ssl_policy', {}).fetch('ssl_enabled', 'false'),
        SslCertificate: params.fetch('ssl_policy', {}).fetch('ssl_certificate', '')
      },
      SupportedTransactions: params.fetch('supported_transactions', []) | provided_supported_transactions
    }

    unless params.fetch('properties').empty?
      @policy[:Properties] = params.fetch('properties')
    end

    order_items = params.fetch('collections_supporting_duplicate_order_items_toList', [])
    unless order_items.empty?
      @policy[:OrderSupportsDuplicateCatalogItems] = 'true'
      @policy[:CollectionsSupportingDuplicateOrderItems] = order_items
    end

    unless params.fetch('max_items_per_order').empty?
      @policy[:MaxItemsPerOrder] = params.fetch('max_items_per_order')
    end

    unless params.fetch('ordering_suspended_until_date').empty?
      @policy[:OrderingSuspendedUntilDate] = params.fetch('ordering_suspended_until_date')
    end

    @policy
  end

  def legacy_upsert_policy
    response = echo_client.set_provider_policies(token, current_provider_guid, legacy_generate_upsert_payload)

    if response.error?
      Rails.logger.error("#{request.uuid} - OrderPoliciesController#legacy_upsert_policy - Set Providers Policies Error: #{response.clean_inspect}")
      flash[:error] = I18n.t("controllers.order_policies.upsert_policy.flash.timeout_error", request: request.uuid) if response.timeout_error?
    end

    response
  end

  def remove_policy
    cmr_client.remove_provider_policy(token, current_user.provider_id)
  end

  def legacy_remove_policy
    echo_client.remove_provider_policies(token, current_provider_guid)
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
