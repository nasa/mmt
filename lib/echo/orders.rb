module Echo
  class Orders
    attr_reader :orders

    def initialize(client: nil, echo_provider_token: nil, guids: nil)
      @orders = []

      Rails.logger.info 'No guids passed in to Orders#initialize so skipping subsequent get_orders searches' and return if guids.blank?

      Rails.logger.info "Starting get_orders request in Orders#initialize sent at Time #{Time.now.to_i} with guids: #{guids.inspect}"
      response = client.get_orders(echo_provider_token, guids)
      Rails.logger.info "Response from get_orders request in Orders#initialize received at Time #{Time.now.to_i}"

      if response.success?
        Rails.logger.info 'Searching for Orders Success!'
        @orders = Array.wrap(response.parsed_body.fetch('Item', [])).map { |order| Order.new(client: client, echo_provider_token: echo_provider_token, response: order) }
      else
        Rails.logger.error "Searching for Orders Error: #{response.error_message}"
      end
    end
  end
end
