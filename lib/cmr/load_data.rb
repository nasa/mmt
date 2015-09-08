# pull list of metadata locations from remote CMR
#
# setup local CMR
#
# for each collection
#   retrieve metadata
#   insert metadata into local CMR

#TODO: Need to ingest some granule metadata


require 'multi_xml'

module Cmr
  class Local
    def initialize(num_collections=nil)
      @num = num_collections
    end

    def load_data
      wait_for_cmr do
        setup_cmr
      end
      insert_metadata(retrieve_metadata_uris)
    end

    def wait_for_cmr
        cmr_up = false
        until cmr_up do
          begin
            cmr_up = yield
          rescue Faraday::Error::ConnectionFailed => e
            puts "CMR is still starting, please wait..."
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

      ### Adding ACLs
      # Provider SEDAC
      connection.post do |req|
        req.url('http://localhost:3008/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"acl": {"access_control_entries": [{"permissions": ["READ"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "GUEST"}}},{"permissions": ["READ"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "REGISTERED"}}}],"catalog_item_identity": {"collection_applicable": true,"granule_applicable": true,"provider_guid": "provguid1"},"system_object_identity": {}}}'
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
        req.body = '{"acl": {"access_control_entries": [{"permissions": ["READ"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "GUEST"}}},{"permissions": ["READ"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "REGISTERED"}}}],"catalog_item_identity": {"collection_applicable": true,"granule_applicable": true,"provider_guid": "provguid2"},"system_object_identity": {}}}'
      end
      connection.post do |req|
        req.url('http://localhost:3008/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"acl": {"access_control_entries": [{"permissions": ["UPDATE","DELETE"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "GUEST"}}},{"permissions": ["UPDATE","DELETE"],"sid": {"user_authorization_type_sid": {"user_authorization_type": "REGISTERED"}}}],"provider_object_identity": {"provider_guid": "provguid2","target": "INGEST_MANAGEMENT_ACL"}}}'
      end

      ### Clear Cache
      connection.post do |req|
        req.url('http://localhost:2999/clear-cache')
      end
    end

    def retrieve_metadata_uris
      response = connection.get("https://cmr.earthdata.nasa.gov/search/collections.xml?page_size=#{@num}&page_num=1")
      xml = MultiXml.parse(response.body)
      xml['results']['references']['reference'].map{|r| r['location']}
    end

    def insert_metadata(uri_list)
      added = 0
      uri_list.each_with_index do |uri, index|
        metadata = connection.get(uri).body
        response = connection.put do |req|
          if index > 24
            req.url("http://localhost:3002/providers/SEDAC/collections/collection#{index}")
          else
            req.url("http://localhost:3002/providers/LARC/collections/collection#{index}")
          end
          req.headers['Content-Type'] = 'application/echo10+xml'
          req.headers['Echo-token'] = 'mock-echo-system-token'
          req.body = metadata
        end

        if response.success?
          added += 1
          puts "Loaded #{added} collections"
        end
      end
      puts "Done!"
    end

    def reset_data
      wait_for_cmr do
        connection.post do |req|
          req.url('http://localhost:2999/reset')
        end
      end
    end

    def connection
      @connection ||= Faraday.new do |faraday|
        faraday.request :url_encoded # form-encode POST params
        # faraday.response :logger  # log requests to STDOUT
        faraday.adapter  Faraday.default_adapter  # make requests with Net::HTTP
      end
    end
  end
end
