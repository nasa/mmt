# :nodoc:
class OrderOptionAssignmentsController < ManageCmrController
  add_breadcrumb 'Order Option Assignments', :order_option_assignments_path

  def index; end

  def new
    add_breadcrumb 'New', new_order_option_assignment_path

    @order_option_select_values = if use_legacy_order_service?
                                    legacy_get_order_options
                                  else
                                    get_order_options
                                  end
  end

  def edit
    if use_legacy_order_service?
      legacy_edit_order_option_assignments
    else
      edit_order_option_assignments
    end
  end

  def show; end

  def create
    if use_legacy_order_service?
      legacy_create_order_option_assignments
    else
      create_order_option_assignments
    end
  end

  def destroy
    if use_legacy_order_service?
      legacy_destroy_order_option_assignments
    else
      destroy_order_option_assignments
    end
  end

  private

  def create_order_option_assignments

  end

  def legacy_create_order_option_assignments
    success_count = 0
    error_count = 0
    @order_option = params.fetch('order-options', '')

    if echo_provider_token.blank?
      flash[:error] = "Error retrieving echo provider token.  Try logging in with launchpad"
      redirect_back(fallback_location: manage_collections_path)
      return
    end

    Array.wrap(params['collectionsChooser_toList']).each do |concept_id|
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

  def destroy_order_option_assignments

  end

  def legacy_destroy_order_option_assignments
    success_count = 0
    error_count = 0

    if echo_provider_token.blank?
      flash[:error] = "Error retrieving echo provider token.  Try logging in with launchpad"
      redirect_back(fallback_location: manage_collections_path)
      return
    end

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

  def edit_order_option_assignments

  end

  def legacy_edit_order_option_assignments
    collections = get_provider_collections(concept_id: params['collectionsChooser_toList'], page_size: params['collectionsChooser_toList'].count)

    @collections_to_list = []

    if echo_provider_token.blank?
      flash[:error] = "Error retrieving echo provider token.  Try logging in with launchpad"
      redirect_back(fallback_location: manage_collections_path)
      return
    end

    collections.fetch('items', []).each do |collection|
      id = collection['meta']['concept-id']
      options = { 'catalog_item[]' => id }
      assignments_response = cmr_client.get_order_option_assignments(options, echo_provider_token)
      if assignments_response.success?
        option_defs = Array.wrap(legacy_get_order_option_defs(assignments_response.body))

        if !option_defs.empty?
          option_defs.each do |option_def|
            collection_copy = collection.clone
            collection_copy['option-def'] = option_def
            assignment = legacy_find_assignment(option_def['Guid'], assignments_response.body)

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

  def legacy_find_assignment(guid, body)
    body.each do |item|
      if item['catalog_item_option_assignment']['option_definition_id'] == guid
        return item
      end
    end
  end

  def legacy_get_order_option_defs(option_infos)
    return [] if option_infos.empty?

    if echo_provider_token.blank?
      flash[:error] = "Error retrieving echo provider token.  Try logging in with launchpad"
      redirect_back(fallback_location: manage_collections_path)
      return
    end

    guids = []

    option_infos.each do |option_info|
      guids << option_info['catalog_item_option_assignment']['option_definition_id']
    end

    order_option_response = get_order_option_list(echo_provider_token, guids)
    order_option_list = Array.wrap(order_option_response.fetch('Result', []))

    order_option_list
  end

  def legacy_get_order_options
    if echo_provider_token.blank?
      flash[:error] = "Error retrieving echo provider token.  Try logging in with launchpad"
      redirect_back(fallback_location: manage_collections_path)
      return
    end

    order_option_response = get_order_option_list(echo_provider_token)
    order_option_list = Array.wrap(order_option_response.fetch('Result', []))

    order_option_select_values = []

    order_option_list.select { |option| option.fetch('Deprecated', 'false') == 'false' }.each do |order_option|
      opt = [order_option['Name'], order_option['Guid']]
      order_option_select_values << opt
    end

    order_option_select_values.sort
  end

  def get_order_options
    # todo
  end
end
