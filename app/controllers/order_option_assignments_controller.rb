class OrderOptionAssignmentsController < ApplicationController

  before_action :ensure_correct_permission


  def ensure_correct_permission

    # We are detecting this error because ECHO may not allow the current
    # user to act on behalf of their current provider. This will display
    # that message to the user on the index page, something like
    # "User [john] may not act on behalf of provider [MMT_1]"
    if echo_provider_token.class == Hash && echo_provider_token['faultstring']
      flash.now[:error] = echo_provider_token['faultstring']
      render :index
    end
  end


  def index
    # stub
  end

  def edit

    collections = find_collections_by_concept_ids(params['collectionsChooser_toList'])
    @collections_to_list = []

    collections.each do |collection|
      id = collection['meta']['concept-id']
      assignments_response = cmr_client.get_order_option_assignments(id, echo_provider_token)

      if assignments_response.success?
        option_defs = Array.wrap(get_order_option_defs(assignments_response.body))

      if option_defs.length > 0
        option_defs.each do |option_def|
          collection_copy = collection.clone

          # Sometimes this is returned as a 2-element Array
          if option_def.class.to_s == 'Array'
            option_def = {
                'Name' => option_def[0],
                'Guid' => option_def[1]
            }
          end

          collection_copy['option-def'] = option_def

          assignment = find_assignment(option_def['Guid'], assignments_response.body)[0]

          if ! assignment.nil?
            collection_copy['option-assignment-guid'] = assignment['catalog_item_option_assignment']['catalog_item_id']
            # TODO: The ECHO client is not returning the filter XPath.
            collection_copy['option-assignment-filter-xpath'] = assignment['catalog_item_option_assignment'].fetch('filter_xpath','')
          end

          @collections_to_list << collection_copy
        end
      else
        @collections_to_list << collection
      end

      else
        Rails.logger.error("Order Option Assignment Retrieval Error: #{assignments_response.body}")
        flash.now[:error] = assignments_response.body.inspect
      end
    end
  end

  def show
    # stub
  end


  def create
    concept_ids = params.fetch('collection-checkbox', [])
    order_option = params.fetch('order-options', '')
    filter_xpath = params.fetch('filter-xpath', nil)

    collections = find_collections_by_concept_ids(concept_ids)

    errors = []
    collections.each do |collection|
      id = collection['meta']['concept-id']
      response = cmr_client.add_order_option_assignments(id, order_option, filter_xpath, echo_provider_token)

      if response.error?
        errors << response.body.inspect
        Rails.logger.error("Order Option Assignment Error: #{response.body}")
        flash[:error] = response.body.inspect
      end
    end

    if errors.empty?
      flash[:success] = 'Order Option assignment successful.'
      redirect_to order_option_assignments_url
    else
      flash[:error] = errors.uniq.join ', '
      @collections = find_collections_by_concept_ids(concept_ids)
      @order_option_select_values = get_order_options
      render new_order_option_assignment_path
    end

  end

  def new

    concept_ids = params.fetch('order-option-checkbox', []).uniq

    if concept_ids.length < 1
      flash[:error] = "At least one collection must be selected"
      redirect_to order_option_assignments_path
      return
    end

    @collections = find_collections_by_concept_ids(concept_ids)
    @order_option_select_values = get_order_options

    @collections.each do |collection|
      id = collection['meta']['concept-id']
      response = cmr_client.get_order_option_assignments(id, echo_provider_token)

      if response.success?
        # Add an element to the collection
        collection['option-assignments'] = get_order_option_defs(response.body)
      else
        Rails.logger.error("Order Option Assignment Retrieval Error: #{response.body}")
        flash.now[:error] = response.body.inspect
      end
    end
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

    guids = []

    if(option_infos.length < 1)
      return []
    end

    option_infos.each do |option_info|
      guids <<  option_info['catalog_item_option_assignment']['option_definition_id']
    end

    order_option_response = echo_client.get_order_options(echo_provider_token, guids)

    if order_option_response.success?
      # Retreive the order options
      order_option_list = order_option_response.parsed_body.fetch('Item', {})
    end
    order_option_list
  end


  def get_order_options
    order_option_response = echo_client.get_order_options(echo_provider_token)
    if order_option_response.success?
      # Retreive the order options
      order_option_list = order_option_response.parsed_body.fetch('Item', {})
    end
    order_option_select_values = []

    order_option_list.each do |order_option|
      opt = [ order_option['Name'], order_option['Guid']]
      order_option_select_values << opt
    end

    order_option_select_values
  end


  def find_collections_by_concept_ids(concept_ids)
    # page_size default is 10, max is 2000
    query = { 'page_size' => 2000, 'entry_title' => concept_ids }
    collections_response = cmr_client.get_collections(query, token).body

    hits = collections_response['hits'].to_i
    errors = collections_response.fetch('errors', [])
    collections = collections_response.fetch('items', [])

    matched_collections = []
    collections.each do |collection|
      concept_ids.each do |concept_id|
        if collection['meta']['concept-id'] == concept_id
          matched_collections << collection
        end
      end
    end
    matched_collections
  end

end
