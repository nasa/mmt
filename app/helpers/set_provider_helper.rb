# :nodoc:
module SetProviderHelper

  routes = Rails.application.routes.url_helpers

  # This map contains routes and route patterns and how they should
  # be redirected when the user switches providers.
  #
  # For example, on the Groups page, if the user is editing, creating,
  # or viewing a group, they will be redirected to the "index" page for groups.
  RedirectMap = {
      # Groups
      '/groups/*/edit' => routes.groups_path,
      '/groups/*' => routes.groups_path,

      # Orders
      '/orders/*' => routes.orders_path,

      # Provider holdings
      '/provider_holdings/*' => routes.provider_holdings_path,

      # Collections
      '/collections/*' => routes.manage_metadata_path,

      # Order Options
      '/order_options/*' => routes.order_options_path,
      '/order_options/*/edit' => routes.order_options_path,

      # Order option assignments
      '/order_option_assignments/*' => routes.order_option_assignments_path,
      '/order_option_assignments/*/edit' => routes.order_option_assignments_path,

      # Order Policies
      '/order_policies/edit' => routes.order_policies_path,
      '/order_policies/*/edit' => routes.order_policies_path,

      # Permissions
      '/permissions/*/edit' => routes.permissions_path,
      '/permissions/*' => routes.permissions_path,

      # DQS
      '/data_quality_summaries/*/edit' => routes.data_quality_summaries_path,
      '/data_quality_summaries/*' => routes.data_quality_summaries_path,

      # DQS Assignments
      '/data_quality_summary_assignments/*/edit' => routes.data_quality_summary_assignments_path,
      '/data_quality_summary_assignments/*' => routes.data_quality_summary_assignments_path,

      # Service entries
      '/service_entries/*/edit' => routes.service_entries_path,
      '/service_entries/*' => routes.service_entries_path,

      # Service options
      '/service_options/*/edit' => routes.service_options_path,
      '/service_options/*' => routes.service_options_path,

      # Service option assignments
      '/service_option_assignments/*/edit' => routes.service_option_assignments_path,
      '/service_option_assignments/*' => routes.service_option_assignments_path,

      # Drafts
      '/drafts/*' => routes.manage_metadata_path
  }

  def get_redirect_route(original_route)
    # Parse out the path
    curr_route = URI::parse(original_route).path

    # Make some regex substitutions so that we can match routes in the map.
    # Examples:
    # /service_entries/12ADD5EB-9213-1FD1-A03E-519C07C2A9B1 ---> service_entries/*
    # /order_options/34920B0B-24B2-E534-32A4-4E6F71857937/edit ---> order_options/*/edit

    curr_route.sub!(/\/(\w+)\/.+?\/edit/, "/\\1/*/edit")
    curr_route.sub!(/\/(\w+)\/.+/, "/\\1/*")
    curr_route.sub!(/\/drafts\/.+/, '/drafts/*')

    SetProviderHelper::RedirectMap.fetch(curr_route, original_route)
  end

end
