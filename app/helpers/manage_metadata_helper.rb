module ManageMetadataHelper
  def display_entry_id(metadata, type)
    blank_short_name = type == 'draft' ? '<Blank Short Name>' : 'New Collection'
    short_name = metadata['ShortName'] || blank_short_name

    version = metadata['Version'].nil? ? '' : "_#{metadata['Version']}"

    entry_id = short_name + version
    entry_id
  end
end
