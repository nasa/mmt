require 'factory_bot'
require 'test_cmr/local.rb'

# Usage:
# rake testing:ingest_full[<ticket number>,<number of collections>,<development|sit>]
# rake testing:ingest_required[<ticket number>,<number of collections>,<development|sit>]
#
# Pro Tip: No spaces in argument list!
#
# This will ingest collections into development|sit with the short name
# "MMT-<ticket number>--<index>".
# The idea is that our test team can ask us to ingest some test collections
# for a specific ticket to streamline the testing process.
#
# For ingesting into SIT, you will need to copy/paste your URS Access Token
# from your local Rails Server. Look for the log output: "Access Token: <your token>"
#

namespace :testing do
  # include Cmr
  desc 'Ingest testing collections into CMR with every field completed'
  task :ingest_full, [:ticket, :count, :env] => [:environment] do |_t, args|
    draft = FactoryBot.build(:full_collection_draft)
    ingest_collection(draft, args[:ticket], args[:count], args[:env])
  end

  desc 'Ingest testing collections into CMR with only required fields present'
  task :ingest_required, [:ticket, :count, :env] => [:environment] do |_t, args|
    draft = FactoryBot.build(:collection_draft_all_required_fields)
    ingest_collection(draft, args[:ticket], args[:count], args[:env])
  end

  def ingest_collection(draft, ticket, count, env)
    unless %w(development sit).include? env.downcase
      puts 'Environment must be Development or SIT'
      return false
    end

    if env.casecmp 'sit'
      puts 'URS Token:'
      token = STDIN.gets.strip
      # access_token:client_id
      token += ':81FEem91NlTQreWv2UgtXQ'
    else
      token = 'ABC-2'
    end

    url = 'http://localhost:3002/'
    url = 'https://cmr.sit.earthdata.nasa.gov/ingest/' if env.casecmp 'sit'
    cmr_sit_connection = Faraday.new(url: url)
    headers = {
      'Accept' => 'application/json',
      'Content-Type' => "application/#{Rails.configuration.umm_c_version}; charset=utf-8",
      'Client-Id' => 'MMT',
      'Authorization' => token
    }

    count.to_i.times do |index|
      draft.draft['EntryTitle'] = "MMT-#{ticket} Collection #{index}"
      draft.draft['ShortName'] = "MMT-#{ticket}--#{index}"
      draft.native_id = "MMT-#{ticket}--#{index}"
      draft.provider_id = 'MMT_1'

      cmr_sit_response = cmr_sit_connection.put("providers/#{draft.provider_id}/collections/#{draft.native_id}", draft.draft.to_json, headers)
      if cmr_sit_response.success?
        puts "Loaded collection into #{env.downcase} with Short Name MMT-#{ticket}--#{index}"
      else
        puts cmr_sit_response.inspect
      end
    end
  end

  desc 'Ingest a collection, services, and tools to test tabs in Preview Gem'
  task :ingest_tabs_test, [:serv_count, :tool_count] => [:environment] do |_t, args|
    puts('Only usable in dev') && return unless Rails.env.development? || Rails.env.test?

    # make a TestCmr::Local to take advantage of wait_for_indexing method
    cmr = TestCmr::Local.new
    collection_draft = FactoryBot.build(:full_collection_draft)
    collection_response = cmr_client.ingest_collection(collection_draft.draft.to_json, 'MMT_2', SecureRandom.uuid, 'access_token')
    puts("Error ingesting collection: #{collection_response.clean_inspect}") && return unless collection_response.success?

    cmr.wait_for_indexing
    args[:serv_count].to_i.times do
      service_draft = FactoryBot.build(:full_service_draft)
      service_ingest_response = cmr_client.ingest_service(metadata: service_draft.draft.to_json, provider_id: 'MMT_2', native_id: SecureRandom.uuid, token: 'access_token')
      puts("Error ingesting service: #{service_ingest_response.clean_inspect}") && return unless service_ingest_response.success?

      service_assoc_response = cmr_client.add_collection_associations(service_ingest_response.body['concept-id'], collection_response.body['concept-id'], 'access_token', 'services')
      puts("Error associating service: #{service_assoc_response.clean_inspect}") && return unless service_assoc_response.success?

      puts "Successfully ingested #{service_ingest_response.body['concept-id']} and associated it to #{collection_response.body['concept-id']}"
    end

    args[:tool_count].to_i.times do
      tool_draft = FactoryBot.build(:full_tool_draft)
      tool_ingest_response = cmr_client.ingest_tool(metadata: tool_draft.draft.to_json, provider_id: 'MMT_2', native_id: SecureRandom.uuid, token: 'access_token')
      puts("Error ingesting tool: #{tool_ingest_response.clean_inspect}") && return unless tool_ingest_response.success?

      tool_assoc_response = cmr_client.add_collection_associations(tool_ingest_response.body['concept-id'], collection_response.body['concept-id'], 'access_token', 'tools')
      puts("Error associating service: #{tool_assoc_response.clean_inspect}") && return unless tool_assoc_response.success?

      puts "Successfully ingested #{tool_ingest_response.body['concept-id']} and associated it to #{collection_response.body['concept-id']}"
    end
  end
end
