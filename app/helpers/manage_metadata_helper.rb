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
end
