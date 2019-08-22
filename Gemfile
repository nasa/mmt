source 'https://rubygems.org'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~>4.2.11'

# deployment support
gem 'sprockets', '~> 2.12'

# Use SCSS for stylesheets
gem 'bourbon'
gem 'neat'
gem 'sass-rails', '~> 5.0'

# Use Autoprefixer for prefixing styles
gem 'autoprefixer-rails'

# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'

# Use CoffeeScript for .coffee assets and views
gem 'coffee-rails', '~> 4.1.0'

# See https://github.com/rails/execjs#readme for more supported runtimes
gem 'therubyracer', platforms: :ruby

# Use jquery as the JavaScript library
gem 'jquery-rails'

# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.0'

# bundle exec rake doc:rails generates the API under doc/api.
gem 'sdoc', '~> 0.4.0', group: :doc

# Use Unicorn as the app server
gem 'unicorn'

gem 'faraday'
gem 'faraday_middleware', '<= 0.9.0'

gem 'awrence' # convert snake_case hash keys to CamelCase hash keys
gem 'bootstrap3-datetimepicker-rails'
gem 'breadcrumbs_on_rails'
gem 'builder'
gem 'carmen' # countries and subdivisions
gem 'database_cleaner' # added to provide a solution to Capybara's problems with js=>true
gem 'factory_girl_rails'
gem 'faker'
gem 'figaro'
gem 'font-awesome-rails'
gem 'jquery-ui-rails'	# for $(document).tooltip()
gem 'json-schema'
gem 'kaminari'
gem 'momentjs-rails' # js lib for dates
gem 'pundit'

gem 'activerecord-import' # bulk insertion of data

gem 'activerecord-session_store'
gem 'ruby-saml', '>= 1.7.0'

gem 'libxml-to-hash', git: 'https://github.com/johannesthoma/libxml-to-hash'
gem 'multi_xml'

gem 'whenever', require: false

# collections metadata preview
# run this command to work from a local copy of the gem's repo
# bundle config local.cmr_metadata_preview /path/to/local/git/repository
# make sure to delete the local config when done making changes to merge into master
# bundle config --delete local.cmr_metadata_preview
gem 'cmr_metadata_preview', git: 'https://git.earthdata.nasa.gov/scm/cmr/cmr_metadata_preview.git', ref: '03072e2c727'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug'

  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  # gem 'spring'

  gem 'jshint'
  gem 'rspec-rails'
  gem 'sqlite3'
  gem 'vcr'
end

group :development do
  # Access an IRB console on exception pages or by using <%= console %> in views
  gem 'web-console', '~> 2.0'

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
