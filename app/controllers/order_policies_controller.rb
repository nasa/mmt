require 'rexml/document'

class OrderPoliciesController < ApplicationController
  before_action :set_collections, only: [:index, :new, :edit]

  def index
    set_policy

    if @policy.key?('Properties')
      # If the policy has additional properties, this will prettify them for display/readability
      xml_doc = REXML::Document.new(@policy.fetch('Properties'))
      xml_doc.write(@pretty_properties = '', 4)
    end
  end

  def new
    set_policy

    unless @policy.empty?
      flash[:notice] = "Order Policies already exist for #{@current_user.provider_id}."

      redirect_to edit_order_policies_path
    end
  end

  def edit
    set_policy
  end

  def create
    # Attempt to upsert the policies
    upsert_response = upsert_policy

    if upsert_response.error?
      flash[:error] ||= [*response.parsed_error].to_sentence
    else
      flash[:success] = 'Order Policies successfully created'
    end

    redirect_to order_policies_path
  end

  def update
    # Attempt to upsert the policies
    upsert_response = upsert_policy

    if upsert_response.error?
      flash[:error] ||= [*response.parsed_error].to_sentence
    else
      flash[:success] = 'Order Policies successfully updated'
    end

    redirect_to order_policies_path
  end

  def destroy
    response = echo_client.remove_provider_policies(token_with_client_id, current_provider_guid)

    if response.error?
      flash[:error] = [*response.parsed_error].to_sentence if response.error?
    else
      flash[:success] = 'Order Policies successfully removed'
    end

    redirect_to order_policies_path
  end

  private

  def set_collections
    @collections = cmr_client.get_collections({ provider_id: @current_user.provider_id }, token).body.fetch('items', [])
  end

  def current_provider_guid
    if @current_provider_guid.nil?
      @current_provider_guid = get_provider_guid(@current_user.provider_id)
    end

    @current_provider_guid
  end

  def set_policy
    # Get the provider's policies (will only ever be one)
    result = echo_client.get_providers_policies(token_with_client_id, current_provider_guid)

    # Check for an error OR nil, rather than returning an empty list or error it returns nil
    @policy = result.parsed_body.fetch('Item', {}) unless result.error? || result.parsed_body.fetch('Item', {}).fetch('xsi:nil', 'false') == 'true'

    # Default value in case of error
    @policy = {} if defined?(@policy).nil?
  end

  def generate_upsert_payload
    payload = {
      RetryAttempts: params.fetch('retry_attempts'),
      RetryWaitTime: params.fetch('retry_wait_time'),
      EndPoint: params.fetch('end_point'),
      Routing: params.fetch('routing_type'),
      overrideNotificationEnabled: params.fetch('override_notification_enabled', 'false'),
      SslPolicy: {
        SslEnabled: params.fetch('ssl_policy', {}).fetch('ssl_enabled', 'false'),
        SslCertificate: params.fetch('ssl_policy', {}).fetch('ssl_certificate', '')
      },
      SupportedTransactions: params.fetch('supported_transactions', [])
    }

    unless params.fetch('properties').empty?
      payload[:Properties] = params.fetch('properties')
    end

    order_items = params.fetch('collections_supporting_duplicate_order_items', [])
    unless order_items.empty?
      payload[:OrderSupportsDuplicateCatalogItems] = 'true'
      payload[:CollectionsSupportingDuplicateOrderItems] = order_items
    end

    unless params.fetch('max_items_per_order').empty?
      payload[:MaxItemsPerOrder] = params.fetch('max_items_per_order')
    end

    unless params.fetch('ordering_suspended_until_date').empty?
      payload[:OrderingSuspendedUntilDate] = params.fetch('ordering_suspended_until_date')
    end

    payload
  end

  def upsert_policy
    echo_client.set_provider_policies(token_with_client_id, current_provider_guid, generate_upsert_payload)
  end
end
