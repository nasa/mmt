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
      # Create admin user (token ABC-1)
      resp = connection.post do |req|
        req.url('http://localhost:3008/tokens')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Accept'] = 'application/json'
        req.body = '{"token": {"username":"admin", "password":"admin", "client_id":"dev test", "user_ip_address":"127.0.0.1","group_guids":["guidMMTAdmin"]}}'
      end
      puts "Created admin admin: #{resp.body}"
      # Create admin user (token ABC-2)
      resp = connection.post do |req|
        req.url('http://localhost:3008/tokens')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Accept'] = 'application/json'
        req.body = '{"token": {"username":"typical", "password":"user", "client_id":"dev test", "user_ip_address":"127.0.0.1","group_guids":["guidMMTUser"]}}'
      end
      puts "Created typical user: #{resp.body}"

      clear_cache

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

      clear_cache

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

      clear_cache

      ## ACLs for System level groups
      ## these ACLs are need groups in the groups api (3011) for sids lookup to work properly for the tokens created at the beginning of this setup
      # admin user
      resp = connection.post do |req|
        req.url('http://localhost:3008/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"acl": {"access_control_entries": [{"permissions": ["READ","CREATE"],"sid": {"group_sid": {"group_guid": "guidMMTAdmin"}}}],"system_object_identity": {"target": "GROUP"}}}'
      end
      puts "Created ACL admin user: #{resp.body}"
      # mock-echo-system-token
      resp = connection.post do |req|
        req.url('http://localhost:3008/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"acl": {"access_control_entries": [{"permissions": ["READ","CREATE"],"sid": {"group_sid": {"group_guid": "mock-admin-group-guid"}}}],"system_object_identity": {"target": "GROUP"}}}'
      end
      puts "Created ACL mock-echo-system-token: #{resp.body}"

      clear_cache

      # there is now a default group with name 'Administrators' in CMR
      # Create system level group
      resp = connection.post do |req|
        req.url('http://localhost:3011/groups')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"name": "Administrators_2", "description": "The group of users that manages the CMR."}'
      end
      puts "Created system level group: #{resp.body}"
      # Create SEDAC group
      resp = connection.post do |req|
        req.url('http://localhost:3011/groups')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"name": "SEDAC Test Group", "description": "Test group for provider", "provider_id": "SEDAC"}'
      end
      puts "Created SEDAC group: #{resp.body}"

      clear_cache

      ### These calls were all added because of various issues with permissions with groups
      ### and ACLs. I would like to keep these in as reference until all the issues are resolved

      ## Add groups in new groups API so it can provide the SIDS
      # Admin, token ABC-1
      resp = connection.post do |req|
        req.url('http://localhost:3011/groups')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"name": "MMT Admins", "description": "MMT admin group", "legacy_guid": "guidMMTAdmin", "members": ["admin"]}'
      end
      puts "add group for admin for sids: #{resp.body}"
      # Typical, token ABC-2
      resp = connection.post do |req|
        req.url('http://localhost:3011/groups')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"name": "MMT Users", "description": "MMT users group", "legacy_guid": "guidMMTUser", "members": ["typical"]}'
      end
      puts "add group for typical user for sids: #{resp.body}"

      ## Add admin user to legacy guid Administrators group so admin can access System level groups
      # first add admin user to cmr urs
      # connection.post do |req|
      #   req.url('http://localhost:3008/urs/users')
      #   req.headers['Content-Type'] = 'application/json'
      #   req.body = '[{"username": "admin", "password": "admin"}]'
      # end
      # Add admin to default CMR Administrators Group
      # resp = connection.post do |req|
      #   req.url('http://localhost:3011/groups/AG1200000000-CMR/members')
      #   req.headers['Content-Type'] = 'application/json'
      #   req.headers['Echo-token'] = 'mock-echo-system-token'
      #   req.body = '["admin"]'
      # end
      # puts "add admin user to CMR Administrators: #{resp.body}"
      # # Add admin to SEDAC group
      # puts "added admin to Administrators group: #{resp.body}"
      # resp = connection.post do |req|
      #   req.url('http://localhost:3011/groups/AG1200000002-SEDAC/members')
      #   req.headers['Content-Type'] = 'application/json'
      #   req.headers['Echo-token'] = 'mock-echo-system-token'
      #   req.body = '["admin"]'
      # end
      # puts "added admin to SEDAC group: #{resp.body}"

      clear_cache

      # ACLs for provider groups
      # Admin access to SEDAC
      resp = connection.post do |req| # this is not working properly
        req.url('http://localhost:3008/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"acl": {"access_control_entries": [{"permissions": ["READ","CREATE"],"sid": {"group_sid": {"group_guid": "guidMMTAdmin"}}}],"provider_object_identity": {"provider_guid": "provguid1","target": "GROUP"}}}'
      end
      puts "admin access SEDAC 3008: #{resp.body}"
      # resp = connection.post do |req| # this also was not working
      #   req.url('http://localhost:3008/acls')
      #   req.headers['Content-Type'] = 'application/json'
      #   req.headers['Echo-token'] = 'mock-echo-system-token'
      #   req.body = '{"acl": {"access_control_entries": [{"permissions": ["READ"],"sid": {"group_sid": {"group_guid": "guidMMTAdmin"}}}],"provider_object_identity": {"provider_guid": "provguid1","target": "GROUP"}}}'
      # end
      # puts "admin read access SEDAC 3008: #{resp.body}"
      # resp = connection.post do |req| # this works but gives EVERYONE access
      #   req.url('http://localhost:3008/acls')
      #   req.headers['Content-Type'] = 'application/json'
      #   req.headers['Echo-token'] = 'mock-echo-system-token'
      #   req.body = '{"acl": {"access_control_entries": [{"permissions": ["READ"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "REGISTERED"}}}],"provider_object_identity": {"provider_guid": "provguid1","target": "GROUP"}}}'
      # end
      # puts "registered users read access SEDAC 3008: #{resp.body}"

      # MMT_1
      connection.post do |req|
        req.url('http://localhost:3008/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"acl": {"access_control_entries": [{"permissions": ["READ","CREATE"],"sid": {"group_sid": {"group_guid": "guidMMTUser"}}}],"provider_object_identity": {"provider_guid": "provguid3","target": "GROUP"}}}'
      end
      # MMT_2
      connection.post do |req|
        req.url('http://localhost:3008/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"acl": {"access_control_entries": [{"permissions": ["READ","CREATE"],"sid": {"group_sid": {"group_guid": "guidMMTUser"}}}],"provider_object_identity": {"provider_guid": "provguid4","target": "GROUP"}}}'
      end

      clear_cache

      ## ACLs for permissions for ACLs
      ## temporary fix: we are using the legacy_guid used in the groups we created for the sids
      ## it should have been the concept_id of the group but that was not working. what we use will change in the near future
      # ACL for read and create access for ACLs for admin user, read access for registered users
      resp = connection.post do |req|
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"group_id": "guidMMTAdmin", "permissions": ["read", "create"]}, {"user_type":"registered", "permissions":["read"]}], "system_identity": {"target": "ANY_ACL"}}'
      end
      puts "ACL access for admin user and registered users: #{resp.body}"
      # ACL for typical user to create catalog item ACLs for MMT_1
      resp = connection.post do |req|
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"group_id": "guidMMTUser", "permissions": ["read", "create", "update", "delete"]}], "provider_identity": {"target": "CATALOG_ITEM_ACL", "provider_id": "MMT_1"}}'
      end
      puts "ACL for typical user to read and create catalog item ACLs for MMT_1 #{resp.body}"
      # ACL for typical user to create catalog item ACLs for MMT_2
      resp = connection.post do |req|
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"group_id": "guidMMTUser", "permissions": ["read", "create", "update", "delete"]}], "provider_identity": {"target": "CATALOG_ITEM_ACL", "provider_id": "MMT_2"}}'
      end
      puts "ACL for typical user to read and create catalog item ACLs for MMT_2 #{resp.body}"

      clear_cache
    end

    def clear_cache
      connection.post do |req|
        req.url('http://localhost:2999/clear-cache')
      end
      sleep 1
      connection.post do |req|
        req.url('http://localhost:3011/caches/clear-cache?token=mock-echo-system-token')
      end
      sleep 1
    end

    def retrieve_metadata_uris
      data = JSON.parse(File.read(File.join(Rails.root, 'lib', 'test_cmr', 'test_data.json')), symbolize_names: true)
    end

    def insert_metadata(uri_list)
      added = 0
      uri_list.each_with_index do |obj, index|
        collection_uri = obj[:collection]
        metadata = connection.get(collection_uri).body
        obj[:ingest_count].times do
          if !(collection_uri.include? 'EDF_DEV06')
            response = connection.put do |req|
              if collection_uri.include? 'SEDAC'
                req.url("http://localhost:3002/providers/SEDAC/collections/collection#{index}")
              else #collection_uri.include? 'LARC'
                req.url("http://localhost:3002/providers/LARC/collections/collection#{index}")
              end
              content_type = 'application/echo10+xml'
              content_type = 'application/dif10+xml' if obj[:type] == 'dif'
              req.headers['Content-Type'] = content_type
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
          else
            # collection with not url friendly native id
            encoded_bad_native_id = URI.encode('AMSR-E/Aqua & 5-Day, L3 Global Snow Water Equivalent EASE-Grids V001')
            response = connection.put do |req|
              req.url("http://localhost:3002/providers/LARC/collections/#{encoded_bad_native_id}")
              req.headers['Content-Type'] = 'application/echo10+xml'
              req.headers['Echo-token'] = 'mock-echo-system-token'
              req.body = metadata
            end
            puts response.success? ? 'added collection with a not url friendly native id' : response.inspect
          end
        end
      end
      puts 'Done!'
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
      connection.post do |req|
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"group_id": "guidMMTUser", "permissions": ["read", "create", "update", "delete"]}], "provider_identity": {"target": "CATALOG_ITEM_ACL", "provider_id": "' + provider_id + '"}}'
      end

      clear_cache
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
