# :nodoc:
class OrdersController < ManageCmrController
  include ApplicationHelper
  add_breadcrumb 'Track Orders', :orders_path

  def index
    logger.tagged("#{current_user.urs_uid} #{controller_name}_controller") do
      Rails.logger.info "User #{current_user.urs_uid} is starting a Track Orders search"

      render :index
    end
  end

  def show
    logger.tagged("#{current_user.urs_uid} #{controller_name}_controller") do
      @order = Echo::Order.new(client: echo_client, echo_provider_token: echo_provider_token, guid: params['id'])
      add_breadcrumb @order.guid, order_path(@order.guid)
      render :show
    end
  end

  def search
    Rails.logger.info("starting request - #{request.uuid} timeout=#{echo_client.timeout}")
    init_time_tracking_variables
    guids = determine_order_guids

    time "search #{guids.class == Array ? guids.count : 1} orders" do
      logger.tagged("#{current_user.urs_uid} #{controller_name}_controller") do
        time 'time to retrieve details infos' do
          echo_client.timeout = time_left
          @orders = Echo::Orders.new(client: echo_client, echo_provider_token: echo_provider_token, guids: guids).orders
        end

        time 'time to precache owner guids' do
          precache_owner_guids
        end

        # if user_id param is supplied and we're not searching by guid, filter orders by given user_id
        if params['order_guid'].blank? && params['user_id'].present?
          @orders.select! {|order| order.owner == params['user_id']}
        end

        @orders.sort_by!(&:created_date)
        render :search
      end

    end
  rescue Faraday::Error::TimeoutError
    flash.now[:alert] = 'The order request timed out retrieving results.  Limit your search criteria and try again.'
    render :index
  end

  private

  # sets up initial values to track time spent issuing faraday requests.
  # initial budget of time allowed to complete request is 270 seconds (300-30 see below)
  # echo_client.timeout as of 5/16/19 is 300 seconds, subtracting 30 seconds for any potential processing,
  # the rest of the remaining time will be used for faraday requests.
  def init_time_tracking_variables
    @timeout_duration = echo_client.timeout - 30
    @request_start = Time.new
  end


  # returns the time remaining for the request to complete, used as a timeout value for faraday connections.
  def time_left
    return @timeout_duration - (Time.new - @request_start)
  end

  # this speeds things up dramatically by collecting all the owner guids and performing 1 query to grab ALL the
  # user info details, it will then cache them and this cache is used further down in the processing.
  def precache_owner_guids
    time "time to retreive guids" do
      owner_guids = []
      @orders.each do |order|
        next if order.owner_guid.nil?
        owner_guids << order.owner_guid
      end
      return if owner_guids.count.zero?
      owner_guids = owner_guids.uniq
      Rails.logger.info("Precaching #{owner_guids.count} owner guids")
      echo_client.timeout = time_left
      result = echo_client.get_user_names(echo_provider_token, owner_guids).parsed_body

      Array.wrap(result['Item']).each do |item|
        owner_guid = item['Guid']
        Rails.cache.write("owners.#{owner_guid}", item, expires_in: Rails.configuration.orders_user_cache_expiration)
      end
    end
  end

  def determine_order_guids
    # Order Guid takes precedence over filters, if an order_guid is present
    # search for that rather than using the filters
    time 'determine_order_guids' do
      if params['order_guid'].present?
        Rails.logger.info "User #{current_user.urs_uid} is starting a Track Orders search by order_guid #{params['order_guid']}"
        params['order_guid']
      else
        # Search for orders based on the provided filters
        payload = {
          'states' => (params['states'] || OrdersHelper::ORDER_STATES),
          'date_type' => params['date_type'],
          'from_date' => params['from_date'],
          'to_date' => params['to_date']
        }

        time "User #{current_user.urs_uid} is starting a Track Orders search by filters #{payload.inspect} with a get_provider_order_guids_by_state_date_and_provider" do
          # Request orders from ECHO
          echo_client.timeout = time_left
          order_search_result = echo_client.get_provider_order_guids_by_state_date_and_provider(echo_provider_token, payload)

          # Pull out just the Guids for the returned orders
          order_results_guids = Array.wrap(order_search_result.parsed_body.fetch('Item', [])).map {|guid| guid['OrderGuid']}
          Rails.logger.info "Initial order_search_result has #{order_results_guids.size} orders"
          order_results_guids
        end
      end
    end
  end


end
