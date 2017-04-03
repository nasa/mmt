# :nodoc:
module ProviderContextRedirector
  extend ActiveSupport::Concern

  routes = Rails.application.routes.url_helpers

  # Add any redirects we want to customize here, e.g., if the "index" action
  # for a given path is "/provider_orders", we will redirect to the '/orders'
  # path.
  ROUTE_EXCEPTIONS = {
    'manage_cmr'      => routes.manage_cmr_path,
    'pages'           => routes.manage_metadata_path,
    'provider_orders' => routes.orders_path
  }.freeze

  def get_redirect_route(original_route)
    # Get the controller name from the original path
    controller_name = Rails.application.routes.recognize_path(original_route)[:controller]

    # Return the user to the "index" action of the original controller they were on,
    # unless it's in the exception list.
    ROUTE_EXCEPTIONS.include?(controller_name) ? ROUTE_EXCEPTIONS[controller_name] : url_for(action: 'index', controller: controller_name)
  rescue ActionController::UrlGenerationError
    # If we missed any route exceptions fallback to manage metadata
    Rails.application.routes.url_helpers.manage_metadata_path
  end
end
