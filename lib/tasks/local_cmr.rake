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
    Process.spawn('cd cmr; java -XX:-OmitStackTraceInFastThrow -classpath ./cmr-dev-system-0.1.0-SNAPSHOT-standalone.jar cmr.dev_system.runner > cmr_logs.log &')
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
    `kill $(ps aux | grep '[c]mr-dev-system' | awk '{print $2}')`
  end

  desc 'Delete provider used in tests'
  task reset_test_provider: ['tmp:cache:clear'] do
    cmr = Cmr::Local.new
    cmr.reset_provider('MMT_2')
  end

  desc 'Load system level groups for tests'
  task :load_system_groups do
    cmr = Cmr::Local.new
    cmr.load_system_groups
  end

  desc 'Load collection metadata AND system level groups'
  task load_data_and_groups: [:load, :load_system_groups] do
    cmr = Cmr::Local.new
    # reset, load metadata, load system groups
  end
end
