Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false
  ##############################################################################
  # need cache_classes to be true when trying to access the manage proposals   #
  # page in dev, but it should generally be false for ease of development on   #
  # any other page                                                             #
  ##############################################################################

  # eager load on boot to avoid a Rails hang when using mmt/dmmt in the same rails app
  # as we do in testing.
  config.eager_load = true

  # Show full error reports and disable caching.
  config.consider_all_requests_local = true

  # Enable/disable caching. By default caching is disabled.
  # Run rails dev:cache to toggle caching.
  if Rails.root.join('tmp', 'caching-dev.txt').exist?
    config.action_controller.perform_caching = true

    config.cache_store = :memory_store
    config.public_file_server.headers = {
      'Cache-Control' => "public, max-age=#{2.days.seconds.to_i}"
    }
  else
    config.action_controller.perform_caching = false
    config.cache_store = :null_store
  end

  # Store uploaded files on the local file system (see config/storage.yml for options)
  config.active_storage.service = :local

  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = true
  config.action_mailer.default_url_options = { host: 'localhost', port: '3000' }
  config.action_mailer.perform_deliveries = false
  config.action_mailer.perform_caching = false
  config.default_email_domain = 'earthdata.nasa.gov'

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error = :page_load

  # Highlight code that triggered database queries in logs.
  config.active_record.verbose_query_logs = true

  # Debug mode disables concatenation and preprocessing of assets.
  # This option may cause significant delays in view rendering with a large
  # number of complex assets.
  config.assets.debug = true

  # Suppress logger output for asset requests.
  config.assets.quiet = true
  # Asset digests allow you to set far-future HTTP expiration dates on all assets,
  # yet still be able to expire them through the digest params.
  config.assets.digest = true

  # Adds additional error checking when serving assets at runtime.
  # Checks for improperly declared sprockets dependencies.
  # Raises helpful error messages.
  config.assets.raise_runtime_errors = true

  # Use the lowest log level to ensure availability of diagnostic information
  # when problems arise.
  config.log_level = :debug

  # Raises error for missing translations
  # config.action_view.raise_on_missing_translations = true

  # Use an evented file watcher to asynchronously detect changes in source code,
  # routes, locales, etc. This feature depends on the listen gem.
  # config.file_watcher = ActiveSupport::EventedFileUpdateChecker
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
  config.csplog_enabled = true

  # Feature toggle for UMM-T
  config.umm_t_enabled = true

  # Feature toggle for loss report accessibility through 'edit collection' button
  config.loss_report_enabled = true

  # Feature toggle for GKR (GCMD Keyword Recommender) recommendations
  config.gkr_enabled = true

  # Feature toggle for EDL groupdl
  config.edl_groups_enabled = false

  config.cmr_env = 'sit'
  config.echo_env = 'sit'
  config.urs_register_url = 'https://sit.urs.earthdata.nasa.gov/users/new'

  config.tophat_url = 'https://cdn.sit.earthdata.nasa.gov/tophat2/tophat2.js'

  config.cmr_email_frequency = ENV['cmr_email_frequency']&.to_i || 3600
end
