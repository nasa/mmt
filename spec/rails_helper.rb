require 'simplecov'

SimpleCov.start 'rails' do
  # Filter out files that aren't part of the actual app code
  # Local CMR files
  add_filter '/lib/test_cmr/'
  add_filter '/lib/tasks/local_cmr.rake'
end

# This file is copied to spec/ when you run 'rails generate rspec:install'
ENV['RAILS_ENV'] ||= 'test'
require 'spec_helper'
require File.expand_path('../../config/environment', __FILE__)
require 'rspec/rails'
# Add additional requires below this line. Rails is not loaded until this point!

# require "capybara/rails"
# require 'capybara/rspec'
require 'selenium/webdriver'
require 'rack_session_access/capybara'
require 'capybara-screenshot/rspec'

require 'rake'
require 'rails/tasks'

# Specs flagged with `js: true` will use Capybara's JS driver.
Capybara.register_driver :headless_chrome do |app|
  # set timeout to 60s http://www.testrisk.com/2016/05/change-default-timeout-and-wait-time-of.html
  # need to use read_timeout and open_timeout https://github.com/SeleniumHQ/selenium/blob/master/rb/lib/selenium/webdriver/remote/http/default.rb
  client = Selenium::WebDriver::Remote::Http::Default.new
  client.read_timeout = 60
  client.open_timeout = 60

  # http://technopragmatica.blogspot.com/2017/10/switching-to-headless-chrome-for-rails_31.html
  capabilities = Selenium::WebDriver::Options.chrome(
    # This makes javascript console logs available, but doesn't cause them to appear in real time
    # to display javascript logs in the rspec output, add `puts page.driver.browser.manage.logs.get(:browser)`
    # in the desired test location
    'goog:loggingPrefs': { browser: 'ALL', client: 'ALL', driver: 'ALL', server: 'ALL' }
  )

  # disable-gpu option is temporarily necessary, possibly only for Windows
  # https://developers.google.com/web/updates/2017/04/headless-chrome#cli
  # no-sandbox was necessary for another application's Docker container for CI/CD
  # https://about.gitlab.com/2017/12/19/moving-to-headless-chrome/
  # https://developers.google.com/web/updates/2017/04/headless-chrome#faq
  options = Selenium::WebDriver::Chrome::Options.new(
    args: %w[headless disable-gpu --disable-dev-shm-usage no-sandbox --window-size=1440,1080 --enable-features=NetworkService,NetworkServiceInProcess]
    # args: %w[headless disable-gpu no-sandbox --window-size=1920,1080 --enable-features=NetworkService,NetworkServiceInProcess]
  )

  Capybara::Selenium::Driver.new(app, browser: :chrome, http_client: client, options: options)
end

# setting up regular chrome driver, so it can be used if desired to see the
# browser running the tests
# https://robots.thoughtbot.com/headless-feature-specs-with-chrome
Capybara.register_driver :chrome do |app|
  Capybara::Selenium::Driver.new(app, browser: :chrome)
end

# setting headless_chrome as default driver, can be changed to run not headless
Capybara.javascript_driver = :headless_chrome

# because we are calling the driver a different name than the standard :selenium
# we need to register it with capybara screenshot
# https://github.com/mattheworiordan/capybara-screenshot/issues/211
Capybara::Screenshot.register_driver(:headless_chrome) do |driver, path|
  driver.browser.save_screenshot(path)
end

# until we update to Rails 5+, we won't need to use puma, but need to specify a different server
# https://github.com/two-pack/redmine_auto_assign_group/issues/2, https://github.com/rspec/rspec-rails/issues/1882
Capybara.server = :webrick

# Requires supporting ruby files with custom matchers and macros, etc, in
# spec/support/ and its subdirectories. Files matching `spec/**/*_spec.rb` are
# run as spec files by default. This means that files in spec/support that end
# in _spec.rb will both be required and run as specs, causing the specs to be
# run twice. It is recommended that you do not name files matching this glob to
# end with _spec.rb. You can configure this pattern with the --pattern
# option on the command line or in ~/.rspec, .rspec or `.rspec-local`.
#
# The following line is provided for convenience purposes. It has the downside
# of increasing the boot-up time by auto-requiring all files in the support
# directory. Alternatively, in the individual `*_spec.rb` files, manually
# require only the support files necessary.
Dir[Rails.root.join('spec/support/**/*.rb')].each { |f| require f }

# Checks for pending migrations before tests are run.
# If you are not using ActiveRecord, you can remove this line.
ActiveRecord::Migration.maintain_test_schema!

RSpec.configure do |config|
  config.before(:suite) do
    # Output some env information
    puts "Ruby Version:  #{`ruby --version`}"
    puts "Rails Version: #{Rails.version}"
  end

  Capybara.default_max_wait_time = (ENV['CAPYBARA_WAIT_TIME'] || 15).to_i

  config.use_transactional_fixtures = true
  # Rails 5 appears to support transactional fixtures for Capybara.
  # If this regresses, the old solution was taken from: http://stackoverflow.com/questions/8178120/capybara-with-js-true-causes-test-to-fail
  # https://github.com/rails/rails/pull/19282

  # Catch all requests, specific examples are still caught using their specific cassettes
  config.around(:each) do |spec|
    VCR.use_cassette('global', record: :none) do
      VCR.use_cassette('echo_soap/provider_names', record: :none) do
        spec.run
      end
    end
  end

  # Clear the test provider, MMT_2, before running tests
  # only if the test is tagged with reset_provider: true
  config.before(:all) do
    if self.class.metadata[:reset_provider]
      Rake.application.rake_require 'tasks/local_cmr'
      Rake::Task.define_task(:environment)
      Rake::Task['cmr:reset_test_provider'].reenable

      Rake.application.invoke_task 'cmr:reset_test_provider[MMT_2]'

      wait_for_cmr
    end
  end
  config.after(:all) do
    if self.class.metadata[:reset_provider]
      Rake.application.rake_require 'tasks/local_cmr'
      Rake::Task.define_task(:environment)
      Rake::Task['cmr:reset_test_provider'].reenable

      Rake.application.invoke_task 'cmr:reset_test_provider[MMT_2]'

      wait_for_cmr
    end
  end

  config.append_after(:each) do
    Capybara.reset_sessions!
  end

  config.after(:suite) do
    Helpers::Instrumentation.report_performance
  end

  # Remove this line if you're not using ActiveRecord or ActiveRecord fixtures
  config.fixture_paths = [ Rails.root.join("spec", "fixtures") ]

  # If you're not using ActiveRecord, or you'd prefer not to run each of your
  # examples within a transaction, remove the following line or assign false
  # instead of true.
  # config.use_transactional_fixtures = true # commented out due to http://stackoverflow.com/questions/8178120/capybara-with-js-true-causes-test-to-fail

  # RSpec Rails can automatically mix in different behaviours to your tests
  # based on their file location, for example enabling you to call `get` and
  # `post` in specs under `spec/controllers`.
  #
  # You can disable this behaviour by removing the line below, and instead
  # explicitly tag your specs with their type, e.g.:
  #
  #     RSpec.describe UsersController, :type => :controller do
  #       # ...
  #     end
  #
  # The different available types are documented in the features, such as in
  # https://relishapp.com/rspec/rspec-rails/docs
  config.infer_spec_type_from_file_location!

  # Randomize the order of the tests
  config.order = :sorted

  # Helpers
  config.include Helpers::AjaxHelpers
  config.include Helpers::ApprovedProposalsHelpers
  config.include Helpers::BulkUpdateHelper
  config.include Helpers::CmrHelper
  config.include Helpers::CollectionAssociationHelper
  config.include Helpers::ConceptHelper
  config.include Helpers::ConfigurationHelpers
  config.include Helpers::ControllerHelpers
  config.include Helpers::DataMigrationHelper
  config.include Helpers::DateHelpers
  config.include Helpers::DraftHelpers
  config.include Helpers::EchoHelper
  config.include Helpers::GroupHelper
  config.include Helpers::IngestHelpers
  config.include Helpers::Instrumentation
  config.include Helpers::ProposalStatusHelper
  config.include Helpers::SearchHelpers
  config.include Helpers::SubscriptionsHelpers
  config.include Helpers::UmmSDraftHelpers
  config.include Helpers::UmmTDraftHelpers
  config.include Helpers::UserHelpers
  config.include Helpers::TagsHelpers
  config.include Helpers::ValidationHelpers

  # Inclusion filter, uncomment line below to run only tests with `focus: true`
  # config.filter_run_including :focus => true

  # Precompile assets before running the test suite
  # config.before(:suite) do
  #   Rails.application.load_tasks
  #   Rake::Task["assets:precompile"].invoke
  # end
end
