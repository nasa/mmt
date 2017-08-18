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

  # resource type for determining which 'Manage' title is underlined in the header
  # and the resource type for the Search button text based on the controller
  def resource_type
    case
    when controller_name.starts_with?('search')
      @record_type
    when controller_name.include?('variable')
      'variables'
    else
      # default
      'collections'
    end
  end
end
