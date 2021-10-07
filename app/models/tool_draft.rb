# :nodoc:
class ToolDraft < Draft
  delegate :forms, to: :class

  before_save :set_metadata_specification

  class << self
    def forms
      []
    end

    def create_from_tool(tool, user, native_id, concept_id=nil)
      if native_id
        # Edited record
        draft = self.find_or_initialize_by(native_id: native_id)
        draft.entry_title = tool['LongName']
        draft.short_name = tool['Name']
      else
        # Cloned Record
        draft = self.new
        tool.delete('Name')
        tool.delete('LongName')
      end

      draft.set_user_and_provider(user)
      draft.draft = tool
      draft.save
      draft
    end
  end

  private

  def set_metadata_specification
    # this is a hidden fieldset added to UMM-T to document the metadata version
    # TODO: we should try to populate these values from the schema enums

    metadata_specification = {
      'URL' => 'https://cdn.earthdata.nasa.gov/umm/tool/v1.1',
      'Name' => 'UMM-T',
      'Version' => '1.1'
    }

    unless self.draft['MetadataSpecification'] == metadata_specification
      self.draft['MetadataSpecification'] = metadata_specification
    end
  end
end
