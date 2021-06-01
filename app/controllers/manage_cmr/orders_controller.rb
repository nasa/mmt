# :nodoc:
class OrdersController < ManageCmrController
  include LogTimeSpentHelper
  add_breadcrumb 'Track Orders', :orders_path

  def index
    logger.tagged("#{current_user.urs_uid} #{controller_name}_controller") do
      Rails.logger.info "User #{current_user.urs_uid} is starting a Track Orders search"

      render :index
    end
  end

  def show
    logger.tagged("#{current_user.urs_uid} #{controller_name}_controller") do
      init_time_tracking_variables
      echo_client.timeout = time_left
      @order = Echo::Order.new(client: echo_client, echo_provider_token: echo_provider_token, guid: params['id'])
      add_breadcrumb @order.guid, order_path(@order.guid)
      render :show
    end
  rescue Faraday::TimeoutError
    flash.now[:alert] = "The order request #{request.uuid} timed out retrieving results.  Limit your search criteria and try again or contact #{view_context.mail_to('support@earthdata.nasa.gov', 'Earthdata Support')}."
    render :index
  end

  def search
    logger.tagged("#{current_user.urs_uid} #{controller_name}_controller") do
      Rails.logger.info("starting request - #{request.uuid} timeout=#{echo_client.timeout}")
      init_time_tracking_variables
      guids = determine_order_guids
      log_time_spent "search #{guids.class == Array ? guids.count : 1} orders" do
        log_time_spent 'time to retrieve details infos' do
          echo_client.timeout = time_left
          orders_obj = Echo::Orders.new(client: echo_client, echo_provider_token: echo_provider_token, guids: guids)

          if orders_obj.errors
            if orders_obj.errors.match(/Could not find order with guid/)
              err_message = { alert: "#{orders_obj.errors}  Please refer to the ID: #{request.uuid} when contacting #{view_context.mail_to('support@earthdata.nasa.gov', 'Earthdata Support')}" }
            else
              err_message = { error: "#{orders_obj.errors}  Please refer to the ID: #{request.uuid} when contacting #{view_context.mail_to('support@earthdata.nasa.gov', 'Earthdata Support')}" }
            end
            redirect_to orders_path, flash: err_message
            return
          end

          @orders = orders_obj.orders
        end

        log_time_spent 'time to precache owner guids' do
          precache_owner_guids
        end

        # if user_id param is supplied and we're not searching by guid, filter orders by given user_id
        if params['order_guid'].blank? && params['user_id'].present?
          @orders.select! { |order| order.owner == params['user_id'] }
        end

        render :search
      end
    end
  rescue Faraday::TimeoutError
    flash.now[:alert] = "The order request #{request.uuid} timed out retrieving results.  Limit your search criteria and try again or contact #{view_context.mail_to('support@earthdata.nasa.gov', 'Earthdata Support')}."
    render :index
  end

  private

  # this speeds things up dramatically by collecting all the owner guids and performing 1 query to grab ALL the
  # user info details, it will then cache them and this cache is used further down in the processing.
  def precache_owner_guids
    log_time_spent "time to retreive guids" do
      owner_guids = []
      @orders.each do |order|
        next if order.owner_guid.nil?
        owner_guids << order.owner_guid
      end
      return if owner_guids.count.zero?
      owner_guids = owner_guids.uniq
      Rails.logger.info("Precaching #{owner_guids.count} owner guids")
      echo_client.timeout = time_left
      result = echo_client.get_user_names(echo_provider_token, owner_guids)

      Rails.logger.error("Retrieve User Names Error: #{result.clean_inspect}") if result.error?

      Array.wrap(result.parsed_body['Item']).each do |item|
        owner_guid = item['Guid']
        user = { 'Item' => item }
        Rails.cache.write("owners.#{owner_guid}", user, expires_in: Rails.configuration.orders_user_cache_expiration)
      end
    end
  end

  def determine_order_guids
    # Order Guid takes precedence over filters, if an order_guid is present
    # search for that rather than using the filters
    log_time_spent 'determine_order_guids' do
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

        log_time_spent "User #{current_user.urs_uid} is starting a Track Orders search by filters #{payload.inspect} with a get_provider_order_guids_by_state_date_and_provider" do
          # Request orders from ECHO
          echo_client.timeout = time_left
          order_search_result = echo_client.get_provider_order_guids_by_state_date_and_provider(echo_provider_token, payload)

          Rails.logger.error("Retrieve Provider Order GUIDs Error: #{order_search_result.clean_inspect}") if order_search_result.error?

          # Pull out just the Guids for the returned orders
          order_results_guids = Array.wrap(order_search_result.parsed_body.fetch('Item', [])).map {|guid| guid['OrderGuid']}
          Rails.logger.info "Initial order_search_result has #{order_results_guids.size} orders"
          order_results_guids
        end
      end
    end
  end


end
