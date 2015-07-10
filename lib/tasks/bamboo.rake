namespace :bamboo do
  desc "Run tests in Bamboo"
  task :test => ["cmr:start_and_load", :spec] do
    # Starts CMR, loads data into CMR, runs 'rake spec'
  end
end
