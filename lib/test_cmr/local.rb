# pull list of metadata locations from remote CMR
#
# setup local CMR
#
# for each collection
#   retrieve metadata
#   insert metadata into local CMR

require 'multi_xml'
require 'timeout'
require 'erb'
include ERB::Util

module TestCmr
  class Local
    attr_accessor :nsidc_test_case_collection

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
      Timeout::timeout(Rails.configuration.cmr_startup_timeout.to_i) do
        until cmr_up
          begin
            cmr_up = yield
          rescue Faraday::ConnectionFailed
            puts 'CMR is still starting, please wait...'
            sleep 5
          end
        end
      end
    rescue Timeout::Error => e
      puts('Got timeout waiting for CMR, existing task!')
      exit(1)
    end

    def provider_template(provider_id)
      {
        "MetadataSpecification": {
          "Name":"Provider",
          "Version": "1.0.0",
          "URL": "https://cdn.earthdata.nasa.gov/schemas/provider/v1.0.0"},
        "ProviderId": provider_id,
        "DescriptionOfHolding": "PROV1 Testing.",
        "Organizations": [
          {"ShortName": provider_id,
           "Roles": ["PUBLISHER"],
           "URLValue": "https://quidditch.example.gov/"
          }],
        "Administrators": ["chris.gokey"],
        "Consortiums": ["EOSDIS"]
      }.to_json
    end

    def setup_cmr
      ###
      ### Create Users (and their tokens) in Mock Echo
      ###

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

      ###
      ### Create Providers
      ###

      ## Create Providers in CMR
      # Provider SEDAC
      connection.post do |req|
        req.url('http://localhost:3002/providers')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = provider_template('SEDAC')
      end
      # Provider LARC
      connection.post do |req|
        req.url('http://localhost:3002/providers')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = provider_template('LARC')
      end
      # Provider MMT_1
      connection.post do |req|
        req.url('http://localhost:3002/providers')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = provider_template('MMT_1')
      end
      # Provider MMT_2
      connection.post do |req|
        req.url('http://localhost:3002/providers')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = provider_template('MMT_2')
      end
      # Provider NSIDC_ECS
      connection.post do |req|
        req.url('http://localhost:3002/providers')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = provider_template('NSIDC_ECS')
      end

      # ## Create providers in Mock Echo
      # # Provider SEDAC
      # connection.post do |req|
      #   req.url('http://localhost:3008/providers')
      #   req.headers['Content-Type'] = 'application/json'
      #   req.headers['Authorization'] = 'mock-echo-system-token'
      #   req.body = '[{"provider":{"id":"provguid1","provider_id":"SEDAC"}}]'
      # end
      # # Provider LARC
      # connection.post do |req|
      #   req.url('http://localhost:3008/providers')
      #   req.headers['Content-Type'] = 'application/json'
      #   req.headers['Authorization'] = 'mock-echo-system-token'
      #   req.body = '[{"provider":{"id":"provguid2","provider_id":"LARC"}}]'
      # end
      # # Provider MMT_1
      # connection.post do |req|
      #   req.url('http://localhost:3008/providers')
      #   req.headers['Content-Type'] = 'application/json'
      #   req.headers['Authorization'] = 'mock-echo-system-token'
      #   req.body = '[{"provider":{"id":"provguid3","provider_id":"MMT_1"}}]'
      # end
      # # Provider MMT_2
      # connection.post do |req|
      #   req.url('http://localhost:3008/providers')
      #   req.headers['Content-Type'] = 'application/json'
      #   req.headers['Authorization'] = 'mock-echo-system-token'
      #   req.body = '[{"provider":{"id":"provguid4","provider_id":"MMT_2"}}]'
      # end
      # # Provider NSIDC_ECS
      # connection.post do |req|
      #   req.url('http://localhost:3008/providers')
      #   req.headers['Content-Type'] = 'application/json'
      #   req.headers['Authorization'] = 'mock-echo-system-token'
      #   req.body = '[{"provider":{"id":"provguid5","provider_id":"NSIDC_ECS"}}]'
      # end

      clear_cache

      ###
      ### Create System and Provider Groups
      ###

      # Create system level group
      # By default CMR creates a system group 'Administrators' but we should create our own
      resp = connection.post do |req|
        req.url('http://localhost:3011/groups')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '{"name": "Administrators_2", "description": "The group of users that manages the CMR."}'
      end
      admin_group_concept = JSON.parse(resp.body)['concept_id']
      puts "Created system level group Administrators_2 in access control: #{resp.body}, with concept_id #{admin_group_concept}"
      # Create SEDAC group
      resp = connection.post do |req|
        req.url('http://localhost:3011/groups')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '{"name": "SEDAC Admin Group", "description": "Test group for provider", "provider_id": "SEDAC"}'
      end
      sedac_group_concept = JSON.parse(resp.body)['concept_id']
      puts "Created SEDAC group in access control: #{resp.body}, with concept_id #{sedac_group_concept}"
      # Create LARC group
      resp = connection.post do |req|
        req.url('http://localhost:3011/groups')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '{"name": "LARC Admin Group", "description": "Test group for provider", "provider_id": "LARC"}'
      end
      larc_group_concept = JSON.parse(resp.body)['concept_id']
      puts "Created LARC group in access control: #{resp.body}, with concept_id #{larc_group_concept}"
      # Create MMT_1 group
      resp = connection.post do |req|
        req.url('http://localhost:3011/groups')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '{"name": "MMT_1 Admin Group", "description": "Test group for provider", "provider_id": "MMT_1"}'
      end
      mmt_1_group_concept = JSON.parse(resp.body)['concept_id']
      puts "Created MMT_1 group in access control: #{resp.body}, with concept_id #{mmt_1_group_concept}"
      # Create MMT_2 group
      resp = connection.post do |req|
        req.url('http://localhost:3011/groups')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '{"name": "MMT_2 Admin Group", "description": "Test group for provider", "provider_id": "MMT_2"}'
      end
      mmt_2_group_concept = JSON.parse(resp.body)['concept_id']
      puts "Created MMT_2 group in access control: #{resp.body}, with concept_id #{mmt_2_group_concept}"
      # Create NSIDC_ECS group
      resp = connection.post do |req|
        req.url('http://localhost:3011/groups')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '{"name": "NSIDC_ECS Admin Group", "description": "Test group for provider", "provider_id": "NSIDC_ECS"}'
      end
      nsidc_group_concept = JSON.parse(resp.body)['concept_id']
      puts "Created NSIDC_ECS group in access control: #{resp.body}, with concept_id #{nsidc_group_concept}"

      clear_cache

      ###
      ### Add collection permissions, aka CATALOG_ITEM_ACLs, and INGEST_MANAGEMENT_ACLs for providers
      ###

      # Provider SEDAC
      resp = connection.post do |req|
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"permissions": ["read"], "user_type": "guest"}, {"permissions": ["read"], "user_type": "registered"}], "catalog_item_identity": {"name": "SEDAC All Collections and Granules", "provider_id": "SEDAC", "collection_applicable": true, "granule_applicable": true}}'
      end
      puts "Catalog Item ACL for guest and registered users for SEDAC #{resp.body}"
      resp = connection.post do |req|
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"user_type": "guest", "permissions": ["read", "update"]}, {"user_type": "registered", "permissions": ["read", "update"]}], "provider_identity": {"target": "INGEST_MANAGEMENT_ACL", "provider_id": "SEDAC"}}'
      end
      puts "ACL for INGEST_MANAGEMENT_ACL for guest and registered users for SEDAC #{resp.body}"
      # Provider LARC
      resp = connection.post do |req|
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"permissions": ["read"], "user_type": "guest"}, {"permissions": ["read"], "user_type": "registered"}], "catalog_item_identity": {"name": "LARC All Collections and Granules", "provider_id": "LARC", "collection_applicable": true, "granule_applicable": true}}'
      end
      puts "Catalog Item ACL for guest and registered users for LARC #{resp.body}"
      resp = connection.post do |req|
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"user_type": "guest", "permissions": ["read", "update"]}, {"user_type": "registered", "permissions": ["read", "update"]}], "provider_identity": {"target": "INGEST_MANAGEMENT_ACL", "provider_id": "LARC"}}'
      end
      puts "ACL for INGEST_MANAGEMENT_ACL for guest and registered users for LARC #{resp.body}"
      # Provider MMT_1
      resp = connection.post do |req|
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"permissions": ["read"], "user_type": "guest"}, {"permissions": ["read"], "user_type": "registered"}], "catalog_item_identity": {"name": "MMT_1 All Collections and Granules", "provider_id": "MMT_1", "collection_applicable": true, "granule_applicable": true}}'
      end
      puts "Catalog Item ACL for guest and registered users for MMT_1 #{resp.body}"
      resp = connection.post do |req|
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"user_type": "guest", "permissions": ["read", "update"]}, {"user_type": "registered", "permissions": ["read", "update"]}], "provider_identity": {"target": "INGEST_MANAGEMENT_ACL", "provider_id": "MMT_1"}}'
      end
      puts "ACL for INGEST_MANAGEMENT_ACL for guest and registered users for MMT_1 #{resp.body}"
      # Provider MMT_2
      resp = connection.post do |req|
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"permissions": ["read"], "user_type": "guest"}, {"permissions": ["read"], "user_type": "registered"}], "catalog_item_identity": {"name": "MMT_2 All Collections and Granules", "provider_id": "MMT_2", "collection_applicable": true, "granule_applicable": true}}'
      end
      puts "Catalog Item ACL for guest and registered users for MMT_2 #{resp.body}"
      resp = connection.post do |req|
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"user_type": "guest", "permissions": ["read", "update"]}, {"user_type": "registered", "permissions": ["read", "update"]}], "provider_identity": {"target": "INGEST_MANAGEMENT_ACL", "provider_id": "MMT_2"}}'
      end
      puts "ACL for INGEST_MANAGEMENT_ACL for guest and registered users for MMT_2 #{resp.body}"

      clear_cache

      ###
      ### Add users to groups
      ###

      # for the local CMR, we need to add the users to the locally mocked URS
      # (in mock echo) before adding them into groups
      #
      ## Add administrative and regular users to the locally mocked URS, so they
      ## can be added to groups for ACLs and permissions and given appropriate
      ## permissions for groups, permissions, etc.
      #
      # Users 'admin' and 'typical' are created first above with tokens ABC-1 and ABC-2
      # Users 'adminuser' and 'testuser' are the urs_uids used in our tests
      connection.post do |req|
        req.url('http://localhost:3008/urs/users')
        req.headers['Content-Type'] = 'application/json'
        req.body = '[{"username": "admin", "password": "admin"}, {"username": "typical", "password": "password"}, {"username": "adminuser", "password": "admin"}, {"username": "testuser", "password": "password"}]'
      end

      # add admin users to Administrators_2 group
      resp = connection.post do |req|
        req.url("http://localhost:3011/groups/#{admin_group_concept}/members")
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '["admin", "adminuser"]'
      end
      puts "add admin and adminuser to Administrators_2: #{resp.body}"
      # add admin users to SEDAC group
      resp = connection.post do |req|
        req.url("http://localhost:3011/groups/#{sedac_group_concept}/members")
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '["admin", "adminuser"]'
      end
      puts "add admin and adminuser to SEDAC group: #{resp.body}"
      # add typical users to LARC group
      resp = connection.post do |req|
        req.url("http://localhost:3011/groups/#{larc_group_concept}/members")
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '["typical", "testuser"]'
      end
      puts "add typical and testuser to LARC group: #{resp.body}"
      # add typical users to MMT_1 group
      resp = connection.post do |req|
        req.url("http://localhost:3011/groups/#{mmt_1_group_concept}/members")
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '["typical", "testuser"]'
      end
      puts "add typical and testuser to MMT_1 group: #{resp.body}"
      # add typical users to MMT_2 group
      resp = connection.post do |req|
        req.url("http://localhost:3011/groups/#{mmt_2_group_concept}/members")
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '["typical", "testuser"]'
      end
      puts "add typical and testuser to MMT_2 group: #{resp.body}"
      # add typical users to NSIDC_ECS group
      resp = connection.post do |req|
        req.url("http://localhost:3011/groups/#{nsidc_group_concept}/members")
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '["typical", "testuser"]'
      end
      puts "add typical and testuser to NSIDC_ECS group: #{resp.body}"

      clear_cache

      ###
      ### Create ACLs
      ###

      # ACL for CRUD for ACLs for Administrators_2, read access for registered users
      # read access means they can query/see any ACL and get a response
      # this means all registered users don't need to add read rights for
      # PROVIDER_OBJECT_ACL for a user to see if they have that PROVIDER_CONTEXT
      # also any user in Administrators_2 has full access to any ACL in the system
      resp = connection.post do |req|
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"group_id": "' + admin_group_concept + '", "permissions": ["read", "create", "update", "delete"]}, {"user_type":"registered", "permissions":["read"]}], "system_identity": {"target": "ANY_ACL"}}'
      end
      puts "ANY_ACL CRUD access for Administrators_2 and read for registered users: #{resp.body}"

      # ACL for admin and typical user to have provider context for MMT_2
      resp = connection.post do |req|
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"group_id": "' + mmt_2_group_concept + '", "permissions": ["read"]}, {"group_id": "' + admin_group_concept + '", "permissions": ["read"]}], "provider_identity": {"target": "PROVIDER_CONTEXT", "provider_id": "MMT_2"}}'
      end
      puts "ACL for admin and typical user to read PROVIDER_CONTEXT for MMT_2 #{resp.body}"

      ##
      ## ACLs for Groups
      ##

      # create ACL for system level groups for Administrators_2
      resp = connection.post do |req|
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"group_id": "' + admin_group_concept + '","permissions": ["read", "create"]}], "system_identity": {"target": "GROUP"}}'
      end
      puts "acl for system level groups for Administrators_2 in access control #{resp.body}"
      # create ACL for SEDAC groups for admin users
      resp = connection.post do |req|
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"group_id": "' + sedac_group_concept + '", "permissions": ["read", "create"]}], "provider_identity": {"target": "GROUP", "provider_id": "SEDAC"}}'
      end
      puts "ACL for Provider Identity GROUP for admin users for SEDAC #{resp.body}"
      # ACL for typical users for LARC groups
      resp = connection.post do |req|
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"group_id": "' + larc_group_concept + '", "permissions": ["read", "create"]}], "provider_identity": {"target": "GROUP", "provider_id": "LARC"}}'
      end
      puts "ACL for Provider Identity GROUP for typical and testuser for LARC #{resp.body}"
      # ACL for typical users for MMT_1 groups
      resp = connection.post do |req|
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"group_id": "' + mmt_1_group_concept + '", "permissions": ["read", "create"]}], "provider_identity": {"target": "GROUP", "provider_id": "MMT_1"}}'
      end
      puts "ACL for Provider Identity GROUP for typical users for MMT_1 #{resp.body}"
      # ACL for typical users for MMT_2 groups
      resp = connection.post do |req|
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"group_id": "' + mmt_2_group_concept + '", "permissions": ["read", "create"]}], "provider_identity": {"target": "GROUP", "provider_id": "MMT_2"}}'
      end
      puts "ACL for Provider Identity GROUP for typical users for MMT_2 #{resp.body}"
      # ACL for typical users for NSIDC_ECS groups
      resp = connection.post do |req|
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"group_id": "' + nsidc_group_concept + '", "permissions": ["read", "create"]}], "provider_identity": {"target": "GROUP", "provider_id": "NSIDC_ECS"}}'
      end
      puts "ACL for Provider Identity GROUP for typical users for NSIDC_ECS #{resp.body}"

      clear_cache

      ###
      ### ACL to manage Provider Identity ACLs (PROVIDER_OBJECT_ACL)
      ###

      # ACL for regular users to manage Provider Identity ACLs for MMT_1
      resp = connection.post do |req|
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"group_id": "' + mmt_1_group_concept + '", "permissions": ["read", "create", "update", "delete"]}], "provider_identity": {"target": "PROVIDER_OBJECT_ACL", "provider_id": "MMT_1"}}'
      end
      puts "ACL for CRUD permissions for typical users on Provider Identity ACLs for MMT_1 #{resp.body}"
      # ACL for regular users to manage Provider Identity ACLs for MMT_2
      resp = connection.post do |req|
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"group_id": "' + mmt_2_group_concept + '", "permissions": ["read", "create", "update", "delete"]}], "provider_identity": {"target": "PROVIDER_OBJECT_ACL", "provider_id": "MMT_2"}}'
      end
      puts "ACL for CRUD permissions for typical users on Provider Identity ACLs for MMT_2 #{resp.body}"
      # ACL for admin and typical user to manage Provider Identity ACLs for NSIDC_ECS
      resp = connection.post do |req|
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"group_id": "' + nsidc_group_concept + '", "permissions": ["read", "create", "update", "delete"]}, {"group_id": "AG1200000001-CMR", "permissions": ["read", "create", "update", "delete"]}], "provider_identity": {"target": "PROVIDER_OBJECT_ACL", "provider_id": "NSIDC_ECS"}}'
      end
      puts "ACL for CRUD permissions for admin and typical user on Provider Identity ACLs for NSIDC_ECS #{resp.body}"

      clear_cache

      ###
      ### ACLs for collection permissions (CATALOG_ITEM_ACL)
      ###

      # ACL for typical users to create catalog item ACLs for LARC
      resp = connection.post do |req|
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"group_id": "' + larc_group_concept + '", "permissions": ["read", "create", "update", "delete"]}], "provider_identity": {"target": "CATALOG_ITEM_ACL", "provider_id": "LARC"}}'
      end
      puts "ACL for typical users to read and create catalog item ACLs for LARC #{resp.body}"
      # ACL for typical users to create catalog item ACLs for MMT_1
      resp = connection.post do |req|
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"group_id": "' + mmt_1_group_concept + '", "permissions": ["read", "create", "update", "delete"]}], "provider_identity": {"target": "CATALOG_ITEM_ACL", "provider_id": "MMT_1"}}'
      end
      puts "ACL for typical users to read and create catalog item ACLs for MMT_1 #{resp.body}"
      # ACL for typical users to create catalog item ACLs for MMT_1
      resp = connection.post do |req|
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"group_id": "' + mmt_2_group_concept + '", "permissions": ["read", "create", "update", "delete"]}], "provider_identity": {"target": "CATALOG_ITEM_ACL", "provider_id": "MMT_2"}}'
      end
      puts "ACL for typical users to read and create catalog item ACLs for MMT_2 #{resp.body}"
      # Provider NSIDC_ECS
      # ACL to give admin user read on NSIDC_ECS collections
      resp = connection.post do |req|
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"permissions": ["read"], "group_id": "' + admin_group_concept + '"}], "catalog_item_identity": {"name": "NSIDC_ECS All Collections and Granules for admins", "provider_id": "NSIDC_ECS", "collection_applicable": true, "granule_applicable": true}}'
      end
      puts "Catalog Item ACL for admin users for NSIDC_ECS #{resp.body}"
      # ACL in access control for admin and typical user to create catalog item ACLs for NSIDC_ECS
      resp = connection.post do |req|
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"group_id": "' + nsidc_group_concept + '", "permissions": ["read", "create", "update", "delete"]}, {"group_id": "' + admin_group_concept + '", "permissions": ["read", "create", "update", "delete"]}], "provider_identity": {"target": "CATALOG_ITEM_ACL", "provider_id": "NSIDC_ECS"}}'
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
        req.url('http://localhost:3011/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.body = '{"group_permissions": [{"permissions": ["read"], "user_type": "guest"}, {"permissions": ["read"], "user_type": "registered"}], "catalog_item_identity": {"name": "NSIDC_ECS single collection", "provider_id": "NSIDC_ECS", "collection_applicable": true, "granule_applicable": true, "collection_identifier": {"concept_ids": ["' + @nsidc_test_case_collection + '"]}}}'
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
        req.headers['Authorization'] = 'mock-echo-system-token'
      end
      # puts "Reindexing permitted groups: #{resp.inspect}"
    end

    def wait_for_indexing
      # The following two methods are used in our tests, and also were often used
      # together by older apps that interacted with CMR
      # Wait for the CMR queue to be empty
      resp = connection.post do |req|
        req.url('http://localhost:2999/message-queue/wait-for-terminal-states')
        req.headers['Authorization'] = 'mock-echo-system-token'
      end
      # puts "Waiting for CMR queue to empty: #{resp.inspect}"

      # Refresh the ElasticSearch index
      resp = connection.post do |req|
        req.url('http://localhost:9210/_refresh')
        req.headers['Authorization'] = 'mock-echo-system-token'
      end
      # puts "Refreshing the ElasticSearch index: #{resp.inspect}"
    end

    def insert_metadata
      added = 0
      Dir.glob(File.join(Rails.root, 'lib', 'test_cmr', 'data', '*.yml')).sort.each_with_index do |filename, index|
        data = Psych.load_file(filename, aliases: true)

        data['ingest_count'].times do
          response = connection.put do |req|
            if data['collection_uri'].include? 'EDF_DEV06'
              # collection with not url friendly native id
              encoded_bad_native_id = url_encode('AMSR-E/Aqua & 5-Day, L3 Global Snow Water Equivalent EASE-Grids V001')
              req.url("http://localhost:3002/providers/LARC/collections/#{encoded_bad_native_id}")
            elsif data['collection_uri'].include? 'NSIDC_ECS'
              req.url("http://localhost:3002/providers/NSIDC_ECS/collections/collection#{index}")
              req.headers['Accept'] = 'application/json'
            elsif data['collection_uri'].include? 'SEDAC'
              req.url("http://localhost:3002/providers/SEDAC/collections/collection#{index}")
            else # data['collection_uri'].include? 'LARC'
              req.url("http://localhost:3002/providers/LARC/collections/collection#{index}")
            end

            content_type = 'application/echo10+xml'
            content_type = 'application/dif10+xml' if data['type'] == 'dif10'
            content_type = 'application/iso:smap+xml' if data['type'] == 'iso-smap'
            req.headers['Content-Type'] = content_type
            req.headers['Authorization'] = 'mock-echo-system-token'
            req.headers['Cmr-Validate-Keywords'] = 'false'
            req.body = data['metadata']

          end

          if response.success?
            added += 1
            puts "Loaded #{added} collections#{data['test_case']}"
            set_concept_if_nsidc_test_case(data, response)
          else
            puts "Error ingesting a collection: #{response.inspect}"
          end

          # Ingest a granules if available
          if data['granule']
            granule_response = connection.put do |granule_req|
              granule_req.url("http://localhost:3002/providers/LARC/granules/granule-#{index}")
              granule_req.headers['Content-Type'] = 'application/echo10+xml'
              granule_req.headers['Authorization'] = 'mock-echo-system-token'
              granule_req.body = data['granule']
            end

            if granule_response.success?
              puts "Loaded a granule"
            else
              puts "Failed to load a granule: #{response.inspect}"
            end
          end
        end
      end
      puts 'Done!'
    end

    def set_concept_if_nsidc_test_case(data, response)
      return if !(data['collection_uri'].include?('NSIDC_ECS') && data['metadata'].include?('Near-Real-Time SSMIS EASE-Grid Daily Global Ice Concentration and Snow Extent V004'))

      @nsidc_test_case_collection = JSON.parse(response.body)['concept-id']
      puts "nsidc test case concept: #{@nsidc_test_case_collection}"
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
        wait_for_indexing

        clear_cache

        # Delete the given provider
        # When a provider is deleted all of the data associated with that provider is
        # also deleted. CMR then needs to re-index, which is asyncronous
        response = connection.delete do |req|
          req.headers['Authorization'] = 'mock-echo-system-token'
          # CMR made a change to prevent providers that have any collections from being deleted
          # this header allows us to delete providers with collections for our tests
          req.headers['force-full-provider-delete'] = 'true'
          req.url("http://localhost:3002/providers/#{provider_id}")
        end

        guid = "prov-guid-#{Time.now.to_i}"
        # Wait for the cascade delete to finish or else we may create races in CMR

        wait_for_indexing

        clear_cache

        # Recreate provider in Ingest
        resp = connection.post do |req|
          req.url('http://localhost:3002/providers')
          req.headers['Content-Type'] = 'application/json'
          req.headers['Authorization'] = 'mock-echo-system-token'
          req.body = '{"provider-id": "' + provider_id + '", "short-name": "' + provider_id + '", "cmr-only": true}'
        end
        # puts "recreate provider in CMR ingest: #{resp.body}"
        # Recreate provider in Mock Echo
        resp = connection.post do |req|
          req.url('http://localhost:3008/providers')
          req.headers['Content-Type'] = 'application/json'
          req.headers['Authorization'] = 'mock-echo-system-token'
          req.body = '[{"provider":{"id":"' + guid + '","provider_id":"' + provider_id + '"}}]'
        end
        # puts "recreate provider in mock echo: #{resp.body}"

        # Create provider acl group
        group_resp = connection.post do |req|
          req.url('http://localhost:3011/groups')
          req.headers['Content-Type'] = 'application/json'
          req.headers['Authorization'] = 'mock-echo-system-token'
          req.body = '{"name": "' + provider_id + ' Admin Group", "description": "Test group for provider", "provider_id": "' + provider_id + '"}'
        end
        # get the new provider group's concept id
        group_concept_id = JSON.parse(group_resp.body)['concept_id']
        # puts "group added for recreated provider. concept: #{group_concept_id}; response: #{group_resp.body}"

        # add typical user to new provider group
        connection.post do |req|
          req.url("http://localhost:3011/groups/#{group_concept_id}/members")
          req.headers['Content-Type'] = 'application/json'
          req.headers['Authorization'] = 'mock-echo-system-token'
          req.body = '["typical", "testuser"]'
        end

        # recreate guest and registered user read permissions on collections (catalog item acls) in access control
        resp = connection.post do |req|
          req.url('http://localhost:3011/acls')
          req.headers['Content-Type'] = 'application/json'
          req.headers['Authorization'] = 'mock-echo-system-token'
          req.body = '{"group_permissions": [{"permissions": ["read"], "user_type": "guest"}, {"permissions": ["read"], "user_type": "registered"}], "catalog_item_identity": {"name": "' + provider_id + ' All Collections and Granules", "provider_id": "' + provider_id + '", "collection_applicable": true, "granule_applicable": true}}'
        end
        # puts "recreate collection permissions for guest and registered users for #{provider_id} #{resp.body}"

        # recreate guest and registered user ingest permissions in access control
        resp = connection.post do |req|
          req.url('http://localhost:3011/acls')
          req.headers['Content-Type'] = 'application/json'
          req.headers['Authorization'] = 'mock-echo-system-token'
          req.body = '{"group_permissions": [{"user_type": "guest", "permissions": ["read", "update"]}, {"user_type": "registered", "permissions": ["read", "update"]}], "provider_identity": {"target": "INGEST_MANAGEMENT_ACL", "provider_id": "' + provider_id + '"}}'
        end
        # puts "ACL for INGEST_MANAGEMENT_ACL for guest and registered users for #{provider_id} #{resp.body}"

        # recreate provider group permissions for typical users in access control
        connection.post do |req|
          req.url('http://localhost:3011/acls')
          req.headers['Content-Type'] = 'application/json'
          req.headers['Authorization'] = 'mock-echo-system-token'
          req.body = '{"group_permissions": [{"group_id": "' + group_concept_id + '", "permissions": ["read", "create"]}], "provider_identity": {"target": "GROUP", "provider_id": "' + provider_id + '"}}'
        end

        # recreate provider context permissions for admin and typical users in access control
        connection.post do |req|
          req.url('http://localhost:3011/acls')
          req.headers['Content-Type'] = 'application/json'
          req.headers['Authorization'] = 'mock-echo-system-token'
          req.body = '{"group_permissions": [{"group_id": "' + group_concept_id + '", "permissions": ["read"]}, {"group_id": "' + 'AG1200000001-CMR' + '", "permissions": ["read"]}], "provider_identity": {"target": "PROVIDER_CONTEXT", "provider_id": "' + provider_id + '"}}'
        end

        # recreate provider acl permissions for typical users in access control
        resp = connection.post do |req|
          req.url('http://localhost:3011/acls')
          req.headers['Content-Type'] = 'application/json'
          req.headers['Authorization'] = 'mock-echo-system-token'
          req.body = '{"group_permissions": [{"group_id": "' + group_concept_id + '", "permissions": ["read", "create", "update", "delete"]}], "provider_identity": {"target": "PROVIDER_OBJECT_ACL", "provider_id": "' + provider_id + '"}}'
        end

        # recreate provider catalog item acl permissions for typical users in access control
        resp = connection.post do |req|
          req.url('http://localhost:3011/acls')
          req.headers['Content-Type'] = 'application/json'
          req.headers['Authorization'] = 'mock-echo-system-token'

          req.body = '{"group_permissions": [{"group_id": "' + group_concept_id + '", "permissions": ["read", "create", "update", "delete"]}], "provider_identity": {"target": "CATALOG_ITEM_ACL", "provider_id": "' + provider_id + '"}}'
        end
        # puts "recreate CATALOG_ITEM_ACL permissions for typical users in #{provider_id}: #{resp.body}"

        wait_for_indexing

        reindex_permitted_groups

        wait_for_indexing

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
