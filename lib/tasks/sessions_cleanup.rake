namespace :sessions_cleanup_cron do
  desc 'Run task to clean up sessions'
  task :cleanup do
    Rake::Task['db:sessions:trim'].invoke
    current_time = Time.now.strftime('%m/%d/%Y %H:%M')
    puts "#{current_time} - Sessions cleanup cron executed"
  end
end
