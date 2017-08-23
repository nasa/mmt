# :nodoc:
module ManageMetadataHelper
  def display_entry_id(metadata, type)
    short_name = if type.include? 'collection'
                   metadata['ShortName'] || '<Blank Short Name>'
                 elsif type.include? 'variable'
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
    elsif controller.lookup_context.prefixes.include?('manage_variables') || controller.lookup_context.prefixes.include?('variable_drafts')
      'manage_variables'
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
    when controller_name.include?('variable') || controller.lookup_context.prefixes.include?('manage_variables')
      'variables'
    else
      # default
      'collections'
    end
  end
end
