require 'libxml_to_hash'

namespace :collections do
  desc 'Load a providers collections from SIT for local testing'
  task :replicate, [:provider, :page_size] => :environment do |_task, args|
    args.with_defaults(provider: 'MMT_2')
    args.with_defaults(page_size: 25)

    puts "Requesting #{args.page_size} #{args.provider} collections from SIT..."

    collections_ingested = 0

    cmr_sit_connection = Faraday.new(url: 'https://cmr.sit.earthdata.nasa.gov')
    cmr_sit_response = cmr_sit_connection.get('/search/collections.umm-json', provider: args.provider, page_size: args.page_size) do |cmr_request|
      cmr_request.headers['Client-Id'] = 'MMT'
    end

    if cmr_sit_response.success?
      parsed_response = JSON.parse(cmr_sit_response.body)

      puts 'Retrieved 0 collections.' if parsed_response['items'].blank?

      (parsed_response['items'] || []).each_with_index do |obj, index|
        collection_concept_id = obj.fetch('meta', {}).fetch('concept-id', nil)

        puts "Downloading #{collection_concept_id}..."

        connection = Faraday.new(url: 'https://cmr.sit.earthdata.nasa.gov')
        metadata_response = connection.get("search/collections.native?concept_id=#{collection_concept_id}") do |req|
          # Some providers require users be authenticated to view their collections, you can set an
          # environment variable with your token to access them
          req.headers['Authorization'] = ENV['CMR_SIT_TOKEN'] if ENV.key?('CMR_SIT_TOKEN')
        end

        if metadata_response.success?
          puts "Ingesting #{collection_concept_id}..."

          parsed_metadata = Hash.from_libxml(metadata_response.body)

          collection_details = parsed_metadata['results']['result']

          # Attempt to re-use the native id, fallback to the index of the loop
          native_id = obj.fetch('meta', {}).fetch('native-id', index)

          ingest_connection = Faraday.new(url: 'http://localhost:3002')
          response = ingest_connection.put(CGI.escape("providers/#{args.provider}/collections/collection/#{native_id}")) do |req|
            # Pull the format from the collection since we're asking for the native representation
            # req.headers['Content-Type'] = "#{obj.fetch('meta', {}).fetch('format', nil)};version=1.6"
            req.headers['Content-Type'] = collection_details.attributes['format']

            # Setting the concept-id allows us to set the concept id locally to match SIT for testing
            req.headers['concept-id'] = collection_concept_id

            # Ingesting to local CMR so we can set the token with those we've created
            req.headers['Authorization'] = get_collections_token

            # The body here is the xml downloaded from SIT that represents this collection
            req.body = collection_details.text
          end

          # Parse the response from our attempt to ingest the downloaded collection
          parsed_response = Hash.from_libxml(response.body)

          if response.success?
            collections_ingested += 1
            puts "[Success] Created #{args.provider} collection with concept-id #{parsed_response['result']['concept-id']}\n\n"
          else
            puts "[Failure] #{parsed_response['errors']['error']}\n\n"
          end
        else
          puts "[Failure] #{Hash.from_libxml(metadata_response.body)['errors']['error']}\n\n"
        end
      end

    else
      puts 'Error Requesting collections.'
    end

    puts "Successfully ingested #{collections_ingested} collections."
  end

  def cmr_client
    @cmr_client ||= Cmr::Client.client_for_environment(Rails.configuration.cmr_env, Rails.configuration.services)
  end

  # For use in local CMR only. Any other environment will not recognize these tokens
  def get_collections_token(admin: false)
    admin ? 'ABC-1' : 'ABC-2'
  end
end
