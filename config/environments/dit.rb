Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # Code is not reloaded between requests.
  config.cache_classes = true

  # Eager load code on boot. This eager loads most of Rails and
  # your application in memory, allowing both threaded web servers
  # and those relying on copy on write to perform better.
  # Rake tasks automatically ignore this option for performance.
  config.eager_load = true

  # Full error reports are disabled and caching is turned on.
  config.consider_all_requests_local       = false
  config.action_controller.perform_caching = true

  # Enable Rack::Cache to put a simple HTTP cache in front of your application
  # Add `rack-cache` to your Gemfile before enabling this.
  # For large-scale production use, consider using a caching reverse proxy like
  # NGINX, varnish or squid.
  # config.action_dispatch.rack_cache = true

  # Disable serving static files from the `/public` folder by default since
  # Apache or NGINX already handles this.
  config.serve_static_files = ENV['RAILS_SERVE_STATIC_FILES'].present?

  # Compress JavaScripts and CSS.
  config.assets.js_compressor = Uglifier.new(harmony: true)
  # config.assets.css_compressor = :sass

  # Do not fallback to assets pipeline if a precompiled asset is missed.
  config.assets.compile = false

  # Asset digests allow you to set far-future HTTP expiration dates on all assets,
  # yet still be able to expire them through the digest params.
  config.assets.digest = true

  # `config.assets.precompile` and `config.assets.version` have moved to config/initializers/assets.rb

  # Specifies the header that your server uses for sending files.
  # config.action_dispatch.x_sendfile_header = 'X-Sendfile' # for Apache
  # config.action_dispatch.x_sendfile_header = 'X-Accel-Redirect' # for NGINX

  # Force all access to the app over SSL, use Strict-Transport-Security, and use secure cookies.
  config.force_ssl = true

  # Use the lowest log level to ensure availability of diagnostic information
  # when problems arise.
  config.log_level = :debug

  # Prepend all log lines with the following tags.
  # config.log_tags = [ :subdomain, :uuid ]

  # Use a different logger for distributed setups.
  # config.logger = ActiveSupport::TaggedLogging.new(SyslogLogger.new)

  # Use a different cache store in production.
  # config.cache_store = :mem_cache_store

  # https://github.com/ankane/secure_rails against host header injection
  config.action_controller.default_url_options = { host: ENV['default_url'] }

  # Enable serving of images, stylesheets, and JavaScripts from an asset server.
  config.action_controller.asset_host = ENV['default_url']

  # Ignore bad email addresses and do not raise email delivery errors.
  # Set this to true and configure the email server for immediate delivery to raise delivery errors.
  # config.action_mailer.raise_delivery_errors = false
  config.action_mailer.default_url_options = { host: ENV['default_url'], protocol: 'https' }
  # This domain has been configured to pass DMARC authentication.  Changing to a
  # domain which has not been will cause gmail to reject our e-mails
  config.default_email_domain = 'earthdata.nasa.gov'

  # Enable locale fallbacks for I18n (makes lookups for any locale fall back to
  # the I18n.default_locale when a translation cannot be found).
  config.i18n.fallbacks = true

  # Send deprecation notices to registered listeners.
  config.active_support.deprecation = :notify

  # Use default logging formatter so that PID and timestamp are not suppressed.
  config.log_formatter = ::Logger::Formatter.new

  # Do not dump schema after migrations.
  config.active_record.dump_schema_after_migration = false

  # default host for url helpers
  Rails.application.routes.default_url_options[:host] = ENV['default_url']

  # Feature Toggle for groups
  config.groups_enabled = true

  # Feature Toggle for bulk updates
  config.bulk_updates_enabled = true

  # Feature Toggle for invite uses
  config.invite_users_enabled = false

  # Feature Toggle for UMM-S
  config.umm_s_enabled = true

  # Feature Toggle for UMM-Var Generation
  config.uvg_enabled = false

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
  config.gkr_enabled = false if ENV['proposal_mode'] == 'true'

  config.cmr_env = 'dit'
  config.echo_env = 'dit'
  config.urs_register_url = 'https://uat.urs.earthdata.nasa.gov/users/new'

  config.tophat_url = 'https://cdn.uat.earthdata.nasa.gov/tophat2/tophat2.js'

  config.colorize_logging = false

  # Google Tag Manager ID for EOSDIS usage stats
  config.tag_manager_id = 'GTM-WNP7MLF'

  config.cmr_email_frequency = ENV['cmr_email_frequency']&.to_i || 3600
end
