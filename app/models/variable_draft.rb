# :nodoc:
class VariableDraft < Draft
  before_save :set_searchable_fields

  delegate :forms, to: :class

  class << self
    def forms
      []
    end

    def create_from_variable(variable, user, native_id)
      draft = VariableDraft.find_or_initialize_by(native_id: native_id)
      draft.entry_title = variable['LongName']
      draft.short_name = variable['Name']
      draft.user = user
      draft.provider_id = user.provider_id
      draft.draft = variable
      draft.save
      draft
    end
  end

  def display_short_name
    short_name || '<Blank Name>'
  end

  def display_entry_title
    entry_title || '<Untitled Variable Record>'
  end

  def set_searchable_fields
    self.short_name = draft['Name']
    self.entry_title = draft['LongName']
  end
end
