# :nodoc:
class OrderOptionAssignmentsController < ManageCmrController
  add_breadcrumb 'Order Option Assignments', :order_option_assignments_path

  def index; end

  def new
    add_breadcrumb 'New', new_order_option_assignment_path

    @order_option_select_values = get_order_options
  end

  def edit
    collections = get_provider_collections(concept_id: params['collectionsChooser_toList'])

    @collections_to_list = []

    collections.fetch('items', []).each do |collection|
      id = collection['meta']['concept-id']
      options = { 'catalog_item[]' => id }
      assignments_response = cmr_client.get_order_option_assignments(options, echo_provider_token)
      if assignments_response.success?
        option_defs = Array.wrap(get_order_option_defs(assignments_response.body))

        if !option_defs.empty?
          option_defs.each do |option_def|
            collection_copy = collection.clone
            collection_copy['option-def'] = option_def
            assignment = find_assignment(option_def['Guid'], assignments_response.body)

            unless assignment.nil?
              collection_copy['option-assignment-guid'] = assignment['catalog_item_option_assignment']['id']
            end

            @collections_to_list << collection_copy
          end
        else
          @collections_to_list << collection
        end

      else
        Rails.logger.error(assignments_response.body)
        flash[:error] = assignments_response.body['errors'].inspect
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

  def show; end

  def create
    success_count = 0
    error_count = 0
    @order_option = params.fetch('order-options', '')

    params['collectionsChooser_toList'].each do |concept_id|
      response = cmr_client.add_order_option_assignments(concept_id, @order_option, echo_provider_token)
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

  def destroy
    success_count = 0
    error_count = 0

    params.fetch(:order_option_assignment, []).each do |assignment_guid|
      response = cmr_client.delete_order_option_assignments(assignment_guid, echo_provider_token)

      success_count += 1 unless response.error?
      error_count += 1 if response.error?
    end

    flash_messages = {}
    flash_messages[:success] = "Deleted #{success_count} #{'order option assignment'.pluralize(success_count)} successfully." if success_count > 0
    flash_messages[:error] = "Failed to delete #{error_count} #{'order option assignment'.pluralize(error_count)}." if error_count > 0
    flash_messages[:notice] = 'No order option assignments provided to delete.' if error_count.zero? && success_count.zero?

    redirect_to order_option_assignments_path, flash: flash_messages
  end

  private

  def find_assignment(guid, body)
    body.each do |item|
      if item['catalog_item_option_assignment']['option_definition_id'] == guid
        return item
      end
    end
  end

  def get_order_option_defs(option_infos)
    return [] if option_infos.empty?

    guids = []

    option_infos.each do |option_info|
      guids << option_info['catalog_item_option_assignment']['option_definition_id']
    end

    order_option_response = echo_client.get_order_options(echo_provider_token, guids)

    order_option_list = if order_option_response.success?
                          # Retreive the order options
                          Array.wrap(order_option_response.parsed_body(parser: 'libxml').fetch('Item', {}))
                        else
                          Rails.logger.error(order_option_response.body)
                          []
                        end

    order_option_list
  end

  def get_order_options
    order_option_response = echo_client.get_order_options(echo_provider_token)
    order_option_list = if order_option_response.success?
                          # Retreive the order options
                          Array.wrap(order_option_response.parsed_body(parser: 'libxml').fetch('Item', {}))
                        else
                          Rails.logger.error(order_option_response.body)
                          []
                        end

    order_option_select_values = []

    order_option_list.each do |order_option|
      opt = [order_option['Name'], order_option['Guid']]
      order_option_select_values << opt
    end

    order_option_select_values
  end
end
