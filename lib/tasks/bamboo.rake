namespace :bamboo do
  desc "Run tests in Bamboo"
  task :test => [:start_and_load, :spec] do
    # Starts CMR, loads data into CMR, runs 'rake spec'
  end

  desc "Starts and loads data in local CMR in bamboo"
  task start_and_load: [:start, "cmr:load"]

  desc 'Start local CMR'
  task start: ["cmr:stop"] do
    # Seperate task to let bamboo use redis
    Process.spawn('cd cmr; nohup java -classpath ./cmr-dev-system-0.1.0-SNAPSHOT-standalone.jar cmr.dev_system.runner > cmr.log 2>&1 &')

    puts 'Cmr is starting up'
  end
end
