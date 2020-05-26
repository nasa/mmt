# :nodoc:
class ToolDraft < Draft
  delegate :forms, to: :class

  after_save :set_metadata_specification

  class << self
    def forms
      []
    end

    # TODO: for cloning or editing published records
    # def create_from_tool(tool, user, native_id)
    #   if native_id
    #     # Edited record
    #     draft = self.find_or_initialize_by(native_id: native_id)
    #     draft.entry_title = tool['LongName']
    #     draft.short_name = tool['Name']
    #   else
    #     # Cloned Record
    #     draft = self.new
    #     tool.delete('Name')
    #     tool.delete('LongName')
    #   end
    #
    #   draft.set_user_and_provider(user)
    #   draft.draft = tool
    #   draft.save
    #   draft
    # end
  end

  def display_short_name
    short_name || '<Blank Name>'
  end

  def display_entry_title
    entry_title || '<Untitled Tool Record>'
  end

  private

  def set_metadata_specification
    # this is a hidden fieldset added to UMM-T to document the metadata version
    # and specs that should be autopopulated
    # we should try to populate these values from the schema enums
  end
end
