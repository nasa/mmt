Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # Precompile assets before running the test suite
  # config.assets.compress = true
  # config.action_controller.asset_host = 'http://localhost:3000'
  # config.assets.digest = false
  # config.assets.prefix = '/test_assets'

  # The test environment is used exclusively to run your application's
  # test suite. You never need to work with it otherwise. Remember that
  # your test database is "scratch space" for the test suite and is wiped
  # and recreated between test runs. Don't rely on the data there!
  config.cache_classes = true

  # eager load on boot to avoid a Rails hang when using mmt/dmmt in the same rails app
  # as we do in testing.
  config.eager_load = true

  # Configure public file server for tests with Cache-Control for performance.
  config.public_file_server.enabled = true
  config.public_file_server.headers = {
    'Cache-Control' => "public, max-age=#{1.hour.seconds.to_i}"
  }
  # Configure static file server for tests with Cache-Control for performance.
  config.serve_static_files   = true
  config.static_cache_control = 'public, max-age=3600'

  # Show full error reports and disable caching.
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = false

  # Raise exceptions instead of rendering exception templates.
  config.action_dispatch.show_exceptions = true

  # Disable request forgery protection in test environment.
  config.action_controller.allow_forgery_protection = false
  config.action_mailer.perform_caching = false

  # Tell Action Mailer not to deliver emails to the real world.
  # The :test delivery method accumulates sent emails in the
  # ActionMailer::Base.deliveries array.
  config.action_mailer.delivery_method = :test
  config.action_mailer.default_url_options = { host: 'localhost', port: '3000' }

  # Randomize the order test cases are executed.
  config.active_support.test_order = :sorted

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

  config.cmr_env = 'sit'
  config.echo_env = 'sit'
  config.urs_register_url = 'https://sit.urs.earthdata.nasa.gov/users/new'

  config.middleware.use RackSessionAccess::Middleware

  # config.colorize_logging = false
end
