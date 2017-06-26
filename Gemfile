source 'https://rubygems.org'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '4.2.7.1'

# deployment support
gem 'sprockets', '~> 2.8'

gem 'faraday'
gem 'faraday_middleware', '<= 0.9.0'
gem 'multi_xml'

# Use SCSS for stylesheets
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

gem 'bourbon'
gem 'neat'
gem 'font-awesome-rails'

gem 'momentjs-rails'
gem 'bootstrap3-datetimepicker-rails'
gem 'breadcrumbs_on_rails'

gem 'faker'

gem 'pundit'

gem 'libxml-to-hash', git: 'https://github.com/johannesthoma/libxml-to-hash'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug'

  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  # gem 'spring'

  gem 'sqlite3'
  gem 'rspec-rails'
  gem 'vcr'
  gem 'jshint'
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
  gem 'poltergeist'
  gem 'rack_session_access'
  gem 'rspec_junit_formatter'
  gem 'simplecov', require: false
end

group :production do
  gem 'pg'
end

gem 'figaro'
gem 'json-schema'
gem 'awrence' # convert snake_case hash keys to CamelCase hash keys
gem 'database_cleaner' # added to provide a solution to Capybara's problems with js=>true
gem 'kaminari'
gem 'carmen' # countries and subdivisions
gem 'factory_girl_rails'
gem 'builder'

# run this command to work from a local copy of the gem's repo
# bundle config local.cmr_metadata_preview /path/to/local/git/repository
# gem 'cmr_metadata_preview', git: 'https://git.earthdata.nasa.gov/scm/cmr/cmr_metadata_preview.git', branch: 'master'
gem 'cmr_metadata_preview', git: 'https://git.earthdata.nasa.gov/scm/cmr/cmr_metadata_preview.git', branch: 'MMT-948'
