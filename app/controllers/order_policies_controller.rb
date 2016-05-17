require "rexml/document"

class OrderPoliciesController < ApplicationController
  before_action :get_collections, only: [:new, :edit]

  def index
    get_policy
  end

  def new
    @policy = {}
  end

  def edit
    get_policy
  end

  def create
    
  end

  def update
    
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
end