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
    # Attempt to upsert the policies
    upsert_response = upsert_policy

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
    # Attempt to upsert the policies
    upsert_response = upsert_policy

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
    response = echo_client.remove_provider_policies(token, current_provider_guid)

    if response.error?
      Rails.logger.error("Delete Order Policies Error: #{response.clean_inspect}")
      flash[:error] = response.error_message
    else
      flash[:success] = 'Order Policies successfully removed'
    end

    redirect_to order_policies_path
  end

  def test_endpoint_connection
    response = echo_client.test_endpoint_connection(token, current_provider_guid)

    message = if response.error?
                response.error_message
              else
                'Test endpoint connection was successful.'
              end

    render json: { message: message }
  end

  private

  def set_policy
    result = cmr_client.get_provider_policies(token, current_user.provider_id)
    @policy = result.body.fetch('data', {}).fetch('providerPolicy', {}) unless result.error?
    if result.error?
      Rails.logger.error("#{request.uuid} - OrderPoliciesController#set_policy - Retrieve Providers Policies Error: #{result.clean_inspect}")
      flash[:error] = I18n.t("controllers.order_policies.set_policy.flash.timeout_error", request: request.uuid) if result.timeout_error?
    end
    # Default value in case of error
    @policy = {} if defined?(@policy).nil?
  end

  def generate_upsert_payload
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

  def upsert_policy
    response = cmr_client.set_provider_policies(token, current_user.provider_id, generate_order_policy_payload)
    puts("########## response=#{response.body}")
    if response.error?
      Rails.logger.error("#{request.uuid} - OrderPoliciesController#upsert_policy - Set Providers Policies Error: #{response.clean_inspect}")
      flash[:error] = I18n.t("controllers.order_policies.upsert_policy.flash.timeout_error", request: request.uuid) if response.timeout_error?
    end

    response
  end
end
