require 'test_cmr/load_data.rb'

namespace :cmr do
  include Cmr

  desc 'Save collection data from CMR'
  task :save_data do
    cmr = Cmr::Local.new
    cmr.save_data
  end

  desc 'Load collection metadata into locally running CMR'
  task load: [:reset] do
    cmr = Cmr::Local.new
    cmr.load_data
  end

  desc 'Start local CMR'
  task start: [:stop] do
    # Process.spawn('cd cmr; java -XX:-OmitStackTraceInFastThrow -classpath ./cmr-dev-system-0.1.0-SNAPSHOT-standalone.jar cmr.dev_system.runner > cmr_logs.log &')
    # Process.spawn('cd cmr; nohup java -classpath ./cmr-dev-system-0.1.0-SNAPSHOT-standalone.jar cmr.dev_system.runner&')
    Process.spawn('cd cmr; unset GEM_HOME; unset GEM_PATH; echo `env`; nohup java -classpath ./cmr-dev-system-0.1.0-SNAPSHOT-standalone.jar cmr.dev_system.runner&')
    puts 'Cmr is starting up'
  end

  desc 'Reset data in CMR'
  task :reset do
    cmr = Cmr::Local.new
    cmr.reset_data
  end

  desc 'Start and load data into local CMR'
  task start_and_load: [:start, :load] do
    # Start CMR and load data
  end

  desc 'Stop local CMR process'
  task :stop do
    `date && echo "Stopping applications" && (curl -XPOST http://localhost:2999/stop; true)`
  end

  desc 'Delete provider used in tests'
  task :reset_test_provider, [:provider_id] => ['tmp:cache:clear'] do |_task, args|
    args.with_defaults(provider_id: 'MMT_2')

    cmr = Cmr::Local.new
    cmr.reset_provider(args[:provider_id])
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

      jquery = Rails.application.config.assets.paths.select { |p| p.include?('jquery-rails') }
      dependencies.unshift(File.join(jquery.first, 'jquery.js')) if jquery.any?

      js_to_uglify = dependencies.sort.map do |file|
        puts "- Reading #{file}"

        IO.read(file)
      end.join("\n")

      begin
        puts "\nCompiling CoffeeScript..."

        required_js_assets = %w(cards preview)

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

          puts "\nCompressing..."

          compressed_file = Uglifier.compile(js_to_uglify + contents)

          puts "\nWriting to disk..."
          directory = File.dirname(js_asset_output_file)

          FileUtils.mkdir_p(directory) unless File.directory?(directory)

          File.write(js_asset_output_file, compressed_file)

          puts "- Compressed file available at #{js_asset_output_file}"
        end
      rescue => e
        puts "Failed to compile JavaScript: #{e}"
      end

      puts "\nDone!"
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
end
