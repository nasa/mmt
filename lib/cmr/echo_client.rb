module Cmr
  class EchoClient < BaseClient
    def get_calendar_events
      get('/echo-rest/calendar_events.json', severity: 'ALERT')
    end

    def get_echo_provider_holdings(provider_id)
      get("/echo-rest/providers/#{provider_id}.json")
    end

    def get_current_user(token)
      get('/echo-rest/users/current.json', {}, token_header(token, true))
    end

    def get_groups(user_id)
      get("/echo-rest/groups.json?member_id=#{user_id}", {}, system_token_header)
    end

    def get_provider_acls
      get('/echo-rest/acls.json?object_identity_type=PROVIDER_OBJECT&reference=false', {}, system_token_header)
    end

    def get_all_providers
      get('/echo-rest/providers.json')
    end

    def create_order_option(order_option, token)
      url = '/echo-rest/option_definitions'
      content_type = { 'Content-Type' => 'application/json' }
      body = { 'option_definition' => order_option }
      echo_security_token = { 'Echo-Token' => token }
      post(url, body.to_json, content_type.merge(echo_security_token))
    end

    def get_order_option(id, token)
      url = "/echo-rest/option_definitions/#{id}"
      get(url, {}, { 'Echo-Token' => token })
    end

    def delete_order_option(id, token)
      url = "/echo-rest/option_definitions/#{id}"
      delete(url, nil, nil, { 'Echo-Token' => token })
    end

    def get_order_option_assignments(options, token)
      url = '/echo-rest/catalog_item_option_assignments.json'
      get(url, options, { 'Echo-Token' => token })
    end

    def add_order_option_assignments(id, order_option, token)
      url = "/echo-rest/catalog_item_option_assignments"
      content_type = { 'Content-Type' => 'application/json' }
      body = {
          'catalog_item_option_assignment' => {
              'catalog_item_id' => id,
              'option_definition_id' => order_option
          }
      }
      echo_security_token = { 'Echo-Token' => token }
      post(url, body.to_json, content_type.merge(echo_security_token))
    end

    def delete_order_option_assignments(option_assignment_guid, token)
      url = "/echo-rest/catalog_item_option_assignments/#{option_assignment_guid}"
      delete(url, nil, nil, { 'Echo-Token' => token })
    end
  end
end
