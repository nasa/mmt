Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports and disable caching.
  config.consider_all_requests_local       = true

  # Enable/disable caching. By default caching is disabled.
  if Rails.root.join('tmp/caching-dev.txt').exist?
    config.action_controller.perform_caching = true

    config.cache_store = :memory_store
    config.public_file_server.headers = {
      'Cache-Control' => 'public, max-age=172800'
    }
  else
    config.action_controller.perform_caching = false
    config.cache_store = :null_store
  end
  # https://github.com/ankane/secure_rails against host header injection
  # Next two properties should be uncommented if your testing X-Forward-Host protection
  # config.action_controller.default_url_options = {host: 'mmt.localtest.earthdata.nasa.gov', port: '3000'}
  # config.action_controller.asset_host = 'http://mmt.localtest.earthdata.nasa.gov:3000'

  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = true
  config.action_mailer.default_url_options = { host: 'localhost', port: '3000' }
  config.action_mailer.perform_deliveries = false
  config.action_mailer.perform_caching = false

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error = :page_load

  # Debug mode disables concatenation and preprocessing of assets.
  # This option may cause significant delays in view rendering with a large
  # number of complex assets.
  config.assets.debug = true

  # Asset digests allow you to set far-future HTTP expiration dates on all assets,
  # yet still be able to expire them through the digest params.
  config.assets.digest = true

  # Adds additional error checking when serving assets at runtime.
  # Checks for improperly declared sprockets dependencies.
  # Raises helpful error messages.
  config.assets.raise_runtime_errors = true

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

  config.cmr_env = 'sit'
  config.echo_env = 'sit'
  config.urs_register_url = 'https://sit.urs.earthdata.nasa.gov/users/new'

  config.tophat_url = 'https://cdn.sit.earthdata.nasa.gov/tophat2/tophat2.js'

  # These settings are necessary for dMMT and MMT to talk in dev, but are
  # inconvienent because cache_classes means you have to reboot rails to see
  # code changes.
  if ENV['webrick_monkey_patch_enabled'] == 'true'
    config.cache_classes = true
    config.eager_load = true
  end
end
