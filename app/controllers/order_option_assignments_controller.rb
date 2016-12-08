class OrderOptionAssignmentsController < ApplicationController

  def index

    @collection_selections = []

    if echo_provider_token.class == Hash
      if echo_provider_token['faultstring']
        flash.now[:error] = echo_provider_token['faultstring']
      end
    end

  end

  def show

    entry_titles = []

    params[:collection_selections].split('%%__%%').each do |entry_title|
      entry_titles << entry_title.split('|')[1].strip
    end

    collections = get_collections_by_entry_titles(entry_titles)

    @collections_to_list = []

    collections.each do |collection|
      id = collection['meta']['concept-id']
      response = cmr_client.get_order_option_assignments(id, echo_provider_token)

      if response.success?
        # Add an element to the collection
        #collection['option-assignments'] = get_order_option_names(response.body)
        option_names = get_order_option_names(response.body)

        if option_names.length > 0
          option_names.each do |option_name|
            collection_copy = collection.clone
            collection_copy['option-name'] = option_name
            @collections_to_list << collection_copy
          end
        else
          @collections_to_list << collection
        end


      else
        Rails.logger.error("Order Option Assignment Retrieval Error: #{response.body}")
        flash.now[:error] = response.body.inspect
      end
    end

  end


  def create
    entry_titles = params.fetch('collection-checkbox', [])
    order_option = params.fetch('order-options', '')
    filter_xpath = params.fetch('filter-xpath', nil)

    collections = get_collections_by_entry_titles(entry_titles)

    errors = []
    collections.each do |collection|
      id = collection['meta']['concept-id']
      response = cmr_client.add_order_option_assignments(id, order_option, filter_xpath, echo_provider_token)

      if !response.success?
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
      @collections = get_collections_by_entry_titles(entry_titles)
      @order_option_select_values = get_order_options
      render new_order_option_assignment_path
    end

  end

  def new
    entry_titles = params.fetch('order-option-checkbox', []).uniq

    if entry_titles.length < 1
      flash[:error] = "At least one collection must be selected"
      redirect_to order_option_assignments_path
      return
    end

    @collections = get_collections_by_entry_titles(entry_titles)
    @order_option_select_values = get_order_options

    @collections.each do |collection|
      id = collection['meta']['concept-id']
      response = cmr_client.get_order_option_assignments(id, echo_provider_token)

      if response.success?
        # Add an element to the collection
        collection['option-assignments'] = get_order_option_names(response.body)
      else
        Rails.logger.error("Order Option Assignment Retrieval Error: #{response.body}")
        flash.now[:error] = response.body.inspect
      end
    end
  end

  private

  def get_order_option_names(option_defs)

    if(option_defs.length < 1)
      return []
    end

    names = []
    guids = []

    option_defs.each do |option_def|
      guids <<  option_def['catalog_item_option_assignment']['option_definition_id']
    end

    order_option_response = echo_client.get_order_options(echo_provider_token, guids)

    if order_option_response.success?
      # Retreive the order options
      order_option_list = order_option_response.parsed_body.fetch('Item', {})
    end

    order_option_list.each do |order_option|
      if order_option.class.to_s == "Hash"
        names << order_option['Name']
      end
    end
    names
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


  def get_collections_by_entry_titles(entry_titles)
    # page_size default is 10, max is 2000
    query = { 'page_size' => 100, 'entry_title' => entry_titles }
    collections_response = cmr_client.get_collections(query, token).body

    hits = collections_response['hits'].to_i
    errors = collections_response.fetch('errors', [])
    collections = collections_response.fetch('items', [])
  end
  
end
