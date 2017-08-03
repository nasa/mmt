# :nodoc:
class VariableDraft < Draft
  before_save :set_searchable_fields

  delegate :forms, to: :class

  class << self
    def forms
      []
    end

    def create_from_variable(variable, user, native_id)
      new_long_name = (variable['LongName'].blank? ? nil : variable['LongName'])

      if native_id
        # Editing a record
        draft = VariableDraft.find_or_initialize_by(native_id: native_id)
        draft.entry_title = new_long_name
        draft.short_name = (variable['Name'].blank? ? nil : variable['Name'])
      else
        # Cloned record
        draft = VariableDraft.new
        draft.entry_title = "#{new_long_name} - Cloned"
        draft.short_name = nil
        variable.delete('Name')
      end
      draft.user = user
      draft.provider_id = user.provider_id
      draft.draft = variable
      draft.save
      draft
    end
  end

  def display_entry_title
    entry_title || '<Untitled Variable Record>'
  end

  def set_searchable_fields
    self.short_name = draft['Name']
    self.entry_title = draft['LongName']
  end
end
