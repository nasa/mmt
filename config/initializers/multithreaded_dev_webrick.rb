# This solution was found online at: https://stackoverflow.com/questions/14027151/how-rails-resolve-multi-requests-at-the-same-time/20940926
# Without this, MMT and dMMT cannot communicate in dev, but it appears to have
# a consequence of making most changes require a reboot of rails to take effect.
# The monkey patch and other settings required to accomplish this, as is, are
# hidden behind a setting in application.yml.


if (Rails.env.development? && ENV['webrick_monkey_patch_enabled'] == 'true') || Rails.env.test?
  # Remove Rack::Lock so WEBrick can be fully multi-threaded.
  require 'rails/commands/server/server_command'

  class Rails::Server
    def middleware
      middlewares = []
      middlewares << [Rails::Rack::Debugger] if options[:debugger]
      middlewares << [::Rack::ContentLength]

      Hash.new middlewares
    end
  end
end
