# :nodoc:
class ToolDraft < Draft
  delegate :forms, to: :class

  class << self
    def forms
      []
    end

    # TODO: for cloning
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

  # TODO: not sure about this yet
  # def set_searchable_fields
  #   self.short_name = draft['Name']
  #   self.entry_title = draft['LongName']
  # end
end
