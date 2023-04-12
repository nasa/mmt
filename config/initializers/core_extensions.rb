#Load in rails via:
# config/initializers/core_extensions.rb
#Forcibly require our core extensions after rails has loaded

Dir.glob(Rails.root.join('lib', 'core_ext', '*.rb')).each { |extension| require extension }


