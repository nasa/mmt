# :nodoc:
module ManageMetadataHelper
  def breadcrumb_name(metadata, type)
    short_name = if type.include? 'collection'
                   metadata['ShortName'] || '<Blank Short Name>'
                 elsif type.include? 'variable'
                   metadata['Name'] || '<Blank Name>'
                 end

    version = metadata.fetch('Version', '')
    version = "_#{version}" unless version.empty?

    short_name + version
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
