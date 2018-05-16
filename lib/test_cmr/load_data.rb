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

    def save_data
      uri_list = JSON.parse(File.read(File.join(Rails.root, 'lib', 'test_cmr', 'test_data.json')), symbolize_names: true)

      uri_list.each_with_index do |obj, index|
        collection_uri = obj[:collection]
        metadata = connection.get(collection_uri).body

        granule = if obj[:granule]
                    connection.get(obj[:granule]).body
                  else
                    nil
                  end

        data = {}
        data['collection_uri'] = obj[:collection]
        data['ingest_count'] = obj[:ingest_count]
        data['type'] = obj.fetch(:type, 'echo10')
        data['test_case'] = obj.fetch(:test_case, nil)
        data['granule'] = granule
        data['metadata'] = metadata

        File.open(File.join(Rails.root, 'lib', 'test_cmr', 'data', "collection_#{(index + 1).to_s.rjust(2, '0')}.yml"), 'w+') do |f|
          begin
            f.write(data.to_yaml)
          rescue
            next
          end
        end
      end
    end

    def load_data
      wait_for_cmr do
        setup_cmr
      end
      insert_metadata

      additional_cmr_setup
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
      # TODO do these tokens need to change when we change to Launchpad login? Do we need to ask CMR about it?
      # Create user 'admin' that has token ABC-1
      resp = connection.post do |req|
        req.url('http://localhost:3008/tokens')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Accept'] = 'application/json'
        req.body = '{"token": {"username":"admin", "password":"admin", "client_id":"dev test", "user_ip_address":"127.0.0.1","group_guids":["guidMMTAdmin"]}}'
      end
      puts "Created admin admin: #{resp.body}"
      # Create user 'typical' that has token ABC-2
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
      # Provider NSIDC_ECS
      connection.post do |req|
        req.url('http://localhost:3002/providers')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"provider-id": "NSIDC_ECS", "short-name": "NSIDC_ECS", "cmr-only": true}'
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
      # Provider NSIDC_ECS
      connection.post do |req|
        req.url('http://localhost:3008/providers')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '[{"provider":{"id":"provguid5","provider_id":"NSIDC_ECS"}}]'
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
        req.body = '{"acl": {"access_control_entries": [{"permissions": ["UPDATE","READ"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "GUEST"}}},{"permissions": ["UPDATE","READ"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "REGISTERED"}}}],"provider_object_identity": {"provider_guid": "provguid1","target": "INGEST_MANAGEMENT_ACL"}}}'
      end
      # Provider LARC
      # ACL to give all guest and all registered users READ access on LARC collections, through a collection permission (catalog item acl) in mock echo
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
        req.body = '{"acl": {"access_control_entries": [{"permissions": ["UPDATE","READ"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "GUEST"}}},{"permissions": ["UPDATE","READ"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "REGISTERED"}}}],"provider_object_identity": {"provider_guid": "provguid2","target": "INGEST_MANAGEMENT_ACL"}}}'
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
        req.body = '{"acl": {"access_control_entries": [{"permissions": ["UPDATE","READ"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "GUEST"}}},{"permissions": ["UPDATE","READ"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "REGISTERED"}}}],"provider_object_identity": {"provider_guid": "provguid3","target": "INGEST_MANAGEMENT_ACL"}}}'
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
        req.body = '{"acl": {"access_control_entries": [{"permissions": ["UPDATE","READ"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "GUEST"}}},{"permissions": ["UPDATE","READ"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "REGISTERED"}}}],"provider_object_identity": {"provider_guid": "provguid4","target": "INGEST_MANAGEMENT_ACL"}}}'
      end
      # Provider NSIDC_ECS
      # ACL to give admin user read on NSIDC_ECS collections
      resp = connection.post do |req|
        req.url('http://localhost:3008/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"acl": {"access_control_entries": [{"permissions": ["READ"],"sid": {"group_sid": {"group_guid": "guidMMTAdmin"}}}],"catalog_item_identity": {"collection_applicable": true,"granule_applicable": true,"provider_guid": "provguid5"}}}'
      end
      puts "ACL for admin user to read collections for NSIDC_ECS, via mock echo #{resp.inspect}"

      clear_cache

      ## ACLs for System level groups
      ## these ACLs need groups in the access control groups api (3011) for sids lookup to work properly for the tokens created at the beginning of this setup
      # these ACLs create permisisons for system level groups on the mock echo side, currently which are the only ones that are honored
      # currently ACLs for system level groups created on the cmr/new access control side (3011) do not propogate to the mock echo side and so are not honored by the system
      # admin user
      resp = connection.post do |req|
        req.url('http://localhost:3008/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"acl": {"access_control_entries": [{"permissions": ["READ","CREATE"],"sid": {"group_sid": {"group_guid": "guidMMTAdmin"}}}],"system_object_identity": {"target": "GROUP"}}}'
      end
      puts "ACL for system group access for admin user in mock echo: #{resp.body}"
      # mock-echo-system-token
      resp = connection.post do |req|
        req.url('http://localhost:3008/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"acl": {"access_control_entries": [{"permissions": ["READ","CREATE"],"sid": {"group_sid": {"group_guid": "mock-admin-group-guid"}}}],"system_object_identity": {"target": "GROUP"}}}'
      end
      puts "ACL for system group access for mock-echo-system-token in mock echo: #{resp.body}"

      clear_cache

      # there is now a default group with name 'Administrators' in CMR
      # Create system level group
      resp = connection.post do |req|
        req.url('http://localhost:3011/groups')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"name": "Administrators_2", "description": "The group of users that manages the CMR."}'
      end
      puts "Created system level group in access control: #{resp.body}"
      # Create SEDAC group
      resp = connection.post do |req|
        req.url('http://localhost:3011/groups')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"name": "SEDAC Test Group", "description": "Test group for provider", "provider_id": "SEDAC"}'
      end
      puts "Created SEDAC group in access control: #{resp.body}"

      clear_cache

      ### These calls were all added because of various issues with permissions with groups
      ### and ACLs. I would like to keep these in as reference until all the issues are resolved

      ## Add administrative and regular users to the locally mocked URS, so they can be added to groups for ACLs and permissions
      ## and given appropriate permissions for groups, permissions, etc.
      # Users 'admin' and 'typical' are created first above with tokens ABC-1 and ABC-2
      # Users 'adminuser' and 'testuser' are the urs_uids used in our tests
      connection.post do |req|
        req.url('http://localhost:3008/urs/users')
        req.headers['Content-Type'] = 'application/json'
        req.body = '[{"username": "admin", "password": "admin"}, {"username": "typical", "password":"password"}, {"username": "adminuser", "password": "admin"}, {"username": "testuser", "password":"password"}]'
      end
      # add admin and adminuser to our Administrators_2 group (usu AG1200000001-CMR)
      resp = connection.post do |req|
        req.url('http://localhost:3011/groups/AG1200000001-CMR/members')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '["admin", "adminuser"]'
      end
      puts "add admin and adminuser to Administrators_2: #{resp.body}"
      # create ACL for system level groups for Administrators_2
      resp = connection.post do |req|
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"group_id": "AG1200000001-CMR","permissions": ["read", "create"]}], "system_identity": {"target": "GROUP"}}'
      end
      puts "acl for system level groups for Administrators_2 in access control #{resp.body}"

      clear_cache

      ## Add groups into access control so it can provide the SIDS
      # Administrative Users, that use token ABC-1
      resp = connection.post do |req|
        req.url('http://localhost:3011/groups')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"name": "MMT Admins", "description": "MMT admin group", "legacy_guid": "guidMMTAdmin", "members": ["admin", "adminuser"]}'
      end
      puts "add group for admin for sids: #{resp.body}"
      # Regular Users, that use token ABC-2
      resp = connection.post do |req|
        req.url('http://localhost:3011/groups')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"name": "MMT Users", "description": "MMT users group", "legacy_guid": "guidMMTUser", "members": ["typical", "testuser"]}'
      end
      puts "add group for typical user for sids: #{resp.body}"

      clear_cache

      ### ACLs for provider groups
      # Admin access to SEDAC
      resp = connection.post do |req| # this is not working properly
        req.url('http://localhost:3008/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"acl": {"access_control_entries": [{"permissions": ["READ","CREATE"],"sid": {"group_sid": {"group_guid": "guidMMTAdmin"}}}],"provider_object_identity": {"provider_guid": "provguid1","target": "GROUP"}}}'
      end
      puts "ACL for admin access to SEDAC provider groups in mock echo: #{resp.body}"

      # ACL for typical user for MMT_1 groups
      connection.post do |req|
        req.url('http://localhost:3008/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"acl": {"access_control_entries": [{"permissions": ["READ","CREATE"],"sid": {"group_sid": {"group_guid": "guidMMTUser"}}}],"provider_object_identity": {"provider_guid": "provguid3","target": "GROUP"}}}'
      end
      # ACL for typical user for MMT_2 groups
      connection.post do |req|
        req.url('http://localhost:3008/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"acl": {"access_control_entries": [{"permissions": ["READ","CREATE"],"sid": {"group_sid": {"group_guid": "guidMMTUser"}}}],"provider_object_identity": {"provider_guid": "provguid4","target": "GROUP"}}}'
      end
      # ACL for typical user for NSIDC_ECS groups
      connection.post do |req|
        req.url('http://localhost:3008/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"acl": {"access_control_entries": [{"permissions": ["READ","CREATE"],"sid": {"group_sid": {"group_guid": "guidMMTUser"}}}],"provider_object_identity": {"provider_guid": "provguid5","target": "GROUP"}}}'
      end

      clear_cache

      ## ACLs for permissions for ACLs
      ## temporary fix: we are using the legacy_guid used in the groups we created for the sids
      ## it should have been the concept_id of the group but that was not working. what we use will change in the near future

      # ACL for read and create access for ACLs for admin user, read access for registered users
      # resp = connection.post do |req|
      #   req.url('http://localhost:3011/acls')
      #   req.headers['Content-Type'] = 'application/json'
      #   req.headers['Echo-token'] = 'mock-echo-system-token'
      #   req.body = '{"group_permissions": [{"group_id": "guidMMTAdmin", "permissions": ["read", "create", "update", "delete"]}, {"user_type":"registered", "permissions":["read"]}], "system_identity": {"target": "ANY_ACL"}}'
      # end
      # puts "ANY_ACL read and create access for admin user (guidMMTAdmin) and registered users: #{resp.body}"
      # NOTE TEMP ACL for CRUD for ACLs for Administrators_2, read access for registered users
      resp = connection.post do |req|
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"group_id": "AG1200000001-CMR", "permissions": ["read", "create", "update", "delete"]}, {"user_type":"registered", "permissions":["read"]}], "system_identity": {"target": "ANY_ACL"}}'
      end
      puts "ANY_ACL CRUD access for Administrators_2 and read for registered users: #{resp.body}"

      # ACL for regular users to manage Provider Identity ACLs for MMT_1
      resp = connection.post do |req|
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"group_id": "guidMMTUser", "permissions": ["read", "create", "update", "delete"]}], "provider_identity": {"target": "PROVIDER_OBJECT_ACL", "provider_id": "MMT_1"}}'
      end
      puts "ACL for CRUD permissions for typical user on Provider Identity ACLs for MMT_1 #{resp.body}"

      # ACL for regular users to manage Provider Identity ACLs for MMT_2
      resp = connection.post do |req|
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"group_id": "guidMMTUser", "permissions": ["read", "create", "update", "delete"]}], "provider_identity": {"target": "PROVIDER_OBJECT_ACL", "provider_id": "MMT_2"}}'
      end
      puts "ACL for CRUD permissions for typical user on Provider Identity ACLs for MMT_2 #{resp.body}"

      # ACL for admin and regular users to manage Provider Identity ACLs for NSIDC_ECS
      resp = connection.post do |req|
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"group_id": "guidMMTUser", "permissions": ["read", "create", "update", "delete"]}, {"group_id": "guidMMTAdmin", "permissions": ["read", "create", "update", "delete"]}], "provider_identity": {"target": "PROVIDER_OBJECT_ACL", "provider_id": "NSIDC_ECS"}}'
      end
      puts "ACL for CRUD permissions for typical user on Provider Identity ACLs for NSIDC_ECS #{resp.body}"

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

      # ACL for typical user to have provider context for MMT_2
      resp = connection.post do |req|
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"group_id": "guidMMTUser", "permissions": ["read"]}, {"group_id": "guidMMTAdmin", "permissions": ["read"]}], "provider_identity": {"target": "PROVIDER_CONTEXT", "provider_id": "MMT_2"}}'
      end
      puts "ACL for typical user to read PROVIDER_CONTEXT for MMT_2 #{resp.body}"

      ## this is temporary and for Permissions tests
      # ACL for typical user to create groups (access control groups) for LARC
      resp = connection.post do |req|
        req.url('http://localhost:3008/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"acl": {"access_control_entries": [{"permissions": ["READ","CREATE"],"sid": {"group_sid": {"group_guid": "guidMMTUser"}}}],"provider_object_identity": {"provider_guid": "provguid2","target": "GROUP"}}}'
      end
      puts "ACL for typical user to read and create groups for LARC #{resp.body}"

      # ACL for typical user to create catalog item ACLs for LARC
      resp = connection.post do |req|
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"group_id": "guidMMTUser", "permissions": ["read", "create", "update", "delete"]}], "provider_identity": {"target": "CATALOG_ITEM_ACL", "provider_id": "LARC"}}'
      end
      puts "ACL for typical user to read and create catalog item ACLs for LARC #{resp.body}"

      # ACL in access control for admin and typical user to create catalog item ACLs for NSIDC_ECS
      resp = connection.post do |req|
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"group_id": "guidMMTUser", "permissions": ["read", "create", "update", "delete"]}, {"group_id": "guidMMTAdmin", "permissions": ["read", "create", "update", "delete"]}], "provider_identity": {"target": "CATALOG_ITEM_ACL", "provider_id": "NSIDC_ECS"}}'
      end
      puts "ACL for admin and typical user to read and create catalog item ACLs for NSIDC_ECS, via access control #{resp.body}"

      clear_cache
    end

    def additional_cmr_setup
      # we are running these later in the sequence because one of the ACLs is for a single entry title, which is best to create after the collection has been ingested
      wait_for_indexing

      reindex_permitted_groups

      wait_for_indexing

      clear_cache

      # ACL (collection permission, aka catalog item acl) for NSIDC_ECS for access to a single entry title for all guest and all registered users, via access control
      resp = connection.post do |req|
        req.url('http://localhost:3008/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"acl": {"access_control_entries": [{"permissions": ["READ"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "REGISTERED"}}}, {"permissions": ["READ"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "GUEST"}}}],"catalog_item_identity": {"collection_applicable": true,"granule_applicable": true,"provider_guid": "provguid5", "collection_identifier": { "collection_ids": [ { "data_set_id": "Near-Real-Time SSMIS EASE-Grid Daily Global Ice Concentration and Snow Extent V004" } ] }}}}'
      end
      puts "Collection Permission for single entry title for NSIDC_ECS, via access control #{resp.inspect}"

      wait_for_indexing

      reindex_permitted_groups

      wait_for_indexing

      clear_cache
    end

    def clear_cache
      connection.post('http://localhost:2999/clear-cache')

      connection.post('http://localhost:3011/caches/clear-cache?token=mock-echo-system-token')
    end

    def reindex_permitted_groups
      # This method reindexes groups, which may be required when ACLs are added or changed in mock echo
      resp = connection.post do |req|
        req.url('http://localhost:3002/jobs/reindex-collection-permitted-groups')
        req.headers['Echo-token'] = 'mock-echo-system-token'
      end
      puts "Reindexing permitted groups: #{resp.inspect}"
    end

    def wait_for_indexing
      # The following two methods are used in our tests, and also were often used
      # together by older apps that interacted with CMR
      # Wait for the CMR queue to be empty
      resp = connection.post do |req|
        req.url('http://localhost:2999/message-queue/wait-for-terminal-states')
        req.headers['Echo-token'] = 'mock-echo-system-token'
      end
      puts "Waiting for CMR queue to empty: #{resp.inspect}"

      # Refresh the ElasticSearch index
      resp = connection.post do |req|
        req.url('http://localhost:9210/_refresh')
        req.headers['Echo-token'] = 'mock-echo-system-token'
      end
      puts "Refreshing the ElasticSearch index: #{resp.inspect}"
    end

    def insert_metadata
      added = 0
      Dir.glob(File.join(Rails.root, 'lib', 'test_cmr', 'data', '*.yml')).sort.each_with_index do |filename, index|
        data = Psych.load_file(filename)

        data['ingest_count'].times do
          response = connection.put do |req|
            if data['collection_uri'].include? 'EDF_DEV06'
              # collection with not url friendly native id
              encoded_bad_native_id = URI.encode('AMSR-E/Aqua & 5-Day, L3 Global Snow Water Equivalent EASE-Grids V001')
              req.url("http://localhost:3002/providers/LARC/collections/#{encoded_bad_native_id}")
            elsif data['collection_uri'].include? 'NSIDC_ECS'
              req.url("http://localhost:3002/providers/NSIDC_ECS/collections/collection#{index}")
            elsif data['collection_uri'].include? 'SEDAC'
              req.url("http://localhost:3002/providers/SEDAC/collections/collection#{index}")
            else # data['collection_uri'].include? 'LARC'
              req.url("http://localhost:3002/providers/LARC/collections/collection#{index}")
            end

            content_type = 'application/echo10+xml'
            content_type = 'application/dif10+xml' if data['type'] == 'dif10'
            req.headers['Content-Type'] = content_type
            req.headers['Echo-token'] = 'mock-echo-system-token'
            req.body = data['metadata']

            # Ingest a granules if available
            if data['granule']
              response = connection.put do |granule_req|
                granule_req.url("http://localhost:3002/providers/LARC/granules/granule-#{index}")
                granule_req.headers['Content-Type'] = 'application/echo10+xml'
                granule_req.headers['Echo-token'] = 'mock-echo-system-token'
                granule_req.body = data['granule']
              end
            end
          end

          if response.success?
            added += 1
            puts "Loaded #{added} collections#{data['test_case']}"
          else
            puts response.inspect
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
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'load_data.rb reset_provider' do
        # Delete the given provider
        # When a provider is deleted all of the data associated with that provider is
        # also deleted. CMR then needs to re-index, which is asyncronous
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
          req.body = '{"acl": {"access_control_entries": [{"permissions": ["UPDATE","READ"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "GUEST"}}},{"permissions": ["UPDATE","READ"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "REGISTERED"}}}],"provider_object_identity": {"provider_guid": "' + guid + '","target": "INGEST_MANAGEMENT_ACL"}}}'
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
          req.body = '{"group_permissions": [{"group_id": "guidMMTUser", "permissions": ["read"]}, {"group_id": "guidMMTAdmin", "permissions": ["read"]}], "provider_identity": {"target": "PROVIDER_CONTEXT", "provider_id": "' + provider_id + '"}}'
        end
        connection.post do |req|
          req.url('http://localhost:3011/acls')
          req.headers['Content-Type'] = 'application/json'
          req.headers['Echo-token'] = 'mock-echo-system-token'
          req.body = '{"group_permissions": [{"group_id": "guidMMTUser", "permissions": ["read", "create", "update", "delete"]}], "provider_identity": {"target": "PROVIDER_OBJECT_ACL", "provider_id": "' + provider_id + '"}}'
        end
        connection.post do |req|
          req.url('http://localhost:3011/acls')
          req.headers['Content-Type'] = 'application/json'
          req.headers['Echo-token'] = 'mock-echo-system-token'
          req.body = '{"group_permissions": [{"group_id": "guidMMTUser", "permissions": ["read", "create", "update", "delete"]}], "provider_identity": {"target": "CATALOG_ITEM_ACL", "provider_id": "' + provider_id + '"}}'
        end

        clear_cache
      end
    end

    def connection
      @connection ||= Faraday.new do |faraday|
        faraday.use :instrumentation

        faraday.request :url_encoded # form-encode POST params
        # faraday.response :logger  # log requests to STDOUT
        faraday.adapter Faraday.default_adapter # make requests with Net::HTTP
      end
    end
  end
end
