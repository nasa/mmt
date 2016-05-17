require "rexml/document"

class OrderPoliciesController < ApplicationController
  before_action :get_collections, only: [:new, :edit]

  def index
    get_policy
  end

  def new
    get_policy

    unless @policy.empty?
      flash[:notice] = "Order Policies already exist for #{@current_user.provider_id}."

      redirect_to edit_order_policies_path
    end
  end

  def edit
    get_policy
  end

  def create
    flash[:success] = 'Order Policies successfully created'

    redirect_to order_policies_path
  end

  def update
    if upsert_policy
      flash[:success] = 'Order Policies successfully updated'
    else
      flash[:error] ||= 'Error updating Order Policies'
    end

    redirect_to order_policies_path    
  end

  private

    def get_collections
      @collections = cmr_client.get_collections({provider_id: @current_user.provider_id}, token).body.fetch("items", [])
    end

    def get_policy
      @token = token_with_client_id
        
      begin
        # Calls to ECHO require the provider guid, not the id
        current_provider_guid = get_provider_guid(@current_user.provider_id)

        # This call will only work if a provider guid is supplied
        if current_provider_guid
          # Ask ECHO for a list of providers, response includes the name and guid
          response = Echo::ProviderPolicy.get_providers_policies(@token, [current_provider_guid])
          result = response.body.fetch(:get_providers_policies_response, {}).fetch(:result, {})

          # The result is nil if there is nothing to return
          unless result.nil? or result.fetch(:item).nil?
            @policy = result.fetch(:item, {})

            if @policy.key?(:properties)
              # If the policy has additional properties, this will prettify them for display/readability
              xml_doc = REXML::Document.new(@policy.fetch(:properties))
              xml_doc.write(@pretty_properties = "", 4)
            end
          end
        end
      rescue Savon::SOAPFault => e
        Rails.logger.error(e)
      end

      @policy = {} if defined?(@policy).nil?
    end

    def generate_upsert_payload
      payload = {
        :RetryAttempts => params.fetch("retry_attempts"), 
        :RetryWaitTime => params.fetch("retry_wait_time"), 
        :EndPoint => params.fetch("end_point"), 
        :Routing => params.fetch("routing_type"),
        :overrideNotificationEnabled => params.fetch("override_notification_enabled", false), 
        :SslPolicy => {
          :SslEnabled => params.fetch("ssl_policy", {}).fetch("ssl_enabled", false), 
          :SslCertificate => params.fetch("ssl_policy", {}).fetch("ssl_certificate", "")
        }, 
        :SupportedTransactions => params.fetch("supported_transactions", {}).keys,
        :Properties => params.fetch("properties")
      }

      order_items = params.fetch("collections_supporting_duplicate_order_items", {}).keys
      unless order_items.empty?
        payload[:OrderSupportsDuplicateCatalogItems] = true
        payload[:CollectionsSupportingDuplicateOrderItems] = order_items
      end

      unless params.fetch("max_items_per_order").empty?
        payload[:MaxItemsPerOrder] = params.fetch("max_items_per_order")
      end

      unless params.fetch("ordering_suspended_until_date").empty?
        payload[:OrderingSuspendedUntilDate] = params.fetch("ordering_suspended_until_date")
      end

      payload
    end

    def upsert_policy
      begin
        # echo_token = Echo::Authentication.login("USERNAME", "PW", behalfOfProvider: @current_user.provider_id, clientInfo: {UserIpAddress: request.remote_ip}).body.fetch(:login_response, {}).fetch(:result)

        Echo::ProviderPolicy.set_provider_policies(echo_token, generate_upsert_payload)

        return true
      rescue Savon::SOAPFault => e
        Rails.logger.error(e)

        flash[:error] = e.to_hash.fetch(:fault, {}).fetch(:detail, {}).fetch(:soap_message_validation_fault, "An unknown error has occurred.")

        return false
        # TODO: Implement error/validation messages
      end
    end
end