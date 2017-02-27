require 'faraday_middleware'

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
      flash[:error] = upsert_response.error_message
      render :edit
    else
      redirect_to order_policies_path, flash: { success: 'Order Policies successfully updated' }
    end
  end

  def destroy
    response = echo_client.remove_provider_policies(token_with_client_id, current_provider_guid)

    if response.error?
      flash[:error] = response.error_message
    else
      flash[:success] = 'Order Policies successfully removed'
    end

    redirect_to order_policies_path
  end

  def url_exists
    message = nil
    uri = nil
    url = nil

    begin
      uri = URI.parse(params[:url])
    rescue => err
      message = 'Test Endpoint Connection failed: Invalid endpoint.'
      render :json => { :message => message }
      return
    end

    if uri.scheme.nil?
      url = 'http://' + uri.to_s
    else
      url = uri.to_s
    end

    conn = Faraday.new(:url => url) do |c|
      c.use FaradayMiddleware::FollowRedirects, limit: 3
      c.use Faraday::Response::RaiseError # raise exceptions on 40x, 50x responses
      c.use Faraday::Adapter::NetHttp
    end

    begin
      response = conn.head
      if response.env[:response].status == 200
        message = 'Test endpoint connection was successful.'
      else
        message = "Test Endpoint Connection failed. Reason: endpoint returned an HTTP status of #{response.env[:response].status}"
      end
    rescue => err
      Rails.logger.error('Invalid endpoint: ' + err.inspect)
      message = 'Test Endpoint Connection failed: Invalid endpoint.'
    end

    render :json => { :message => message }
  end

  private

  def set_policy
    # Get the provider's policies (will only ever be one)
    result = echo_client.get_providers_policies(token_with_client_id, current_provider_guid)

    # Check for an error OR nil, rather than returning an empty list or error it returns nil
    @policy = result.parsed_body.fetch('Item', {}) unless result.error? || result.parsed_body.fetch('Item', {}).fetch('xsi:nil', 'false') == 'true'

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

  def upsert_policy
    echo_client.set_provider_policies(token_with_client_id, current_provider_guid, generate_upsert_payload)
  end


end
