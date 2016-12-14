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
      options = { 'catalog_item[]' => id }
      assignments_response = cmr_client.get_order_option_assignments(options, echo_provider_token)
      if assignments_response.success?
        option_defs = Array.wrap(get_order_option_defs(assignments_response.body))

      if option_defs.length > 0
        option_defs.each do |option_def|
          collection_copy = collection.clone
          collection_copy['option-def'] = option_def
          assignment = find_assignment(option_def['Guid'], assignments_response.body)[0]

          unless assignment.nil?
            collection_copy['option-assignment-guid'] = assignment['catalog_item_option_assignment']['catalog_item_id']
          end

          @collections_to_list << collection_copy
        end
      else
        @collections_to_list << collection
      end

      else
        Rails.logger.error(assignments_response.body)
        flash.now[:error] = assignments_response.body.inspect
      end

      empty_assignment_cnt = 0
      @collections_to_list.each do |collection|
        if collection['option-def'].nil?
          empty_assignment_cnt += 1
        end
      end

      @all_empty_assignments = false

      if empty_assignment_cnt == @collections_to_list.length
        @all_empty_assignments = true
      end

    end
  end

  def show
    # stub
  end


  def create
    @order_option = params.fetch('order-options', '')
    @collections = find_collections_by_concept_ids(params['collectionsChooser_toList'])

    errors = []
    @collections.each do |collection|
      id = collection['meta']['concept-id']
      response = cmr_client.add_order_option_assignments(id, @order_option, echo_provider_token)

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
      @order_option = params.fetch('order-options', '')
      @collections = find_collections_by_concept_ids(params['collectionsChooser_toList'])
      @order_option_select_values = get_order_options
      @chosen_collections = build_collections_array(@collections)
      render new_order_option_assignment_path
    end

  end

  def new

    @order_option_select_values = get_order_options


  end

  private


  def build_collections_array(collections)
    items = []
    collections.each do |collection|
      items << [
          collection['meta']['concept-id'],
          collection['umm']['short-name'] + " | " + collection['umm']['entry-title']
      ]
    end
    items
  end

  def find_assignment(guid, body)
    body.each do |item|
      if item['catalog_item_option_assignment']['option_definition_id'] == guid
        return item
      end
    end
  end

  def get_order_option_defs(option_infos)

    return [] if(option_infos.length < 1)

    guids = []

    option_infos.each do |option_info|
      guids <<  option_info['catalog_item_option_assignment']['option_definition_id']
    end

    order_option_response = echo_client.get_order_options(echo_provider_token, guids)

    if order_option_response.success?
      # Retreive the order options
      order_option_list = order_option_response.parsed_body.fetch('Item', {})
    else
      Rails.logger.error(order_option_response.body)
      flash[:error] = order_option_response.body.inspect
    end

    order_option_list
  end


  def get_order_options
    order_option_response = echo_client.get_order_options(echo_provider_token)
    if order_option_response.success?
      # Retreive the order options
      order_option_list = order_option_response.parsed_body.fetch('Item', {})
    else
      Rails.logger.error(order_option_response.body)
      flash[:error] = order_option_response.body.inspect
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
    query = { 'page_size' => 2000, 'concept_id' => concept_ids }
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
