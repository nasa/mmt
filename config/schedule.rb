# Use this file to easily define all of your cron jobs.
#
# It's helpful, but not entirely necessary to understand cron before proceeding.
# http://en.wikipedia.org/wiki/Cron

# Example:
#
# set :output, "/path/to/my/cron_log.log"
#
# every 2.hours do
#   command "/usr/bin/some_great_command"
#   runner "MyModel.some_method"
#   rake "some:great:rake:task"
# end
#
# every 4.days do
#   runner "AnotherModel.prune_old_records"
# end

# Learn more: http://github.com/javan/whenever

ruby_path = File.expand_path('..', %x(which ruby))

env :PATH, "#{ruby_path}:/usr/local/bin:/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/sbin"

set :output, 'log/mmt_cron.log'

every 1.day do
  rake 'sessions_cleanup_cron:cleanup'
end

every 1.day do
  rake 'delete_proposals:expired_proposals'
end
