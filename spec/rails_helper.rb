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
require 'capybara/poltergeist'
require 'rack_session_access/capybara'
require 'capybara-screenshot/rspec'
require 'database_cleaner'

require 'rake'
require 'rails/tasks'

# Specs flagged with `js: true` will use Capybara's JS driver. Set
# that JS driver to :poltergeist
Capybara.register_driver :poltergeist do |app|
  Capybara::Poltergeist::Driver.new(app, timeout: 1.minute)
end
Capybara.javascript_driver = :poltergeist

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
  # Lines below taken from http://stackoverflow.com/questions/8178120/capybara-with-js-true-causes-test-to-fail
  config.use_transactional_fixtures = false
  config.before do
    DatabaseCleaner.strategy = if Capybara.current_driver == :rack_test
                                 :transaction
                               else
                                 :truncation
                               end

    DatabaseCleaner.start
  end

  config.after do
    DatabaseCleaner.clean
  end
  # End of lines from http://stackoverflow.com/questions/8178120/capybara-with-js-true-causes-test-to-fail

  # Catch all requests, specific examples are still caught using their specific cassettes
  config.around(:each) do |spec|
    VCR.use_cassette('global', record: :once) do
      VCR.use_cassette('groups/page_with_all_URS_users', record: :none) do
        VCR.use_cassette('echo_soap/provider_names') do
          spec.run
        end
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

  config.append_after(:each) do
    Capybara.reset_sessions!
  end

  config.after(:suite) do
    Helpers::Instrumentation.report_performance
  end

  # Remove this line if you're not using ActiveRecord or ActiveRecord fixtures
  config.fixture_path = "#{::Rails.root}/spec/fixtures"

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
  config.order = :random

  # Helpers
  config.include Helpers::AjaxHelpers
  config.include Helpers::CmrHelper
  config.include Helpers::DateHelpers
  config.include Helpers::DraftHelpers
  config.include Helpers::GroupHelper
  config.include Helpers::SearchHelpers
  config.include Helpers::UserHelpers

  # Precompile assets before running the test suite
  # config.before(:suite) do
  #   Rails.application.load_tasks
  #   Rake::Task["assets:precompile"].invoke
  # end
end
