module Echo
  class Orders
    attr_reader :orders

    def initialize(client: nil, echo_provider_token: nil, guids: nil)
      response = client.get_orders(echo_provider_token, guids)

      if response.success?
        @orders = Array.wrap(response.parsed_body.fetch('Item', [])).map { |order| Order.new(client: client, echo_provider_token: echo_provider_token, response: order) }
      else
        @orders = []
        Rails.logger.error "Error searching for orders: #{response.error_message}"
      end
    end
  end
end
