Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # The test environment is used exclusively to run your application's
  # test suite. You never need to work with it otherwise. Remember that
  # your test database is "scratch space" for the test suite and is wiped
  # and recreated between test runs. Don't rely on the data there!
  config.cache_classes = true

  # Do not eager load code on boot. This avoids loading your whole application
  # just for the purpose of running a single test. If you are using a tool that
  # preloads Rails for running tests, you may have to set it to true.
  config.eager_load = true

  # Configure public file server for tests with Cache-Control for performance.
  config.public_file_server.enabled = true
  config.public_file_server.headers = {
    'Cache-Control' => "public, max-age=#{1.hour.to_i}"
  }

  # Show full error reports and disable caching.
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = false

  # Raise exceptions instead of rendering exception templates.
  config.action_dispatch.show_exceptions = true

  # Disable request forgery protection in test environment.
  config.action_controller.allow_forgery_protection = false

  # Store uploaded files on the local file system in a temporary directory
  config.active_storage.service = :test

  config.action_mailer.perform_caching = false

  # Tell Action Mailer not to deliver emails to the real world.
  # The :test delivery method accumulates sent emails in the
  # ActionMailer::Base.deliveries array.
  config.action_mailer.delivery_method = :test
  config.action_mailer.default_url_options = { host: 'localhost', port: '3000' }
  config.default_email_domain = 'earthdata.nasa.gov'

  # Randomize the order test cases are executed.
  config.active_support.test_order = :random

  # Print deprecation notices to the stderr.
  config.active_support.deprecation = :stderr

  # Raises error for missing translations
  # config.action_view.raise_on_missing_translations = true

  # default host for url helpers
  Rails.application.routes.default_url_options[:host] = 'https://mmt.localtest.earthdata.nasa.gov'

  # Feature Toggle for groups
  config.groups_enabled = true

  # Feature Toggle for bulk updates
  config.bulk_updates_enabled = true

  # Feature Toggle for invite uses
  config.invite_users_enabled = false

  # Feature Toggle for UMM-S
  config.umm_s_enabled = true

  # Feature Toggle for UMM-Var Generation
  config.uvg_enabled = true

  # Feature Toggle for templates
  config.templates_enabled = true

  # Feature toggle for approver workflow in MMT.
  config.mmt_approver_workflow_enabled = true

  # Feature toggle for subscriptions in MMT
  config.subscriptions_enabled = true

  # Feature toggle for Content Security Policy (CSP) logging.
  config.csplog_enabled = false

  # Feature toggle for UMM-T
  config.umm_t_enabled = true

  # Feature toggle for loss report accessibility through 'edit collection' button
  config.loss_report_enabled = true

  # Feature toggle for GKR (GCMD Keyword Recommender) recommendations
  config.gkr_enabled = true

  # Feature toggle for EDL groups
  config.edl_groups_enabled = false
  
  config.cmr_env = 'sit'
  config.echo_env = 'sit'
  config.urs_register_url = 'https://sit.urs.earthdata.nasa.gov/users/new'

  config.middleware.use RackSessionAccess::Middleware

  # config.colorize_logging = false

  config.cmr_email_frequency = ENV['cmr_email_frequency']&.to_i || 3600
end
