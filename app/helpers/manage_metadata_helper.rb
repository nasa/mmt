# :nodoc:
module ManageMetadataHelper

  def current_manage_title
    if controller.lookup_context.prefixes.include?('search')
      "manage_#{resource_type}"
    elsif controller.lookup_context.prefixes.include?('manage_cmr')
      'manage_cmr'
    elsif controller.lookup_context.prefixes.include?('manage_variables') || controller.lookup_context.prefixes.include?('variables') || controller.lookup_context.prefixes.include?('variable_drafts') || (controller.lookup_context.prefixes.include?('collection_associations') && params[:variable_id])
      'manage_variables'
    elsif controller.lookup_context.prefixes.include?('manage_services') || controller.lookup_context.prefixes.include?('services') || controller.lookup_context.prefixes.include?('service_drafts') || (controller.lookup_context.prefixes.include?('collection_associations') && params[:service_id])
      'manage_services'
    else
      # default, including collection drafts and everything under manage collections
      'manage_collections'
    end
  end

  # resource type for the Search button text based on the controller
  def resource_type
    case
    when controller_name.starts_with?('search')
      params[:record_type]
    when controller_name.include?('variable') || controller.lookup_context.prefixes.include?('manage_variables') || controller.lookup_context.prefixes.include?('collection_associations')
      'variables'
    when controller_name.include?('service') || controller.lookup_context.prefixes.include?('manage_services')
      'services'
    else
      # default
      'collections'
    end
  end

  def display_header_subtitle(metadata, type)
    return unless type.downcase.include?('variable') || type.downcase.include?('service')

    metadata['LongName'] || 'Long Name Not Provided'
  end

  def edsc_map_path
    service_configs = Rails.configuration.services
    edsc_root = service_configs['earthdata'][Rails.configuration.cmr_env]['edsc_root']
    "#{edsc_root}/search/map"
  end
end
