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

    @collections = get_collections_by_entry_titles(entry_titles)

    @collections.each do |collection|
      id = collection['meta']['concept-id']
      response = cmr_client.get_order_option_assignments(id, echo_provider_token)

      if response.success?
        collection['option-assignments'] = response.body
      else
        Rails.logger.error("Order Option Assignment Retrieval Error: #{response.body}")
        flash.now[:error] = response.body.inspect
      end
    end

  end


  def create
    entry_titles = params['collection-checkbox']
    order_option = params['order-options']

    collections = get_collections_by_entry_titles(entry_titles)

    collections.each do |collection|
      id = collection['meta']['concept-id']
      response = cmr_client.add_order_option_assignments(id, order_option, echo_provider_token)

      if response.success?
        flash[:success] = 'Order Option assignment successful.'
      else
        Rails.logger.error("Order Option Assignment Error: #{response.body}")
        flash[:error] = response.body.inspect
      end
    end

    redirect_to order_option_assignments_url
  end

  def new
    entry_titles = params['order-option-checkbox']

    @collections = get_collections_by_entry_titles(entry_titles)

    order_option_response = echo_client.get_order_options(echo_provider_token)

    if order_option_response.success?
      # Retreive the order options and sort by name, ignoring case
      @order_option_list = order_option_response.parsed_body.fetch('Item', {}).sort_by { |option| option['Name'].downcase }
    end

    @order_option_select_values = []

    @order_option_list.each do |order_option|
      opt = [ order_option['Name'], order_option['Guid']]
      @order_option_select_values << opt
    end
  end

  private

  def get_collections_by_entry_titles(entry_titles)
    # page_size default is 10, max is 2000
    query = { 'page_size' => 100, 'entry_title' => entry_titles }
    collections_response = cmr_client.get_collections(query, token).body

    hits = collections_response['hits'].to_i
    errors = collections_response.fetch('errors', [])
    collections = collections_response.fetch('items', [])
  end

end
