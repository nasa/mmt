require 'test_cmr/load_data.rb'

namespace :cmr do
  include Cmr

  desc 'Load collection metadata into locally running CMR'
  task load: [:reset] do
    cmr = Cmr::Local.new
    cmr.load_data
  end

  desc 'Start local CMR'
  task start: [:stop] do
    # Process.spawn('cd cmr; java -XX:-OmitStackTraceInFastThrow -classpath ./cmr-dev-system-0.1.0-SNAPSHOT-standalone.jar cmr.dev_system.runner > cmr_logs.log &')
    Process.spawn('cd cmr; nohup java -classpath ./cmr-dev-system-0.1.0-SNAPSHOT-standalone.jar cmr.dev_system.runner&')
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
  task :reset_test_provider, [:provider_id] => ['tmp:cache:clear'] do |task, args|
    args.with_defaults(provider_id: 'MMT_2')

    cmr = Cmr::Local.new
    cmr.reset_provider(args[:provider_id])
  end
end
