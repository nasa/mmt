require 'test_cmr/local.rb'

namespace :cmr do
  # include Cmr

  jar_name = 'cmr-dev-system-0.1.0-SNAPSHOT-standalone.jar'
  url_source = "https://maven.earthdata.nasa.gov/repository/mmt/#{jar_name}"

  desc 'Fetch latest CMR jar from the maven repository'
  task :fetch do
    # use puts %x() to run commands and not Process.spawn(), which returns
    # imediatly, because curl can take a while and we want to see the output
    # from standard out.

    # make a backup copy of the old jar if it exists, and a backup of the backup
    cmd_backup = 'cd cmr ; '\
      "if [ -a \"#{jar_name}\" ] ; then "\
        'echo Backup jar... ; '\
        "mv -fv #{jar_name}.last #{jar_name}.oldest ; "\
        "mv -fv #{jar_name} #{jar_name}.last ; "\
      'fi'
    puts %x( #{cmd_backup} )

    # download a new jar to a temp location and rename it if successfull
    puts 'Download jar...'
    cmd_fetch = 'cd cmr ; '\
      'curl '\
        '--connect-timeout 20 '\
        "#{url_source} > #{jar_name}.tmp && mv #{jar_name}.tmp #{jar_name}"
    puts %x( #{cmd_fetch} )

    # restore if error, as defined by there not being a jar
    cmd_restore = 'cd cmr ; '\
      "if [ -a \"#{jar_name}\" ] ; then "\
        "rm #{jar_name}.oldest ; "\
      'else '\
        "mv -f #{jar_name}.last #{jar_name} ;"\
        "mv -f #{jar_name}.oldest #{jar_name}.last ;"\
        "rm #{jar_name}.tmp ;"\
      'fi'
    puts %x( #{cmd_restore} )
    puts 'Done'
  end

  desc 'Save collection data from CMR'
  task :save_data do
    cmr = TestCmr::Local.new
    cmr.save_data
  end

  desc 'Load collection metadata into locally running CMR'
  task load: [:reset] do
    cmr = TestCmr::Local.new
    cmr.load_data

    puts "Local CMR downloaded on: #{File.ctime('cmr/' + jar_name)}"
  end

  desc 'Start local CMR'
  task start: [:stop] do
    # Process.spawn("cd cmr; java -XX:-OmitStackTraceInFastThrow -classpath ./#{jar_name} cmr.dev_system.runner > cmr_logs.log &")

    # `-DCMR_DEV_SYSTEM_REDIS_TYPE=external` was added when CMR made a change to use Redis
    # we may be able to remove it when they adjust the uberjar configuration
    cmd = 'cd cmr ; '\
      'CMR_VALIDATE_KEYWORDS_DEFAULT_TRUE_ENABLED=false java -jar -Xmx1g cmr-dev-system-0.1.0-SNAPSHOT-standalone.jar'\
        '> cmr.log 2>&1 &'
    Process.spawn( "#{cmd}" )

    # this command was necessary when there was an issue with jRuby in CMR accessing our gems
    # Process.spawn("cd cmr; unset GEM_HOME; unset GEM_PATH; echo `env`; nohup java -classpath ./#{jar_name} cmr.dev_system.runner&")
    puts 'Cmr is starting up'
  end

  desc 'Reset data in CMR'
  task :reset do
    cmr = TestCmr::Local.new
    cmr.reset_data
  end

  desc 'Start and load data into local CMR'
  task start_and_load: [:start, :load]
  # Start CMR and load data

  desc 'Stop local CMR process'
  task :stop do
    `date && echo "Stopping applications" && (curl -s -XPOST http://localhost:2999/stop; true)`
  end

  desc 'Reset provider used in tests'
  task :reset_test_provider, [:provider_id] => ['tmp:cache:clear'] do |_task, args|
    args.with_defaults(provider_id: 'MMT_2')

    cmr = TestCmr::Local.new
    cmr.reset_provider(args[:provider_id])
  end

  desc 'Create a new provider'
  task :create_provider, [:provider_id] do |_task, args|
    if args.provider_id.nil?
      puts 'New Provider Id is required'
    else
      cmr_conn = Faraday.new
      provider_response = cmr_conn.post do |req|
        req.url('http://localhost:3002/providers')
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = 'mock-echo-system-token'

        # CMR expects double quotes in the JSON body
        req.body = "{\"provider-id\": \"#{args.provider_id}\", \"short-name\": \"#{args.provider_id}\", \"cmr-only\": true}"
      end

      if provider_response.success?
        puts "Successfully created provider #{args.provider_id}"
      else
        puts "Did not create provider: #{Array.wrap(JSON.parse(provider_response.body)['errors']).join(' /// ')}"
      end
    end
  end

  desc 'Delete a provider'
  task :delete_provider, [:provider_id] do |_task, args|
    if args.provider_id.nil?
      puts 'Provider Id is required'
    else
      cmr_conn = Faraday.new
      provider_response = cmr_conn.delete do |req|
        req.headers['Authorization'] = 'mock-echo-system-token'
        req.url("http://localhost:3002/providers/#{args.provider_id}")
      end

      if provider_response.success?
        puts "Successfully deleted provider #{args.provider_id}"
      else
        puts "Did not delete the provider: #{Array.wrap(JSON.parse(provider_response.body)['errors']).join(' /// ')}"
      end
    end
  end

  namespace :preview do
    desc 'Export assets for the metadata preview gem'
    task compile_js: :environment do
      js_asset_output_file = File.join(Rails.root.to_s, 'cmr_metadata_preview', 'application.js')

      puts '== JavaScript'

      puts "\nCompiling dependencies..."

      dependencies = [
        File.join(Rails.root.to_s, 'vendor', 'assets', 'javascripts', 'eui-1.0.0', 'eui.js')
      ]

      # Find the path to jquery
      jquery = Rails.application.config.assets.paths.select { |p| p.to_s.include?('jquery-rails') }
      # Include a specific file. jquery-rails has files for each major version
      # stored in the above location
      dependencies.unshift(File.join(jquery.first, 'jquery3.js')) if jquery.any?

      js_to_uglify = dependencies.sort.map do |file|
        puts "- Reading #{file}"

        IO.read(file)
      end.join("\n")

      begin
        puts "\nCompiling CoffeeScript..."

        required_js_assets = %w(cards preview table_of_contents)

        files_to_compile = []

        Dir.chdir File.join(Rails.root.to_s, 'app', 'assets', 'javascripts') do
          Find.find(Dir.pwd) do |path|
            if FileTest.directory? path
              if File.basename(path)[0] == ?.
                Find.prune
              else
                next
              end
            elsif path =~ /\.coffee$/ && required_js_assets.include?(File.basename(path, '.*'))
              puts "- Compiling #{path}"

              files_to_compile << path
            end
          end

          contents = `cat #{files_to_compile.join(' ')} | coffee -c --stdio`

          raise 'contents is empty: check `which coffee` and install if necessary' if contents.blank?

          puts "\nCompressing..."

          compressed_file = Uglifier.compile(js_to_uglify + contents, harmony: true)
          #uncomment the following if you need to compile with JS < 6
          #compressed_file = Uglifier.compile(js_to_uglify + contents)

          puts "\nWriting to disk..."
          directory = File.dirname(js_asset_output_file)

          FileUtils.mkdir_p(directory) unless File.directory?(directory)

          File.write(js_asset_output_file, compressed_file)
          raise 'Error writing file; could not verify existence after write attempt' unless File.exist?(js_asset_output_file)

          puts "- Compressed file available at #{js_asset_output_file}"
          puts "\nDone!"
        end
      rescue => e
        puts "Failed to compile JavaScript: #{e}"
      end
    end

    desc 'Export UMM version for cmr metadata preview gem'
    task umm_version: :environment do
      begin
        umm_version_file = File.join(Rails.root.to_s, 'cmr_metadata_preview', '.umm-version')

        full_umm_version = Rails.configuration.umm_c_version
        umm_version_number = /version=(\d+\.\d)$/.match(full_umm_version)[1]

        directory = File.dirname(umm_version_file)
        FileUtils.mkdir_p(directory) unless File.directory?(directory)

        File.write(umm_version_file, umm_version_number)

        puts 'Created .umm-version file for cmr_metadata_preview.'
      rescue => e
        puts "Failed to write .umm-version file: #{e}"
      end

      puts "Done!"
    end
  end

  namespace :subscriptions do
    desc 'Add a specified number of granules to a specified collection'
    task :add_granules, [:collection_entry_title, :provider, :iterations, :path_to_granule_json] => :environment do |_task, args|
      granule_json = JSON.parse(File.read(args.path_to_granule_json))
      args.iterations.to_i.times do
        id = SecureRandom.uuid
        granule_json['CollectionReference'] = { 'EntryTitle' => args.collection_entry_title }
        granule_json['GranuleUR'] = id
        response = cmr_client.ingest_granule(granule_json.to_json, args.provider, "testing_subscription_#{id}")
        puts response.clean_inspect unless response.success?
      end
      puts "Done!"
    end
  end
end
