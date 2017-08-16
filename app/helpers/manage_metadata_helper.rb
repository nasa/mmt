# :nodoc:
module ManageMetadataHelper
  def display_entry_id(metadata, type)
    blank_short_name = type == 'draft' ? '<Blank Short Name>' : 'New Collection'
    short_name = metadata['ShortName'] || blank_short_name

    version = metadata['Version'].nil? ? '' : "_#{metadata['Version']}"

    entry_id = short_name + version
    entry_id
  end

  # the resource type for the Search button text based on the controller
  def resource_type
    case
    when controller_name.include?('search')
      @record_type
    when controller_name.include?('collection')
      'collections'
    when controller_name.include?('variable')
      'variables'
    else
      # default
      'collections'
    end
  end
end
