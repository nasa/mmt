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
    def initialize(num_collections)
      @num = num_collections
    end

    def load_data
      setup_cmr
      insert_metadata(retrieve_metadata_uris)
    end

    def setup_cmr
      # Creating a Provider in CMR
      connection.post do |req|
        req.url('http://localhost:3002/providers')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{"provider-id": "PROV1", "short-name": "p1", "cmr-only": true}'
      end

      # Create a provider in Mock Echo
      connection.post do |req|
        req.url('http://localhost:3008/providers')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '[{"provider":{"id":"provguid1","provider_id":"PROV1"}}]'
      end

      # Adding ACLs
      connection.post do |req|
        req.url('http://localhost:3008/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{    "acl": {        "access_control_entries": [            {                "permissions": [                    "READ"                ],                "sid": {                    "user_authorization_type_sid": {                        "user_authorization_type": "GUEST"                    }                }            },            {                "permissions": [                    "READ"                ],                "sid": {                    "user_authorization_type_sid": {                        "user_authorization_type": "REGISTERED"                    }                }            }        ],        "catalog_item_identity": {            "collection_applicable": true,            "granule_applicable": true,            "provider_guid": "provguid1"        },        "system_object_identity": {}    }}'
      end
      connection.post do |req|
        req.url('http://localhost:3008/acls')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Echo-token'] = 'mock-echo-system-token'
        req.body = '{    "acl": {        "access_control_entries": [            {                "permissions": [                    "UPDATE",                    "DELETE"                ],                "sid": {                    "user_authorization_type_sid": {                        "user_authorization_type": "GUEST"                    }                }            },            {                "permissions": [                    "UPDATE",                    "DELETE"                ],                "sid": {                    "user_authorization_type_sid": {                        "user_authorization_type": "REGISTERED"                    }                }            }        ],        "provider_object_identity": {            "provider_guid": "provguid1",            "target": "INGEST_MANAGEMENT_ACL"        }    }}'
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
          req.url("http://localhost:3002/providers/PROV1/collections/collection#{index}")
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

    def connection
      @connection ||= Faraday.new do |faraday|
        faraday.request  :url_encoded             # form-encode POST params
        # faraday.response :logger                  # log requests to STDOUT
        faraday.adapter  Faraday.default_adapter  # make requests with Net::HTTP
      end
    end
  end
end
