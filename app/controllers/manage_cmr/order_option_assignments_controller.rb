module ManageCmr
  # :nodoc:
  class OrderOptionAssignmentsController < ManageCmrController
    add_breadcrumb 'Order Option Assignments', :order_option_assignments_path

    def index; end

    def new
      add_breadcrumb 'New', new_order_option_assignment_path

      @order_option_select_values = get_order_options
      @service_select_values = get_services
    end

    def edit
      edit_order_option_assignments
    end

    def show; end

    def create
      create_order_option_assignments
    end

    def destroy
      destroy_order_option_assignments
    end

    private

    def create_order_option_assignments
      success_count = 0
      error_count = 0
      order_option_concept_id = params.fetch('order-options', '')
      service_concept_id = params.fetch('services', '')

      Array.wrap(params['collectionsChooser_toList']).each do |collection_concept_id|
        response = cmr_client.create_collection_service_association(collection_concept_id: collection_concept_id, service_concept_id: service_concept_id, order_option_concept_id: order_option_concept_id, token: token)
        success_count += 1 unless response.error?
        error_count += 1 if response.error?

        if response.error?
          Rails.logger.error("Order Option Assignment Error: #{response.body}")
        end
      end

      flash_messages = {}
      flash_messages[:success] = "#{success_count} #{'Order Option assignment'.pluralize(success_count)} created successfully." if success_count > 0
      flash_messages[:error] = "#{error_count} #{'Order Option assignment'.pluralize(error_count)} failed to save." if error_count > 0

      redirect_to order_option_assignments_path, flash: flash_messages
    end

    def destroy_order_option_assignments
      success_count = 0
      error_count = 0

      params.fetch(:order_option_assignment, []).each do |assignment|
        association = assignment.split('@')
        collection_concept_id = association[0]
        service_concept_id = association[1]

        # The order-option is on the association payload, deleting the association
        delete_service_assoc_response = cmr_client.delete_collection_service_association(service_concept_id: service_concept_id, collection_concept_id: collection_concept_id, token: token)
        success_count += 1 unless delete_service_assoc_response.error?
        error_count += 1 if delete_service_assoc_response.error?
      end

      flash_messages = {}
      flash_messages[:success] = "Deleted #{success_count} #{'order option assignment'.pluralize(success_count)} successfully." if success_count > 0
      flash_messages[:error] = "Failed to delete #{error_count} #{'order option assignment'.pluralize(error_count)}." if error_count > 0
      flash_messages[:notice] = 'No order option assignments provided to delete.' if error_count.zero? && success_count.zero?

      redirect_to order_option_assignments_path, flash: flash_messages
    end

    def edit_order_option_assignments
      collections = get_provider_collections(concept_id: params['collectionsChooser_toList'], page_size: params['collectionsChooser_toList'].count)
      @collections_to_list = []

      collections.fetch('items', []).each do |collection|
        associated_services = collection.fetch('meta', {}).fetch('association-details', {}).fetch('services', [])
        order_options = []
        unless associated_services.empty?
          associated_services.each do |service|
            order_option_concept_id = service.fetch('data', {}).fetch('order_option', '')
            service_concept_id = service.fetch('concept-id', '')
            service_def = get_service_def(service_concept_id)
            order_option = {}
            order_option = get_order_option_def(order_option_concept_id) unless order_option_concept_id.blank?
            order_option['service_concept_id'] = service_concept_id
            order_option['service_name'] = service_def.fetch('umm', {}).fetch('Name', '')
            order_options << order_option
          end
        end
        if !order_options.empty?
          order_options.each do |option_def|
            collection_copy = collection.clone
            collection_copy['option-def'] = option_def

            @collections_to_list << collection_copy
          end
        else
          @collections_to_list << collection
        end

        empty_assignment_cnt = 0
        @collections_to_list.each do |coll|
          empty_assignment_cnt += 1 if coll['option-def'].nil?
        end

        @all_empty_assignments = false

        if empty_assignment_cnt == @collections_to_list.length
          @all_empty_assignments = true
        end
      end
    end

    def get_order_option_def(order_option_concept_id)
      order_option = {}
      order_option_response = cmr_client.get_order_options(provider_id: current_user.provider_id, concept_id: order_option_concept_id, token: token)
      if order_option_response.success?
        order_option = order_option_response.body.fetch('items', [])[0] unless order_option_response.body.fetch('items', []).empty?
      end
      order_option
    end

    def get_service_def(service_concept_id)
      service = {}
      options = {}
      options[:concept_id] = service_concept_id
      service_response = cmr_client.get_services(options, token)
      if service_response.success?
        service = service_response.body.fetch('items', [])[0] unless service_response.body.fetch('items', []).empty?
      end
      service
    end

    def get_order_options
      order_options_response = cmr_client.get_order_options(provider_id: current_user.provider_id, token: token)
      if order_options_response.error?
        flash[:error] = I18n.t("controllers.manage_cmr.get_order_option_list.flash.error", request: request.uuid)
        Rails.logger.error("#{request.uuid} - OrderOptionAssignmentsController#get_order_options - Retrieve Order Options Error, message=#{order_options_response.error_message}")
        return
      end
      order_option_list = Array.wrap(order_options_response.body.fetch('items', []))

      order_option_select_values = []

      order_option_list.select { |option| option.fetch('umm', {}).fetch('Deprecated', false) == false }.each do |order_option|
        opt = [order_option.fetch('umm', {}).fetch('Name', ''), order_option.fetch('meta', {}).fetch('concept-id', '')]
        order_option_select_values << opt
      end

      order_option_select_values.sort
    end

    def get_services
      options = {}
      options['provider_id'] = current_user.provider_id
      services_response = cmr_client.get_services(options, token)
      if services_response.error?
        flash[:error] = I18n.t("controllers.manage_cmr.get_order_option_list.flash.error", request: request.uuid)
        Rails.logger.error("#{request.uuid} - OrderOptionAssignmentsController#get_services - Retrieve Services Error, message=#{services_response.error_message}")
        return
      end
      service_list = Array.wrap(services_response.body.fetch('items', []))

      service_select_values = []

      service_list.select { |service| service.fetch('umm', {}).fetch('Deprecated', false) == false }.each do |service_element|
        opt = [service_element.fetch('umm', {}).fetch('Name', ''), service_element.fetch('meta', {}).fetch('concept-id', '')]
        service_select_values << opt
      end

      service_select_values.sort
    end
  end
end
