# :nodoc:
module ManageMetadataHelper
  def breadcrumb_name(metadata, type)
    short_name = if type.downcase.include? 'collection'
                   metadata['ShortName'] || '<Blank Short Name>'
                 elsif type.downcase.include? 'variable'
                   metadata['Name'] || '<Blank Name>'
                 elsif type.downcase.include? 'service'
                   metadata['Name'] || '<Blank Name>'
                 end

    version = metadata.fetch('Version', '')
    version = "_#{version}" unless version.empty?

    short_name + version
  end

  def current_manage_title
    if controller.lookup_context.prefixes.include?('search')
      "manage_#{resource_type}"
    elsif controller.lookup_context.prefixes.include?('manage_cmr')
      'manage_cmr'
    elsif controller.lookup_context.prefixes.include?('manage_variables') || controller.lookup_context.prefixes.include?('variable_drafts') || controller.lookup_context.prefixes.include?('collection_associations')
      'manage_variables'
    elsif controller.lookup_context.prefixes.include?('manage_services') || controller.lookup_context.prefixes.include?('service_drafts')
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
    else
      # default
      'collections'
    end
  end

  def display_header_subtitle(metadata, type)
    if type.downcase.include? 'variable'
      metadata['LongName'] || 'Long Name Not Provided'
    else
      # Future services name
    end
  end
end
