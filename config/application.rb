require_relative 'boot'

require 'rails/all'
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
require "sprockets/railtie"
require './app/middleware/middleware_healthcheck'
# require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Mmt
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.2

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de

    # Do not swallow errors in after_commit/after_rollback callbacks.
    # config.active_record.raise_in_transactional_callbacks = true

    # Custom directories with classes and modules you want to be autoloadable.
    # config.autoload_paths += Dir["#{config.root}/lib", "#{config.root}/lib/**/"]
    # config.eager_load_paths += Dir["#{config.root}/lib", "#{config.root}/lib/**/"]
    config.autoload_paths += ["#{config.root}/lib"]
    config.eager_load_paths += ["#{config.root}/lib"]


    # This was added when MMT added custom error routes and pages
    config.exceptions_app = self.routes

    config.services = YAML.load_file(Rails.root.join('config/services.yml'), aliases: true)

    # Versions of UMM for the different metadata types MMT is on

    config.umm_c_version = 'vnd.nasa.cmr.umm+json; version=1.17.3'
    config.umm_var_version = 'vnd.nasa.cmr.umm+json; version=1.9.0'
    config.umm_s_version = 'vnd.nasa.cmr.umm+json; version=1.4'
    config.umm_t_version = 'vnd.nasa.cmr.umm+json; version=1.1'

    config.order_option_label = 'Order Option'
    config.order_option_version = '1.0.0'
    config.order_option_url = 'https://cdn.earthdata.nasa.gov/generics/order-option/v1.0.0'

    config.data_quality_summary_label = 'Data Quality Summary'
    config.data_quality_summary_version = '1.0.0'
    config.data_quality_summary_url = 'https://cdn.earthdata.nasa.gov/generics/data-quality-summary/v1.0.0'

    config.support_email = 'support@earthdata.nasa.gov'

    # Is this the Proposal Mode version of MMT?
    config.proposal_mode = false
    config.proposal_mode = true if ENV['proposal_mode'] == 'true'

    config.middleware.insert_after Rails::Rack::Logger, MiddlewareHealthcheck

    # Default timeout waiting for local CMR to be ready is 15 minutes
    config.cmr_startup_timeout = !ENV['cmr_startup_timeout'].blank? ? ENV['cmr_startup_timeout'] : 900

    # Launchpad Session Cookie name
    config.launchpad_cookie_name = 'SBXSESSION'
    config.launchpad_cookie_name = 'SMSESSION' if ENV['launchpad_production'] == 'true'

    # Launchpad Metadata
    config.launchpad_metadata_url = 'https://auth.launchpad-sbx.nasa.gov/unauth/metadata/launchpad-sbx.idp.xml'
    config.launchpad_metadata_url = 'https://auth.launchpad.nasa.gov/unauth/metadata/launchpad.idp.xml' if ENV['launchpad_production'] == 'true'

    # Caches user information in orders for the specified period of time
    config.orders_user_cache_expiration = 15.minutes

    # Make `form_with` generate non-remote forms.
    config.action_view.form_with_generates_remote_forms = false

    # Store boolean values are in sqlite3 databases as 1 and 0 instead of 't' and
    # 'f' after migrating old data.

    # Don't require `belongs_to` associations by default. In Rails 5 default was changed to true.
    config.active_record.belongs_to_required_by_default = false

    def load_version
      version_file = "#{config.root}/version.txt"
      if File.exist?(version_file)
        return IO.read(version_file)
      elsif File.exist?('.git/config') && `which git`.size > 0
        version = `git rev-parse --short HEAD`
        return version
      end
      '(unknown)'
    end

    config.react.server_renderer_extensions = ["jsx", "js", "tsx", "ts"]
    config.version = load_version

    # Log request UUID so we can track requests across threaded log messages
    config.log_tags = [:uuid]

  end
end
