namespace :sessions_cleanup_cron do
  desc 'Run task to clean up sessions'
  task :cleanup do
    Rake::Task['db:sessions:trim'].invoke
    current_time_str = Time.now.to_fs(:log_time)
    puts "#{current_time_str} - Sessions cleanup cron executed"
  end
end
