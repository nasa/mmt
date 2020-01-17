require 'factory_bot'

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
  desc 'Ingest testing collections into CMR with every field completed'
  task :ingest_full, [:ticket, :count, :env] => [:environment] do |_t, args|
    draft = FactoryGirl.build(:full_collection_draft)
    ingest_collection(draft, args[:ticket], args[:count], args[:env])
  end

  desc 'Ingest testing collections into CMR with only required fields present'
  task :ingest_required, [:ticket, :count, :env] => [:environment] do |_t, args|
    draft = FactoryGirl.build(:collection_draft_all_required_fields)
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
      'Echo-Token' => token
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
end
