# pull list of metadata locations from remote CMR
#
# setup local CMR
#
# for each collection
#   retrieve metadata
#   insert metadata into local CMR

require 'multi_xml'

module Cmr
  class Local
    def initialize
    end

    def load_data
      wait_for_cmr do
        setup_cmr
      end
      insert_metadata(retrieve_metadata_uris)
    end

    def load_system_groups
      wait_for_cmr do
        setup_cmr
      end
      insert_system_groups(retrieve_system_groups)
    end

    def wait_for_cmr
      cmr_up = false
      until cmr_up
        begin
          cmr_up = yield
        rescue Faraday::Error::ConnectionFailed
          puts 'CMR is still starting, please wait...'
          sleep 5
        end
      end
    end

    def setup_cmr
      ### Creating a Provider in CMR
      # Provider SEDAC
      connection.post do |req|
        req.url('http://localhost:3002/providers')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"provider-id": "SEDAC", "short-name": "SEDAC", "cmr-only": true}'
      end
      # Provider LARC
      connection.post do |req|
        req.url('http://localhost:3002/providers')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"provider-id": "LARC", "short-name": "LARC", "cmr-only": true}'
      end
      # Provider MMT_1
      connection.post do |req|
        req.url('http://localhost:3002/providers')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"provider-id": "MMT_1", "short-name": "MMT_1", "cmr-only": true}'
      end
      # Provider MMT_2
      connection.post do |req|
        req.url('http://localhost:3002/providers')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"provider-id": "MMT_2", "short-name": "MMT_2", "cmr-only": true}'
      end

      ### Create a provider in Mock Echo
      # Provider SEDAC
      connection.post do |req|
        req.url('http://localhost:3008/providers')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '[{"provider":{"id":"provguid1","provider_id":"SEDAC"}}]'
      end
      # Provider LARC
      connection.post do |req|
        req.url('http://localhost:3008/providers')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '[{"provider":{"id":"provguid2","provider_id":"LARC"}}]'
      end
      # Provider MMT_1
      connection.post do |req|
        req.url('http://localhost:3008/providers')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '[{"provider":{"id":"provguid3","provider_id":"MMT_1"}}]'
      end
      # Provider MMT_2
      connection.post do |req|
        req.url('http://localhost:3008/providers')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '[{"provider":{"id":"provguid4","provider_id":"MMT_2"}}]'
      end

      ### Adding ACLs
      # Provider SEDAC
      connection.post do |req|
        req.url('http://localhost:3008/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"acl": {"access_control_entries": [{"permissions": ["READ"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "GUEST"}}},{"permissions": ["READ"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "REGISTERED"}}}],"catalog_item_identity": {"collection_applicable": true,"granule_applicable": true,"provider_guid": "provguid1"}}}'
      end
      connection.post do |req|
        req.url('http://localhost:3008/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"acl": {"access_control_entries": [{"permissions": ["UPDATE","DELETE"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "GUEST"}}},{"permissions": ["UPDATE","DELETE"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "REGISTERED"}}}],"provider_object_identity": {"provider_guid": "provguid1","target": "INGEST_MANAGEMENT_ACL"}}}'
      end
      # Provider LARC
      connection.post do |req|
        req.url('http://localhost:3008/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"acl": {"access_control_entries": [{"permissions": ["READ"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "GUEST"}}},{"permissions": ["READ"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "REGISTERED"}}}],"catalog_item_identity": {"collection_applicable": true,"granule_applicable": true,"provider_guid": "provguid2"}}}'
      end
      connection.post do |req|
        req.url('http://localhost:3008/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"acl": {"access_control_entries": [{"permissions": ["UPDATE","DELETE"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "GUEST"}}},{"permissions": ["UPDATE","DELETE"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "REGISTERED"}}}],"provider_object_identity": {"provider_guid": "provguid2","target": "INGEST_MANAGEMENT_ACL"}}}'
      end
      # Provider MMT_1
      connection.post do |req|
        req.url('http://localhost:3008/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"acl": {"access_control_entries": [{"permissions": ["READ"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "GUEST"}}},{"permissions": ["READ"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "REGISTERED"}}}],"catalog_item_identity": {"collection_applicable": true,"granule_applicable": true,"provider_guid": "provguid3"}}}'
      end
      connection.post do |req|
        req.url('http://localhost:3008/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"acl": {"access_control_entries": [{"permissions": ["UPDATE","DELETE"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "GUEST"}}},{"permissions": ["UPDATE","DELETE"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "REGISTERED"}}}],"provider_object_identity": {"provider_guid": "provguid3","target": "INGEST_MANAGEMENT_ACL"}}}'
      end
      # Provider MMT_2
      connection.post do |req|
        req.url('http://localhost:3008/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"acl": {"access_control_entries": [{"permissions": ["READ"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "GUEST"}}},{"permissions": ["READ"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "REGISTERED"}}}],"catalog_item_identity": {"collection_applicable": true,"granule_applicable": true,"provider_guid": "provguid4"}}}'
      end
      connection.post do |req|
        req.url('http://localhost:3008/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"acl": {"access_control_entries": [{"permissions": ["UPDATE","DELETE"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "GUEST"}}},{"permissions": ["UPDATE","DELETE"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "REGISTERED"}}}],"provider_object_identity": {"provider_guid": "provguid4","target": "INGEST_MANAGEMENT_ACL"}}}'
      end

      ## ACLs for Groups
      # System level groups
      connection.post do |req|
        req.url('http://localhost:3008/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token-admin' # mock token for admin for system level users
        req.body = '{"acl": {"access_control_entries": [{"permissions": ["READ","CREATE"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "REGISTERED"}}}],"system_object_identity": {"target": "GROUP"}}}'
      end
      # MMT_1
      connection.post do |req|
        req.url('http://localhost:3008/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"acl": {"access_control_entries": [{"permissions": ["READ","CREATE"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "REGISTERED"}}}],"provider_object_identity": {"provider_guid": "provguid3","target": "GROUP"}}}'
      end
      # MMT_2
      connection.post do |req|
        req.url('http://localhost:3008/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"acl": {"access_control_entries": [{"permissions": ["READ","CREATE"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "REGISTERED"}}}],"provider_object_identity": {"provider_guid": "provguid4","target": "GROUP"}}}'
      end

      ### Clear Cache
      connection.post do |req|
        req.url('http://localhost:2999/clear-cache')
      end
    end

    def retrieve_metadata_uris
      data = JSON.parse(File.read(File.join(Rails.root, 'lib', 'test_cmr', 'test_data.json')), symbolize_names: true)
    end

    def insert_metadata(uri_list)
      added = 0
      uri_list.each_with_index do |obj, index|
        collection_uri = obj[:collection]
        metadata = connection.get(collection_uri).body
        obj[:ingest_count].times do |count|
          response = connection.put do |req|
            if collection_uri.include? 'SEDAC'
              req.url("http://localhost:3002/providers/SEDAC/collections/collection#{index}")
            elsif collection_uri.include? 'LARC'
              req.url("http://localhost:3002/providers/LARC/collections/collection#{index}")
            end
            req.headers['Content-Type'] = 'application/echo10+xml'
            req.headers['Echo-token'] = 'mock-echo-system-token'
            req.body = metadata
          end

          # Ingest a granules if available
          if obj[:granule]
            granule_metadata = connection.get(obj[:granule].first).body
            response = connection.put do |req|
              req.url("http://localhost:3002/providers/LARC/granules/granule-#{index}")
              req.headers['Content-Type'] = 'application/echo10+xml'
              req.headers['Echo-token'] = 'mock-echo-system-token'
              req.body = granule_metadata
            end
          end

          if response.success?
            added += 1
            puts "Loaded #{added} collections"
          else
            puts response.inspect
          end
        end
      end
      puts 'Done!'
    end

    def retrieve_system_groups
      data = JSON.parse(File.read(File.join(Rails.root, 'lib', 'test_cmr', 'test_system_groups.json')), symbolize_names: true)
    end

    def insert_system_groups(group_list)
      added = 0
      group_list.each_with_index do |group, index|
        response = connection.post do |req|
          req.url("http://localhost:3011/groups")
          req.headers['Content-Type'] = 'application/json'
          # using admin mock token for system level groups
          req.headers['Echo-token'] = 'mock-echo-system-token-admin'
          req.body = group.to_json
        end
        # TODO if I use the admin mock token, local cmr rejects with error message
        # "Token mock-echo-system-token-admin does not exist"
        # if use the non-admin mock token, the groups will be loaded into local cmr
        # BUT, does not seem to match admin mock token used in setup_cmr for system groups

        if response.success?
          added += 1
          puts "Loaded #{added} system groups"
        else
          puts response.inspect
        end
      end

      puts 'Done adding system groups'
    end

    def reset_data
      wait_for_cmr do
        connection.post do |req|
          req.url('http://localhost:2999/reset')
        end
      end
    end

    def reset_provider(provider_id)
      # Delete provider
      response = connection.delete do |req|
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.url("http://localhost:3002/providers/#{provider_id}")
      end

      guid = "prov-guid-#{Time.now.to_i}"

      # Create provider
      connection.post do |req|
        req.url('http://localhost:3002/providers')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"provider-id": "' + provider_id + '", "short-name": "' + provider_id + '", "cmr-only": true}'
      end
      connection.post do |req|
        req.url('http://localhost:3008/providers')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '[{"provider":{"id":"' + guid + '","provider_id":"' + provider_id + '"}}]'
      end
      connection.post do |req|
        req.url('http://localhost:3008/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"acl": {"access_control_entries": [{"permissions": ["READ"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "GUEST"}}},{"permissions": ["READ"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "REGISTERED"}}}],"catalog_item_identity": {"collection_applicable": true,"granule_applicable": true,"provider_guid": "' + guid + '"}}}'
      end
      connection.post do |req|
        req.url('http://localhost:3008/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"acl": {"access_control_entries": [{"permissions": ["UPDATE","DELETE"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "GUEST"}}},{"permissions": ["UPDATE","DELETE"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "REGISTERED"}}}],"provider_object_identity": {"provider_guid": "' + guid + '","target": "INGEST_MANAGEMENT_ACL"}}}'
      end
      connection.post do |req|
        req.url('http://localhost:3008/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"acl": {"access_control_entries": [{"permissions": ["READ","CREATE"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "REGISTERED"}}}],"provider_object_identity": {"provider_guid": "' + guid + '","target": "GROUP"}}}'
      end

      ### Clear Cache
      connection.post do |req|
        req.url('http://localhost:2999/clear-cache')
      end
    end

    def connection
      @connection ||= Faraday.new do |faraday|
        faraday.request :url_encoded # form-encode POST params
        # faraday.response :logger  # log requests to STDOUT
        faraday.adapter Faraday.default_adapter # make requests with Net::HTTP
      end
    end
  end
end
