source 'https://rubygems.org'

ruby "2.7.2"
# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
# We have not investigated the cost of moving to rails 6, but expect it to make
# more breaking changes.  Rails 5 is still supported.
gem 'rails', '~> 5.2.4'
# Rails currently limits all of the action*/active* gems
# activesupport limits tzinfo

# deployment support
# Sprockets is locked to ~> 3.7.0 because the extra work to update to 4.0.0 was
# dissuasive the last time we updated it. There are instructions to construct
# the necessary manifest file in sprockets' repo.
gem 'sprockets', '~> 3.7.0'

# Use SCSS for stylesheets
gem 'bourbon'
gem 'sassc-rails'

# Use Autoprefixer for prefixing styles
gem 'autoprefixer-rails'

# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'

# Use CoffeeScript for .coffee assets and views
gem 'coffee-rails'

# See https://github.com/rails/execjs#readme for more supported runtimes
gem 'libv8', '~> 7.3'
gem 'mini_racer', '~> 0.2.15'

# Use jquery as the JavaScript library
gem 'jquery-rails'

# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder'

# bundle exec rake doc:rails generates the API under doc/api.
gem 'sdoc', group: :doc

# Use Unicorn as the app server
# gem 'unicorn'

# Use puma as the app server.
gem 'puma', '~> 3.12'

gem 'faraday'
gem 'faraday_middleware'

gem 'awrence' # convert snake_case hash keys to CamelCase hash keys
gem 'bootstrap3-datetimepicker-rails'
gem 'breadcrumbs_on_rails'
gem 'builder'
gem 'carmen', '~>1.0.2'  # countries and subdivisions
gem 'factory_bot_rails'
gem 'faker'
gem 'figaro'
gem 'font-awesome-rails'
gem 'jquery-ui-rails'	# for $(document).tooltip()
gem 'json-schema'
gem 'kaminari'
gem 'momentjs-rails' # js lib for dates
gem 'pundit'

gem 'nokogiri-diff', '~> 0.2.0' # for comparing xml documents

gem 'activerecord-import' # bulk insertion of data

gem 'activerecord-session_store'
gem 'ruby-saml', '>= 1.7.0'

gem 'libxml-to-hash', git: 'https://github.com/johannesthoma/libxml-to-hash'
gem 'multi_xml'

gem 'whenever', require: false

gem 'aasm'

gem 'browser'

# collections metadata preview
# run this command to work from a local copy of the gem's repo
# bundle config local.cmr_metadata_preview /path/to/local/git/repository
# make sure to delete the local config when done making changes to merge into master
# bundle config --delete local.cmr_metadata_preview
gem 'cmr_metadata_preview', git: 'https://git.earthdata.nasa.gov/scm/cmr/cmr_metadata_preview.git', ref: 'a63c41cadfa'


group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug'

  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  # gem 'spring'

  # gem 'jshint'
  gem 'rspec-rails'
  gem 'sqlite3'
  gem 'vcr'
  gem 'rails-controller-testing' # https://www.ombulabs.com/blog/rails/upgrades/upgrade-rails-from-4-2-to-5-0.html
end

group :development do
  # Access an IRB console on exception pages or by using <%= console %> in views
  # Outdated because version 4.0 removed rails 5 support
  gem 'web-console'

  # better error handling
  gem 'better_errors'
  gem 'binding_of_caller'

  # Keep that code clean, folks!
  gem 'rubocop'
end

group :test do
  gem 'capybara'
  gem 'capybara-screenshot'
  gem 'fuubar'
  gem 'launchy'
  gem 'rack_session_access'
  gem 'rspec_junit_formatter'
  gem 'selenium-webdriver'
  gem 'simplecov', require: false
  gem 'webdrivers'
end

group :production do
  gem 'pg'
end
