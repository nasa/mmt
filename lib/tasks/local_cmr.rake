require 'cmr/load_data.rb'

namespace :cmr do
  include Cmr

  desc "Load collection metadata into locally running CMR"
  task :load do
    cmr = Cmr::Local.new(50) # might not actually add 50 collections, there are some errors
    # TODO find a set of good collection metadata to load
    cmr.load_data
  end

  desc "Start local CMR"
  task :start do
    Process.spawn("cd cmr; java -XX:MaxPermSize=256m -classpath ./cmr-dev-system-0.1.0-SNAPSHOT-standalone.jar cmr.dev_system.runner > cmr_logs.log &")
  end

  desc "Stop local CMR process"
  task :stop do
    `kill $(ps aux | grep '[c]mr-dev-system' | awk '{print $2}')`
  end
end
