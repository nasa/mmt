# :nodoc:
class VariableDraft < Draft
  delegate :forms, to: :class

  class << self
    def forms
      []
    end

    def create_from_variable(variable, user, native_id, concept_id)
      if native_id
        # Edited record
        draft = self.find_or_initialize_by(native_id: native_id)
        draft.entry_title = variable['LongName']
        draft.short_name = variable['Name']
        draft.collection_concept_id = concept_id
      else
        # Cloned Record
        draft = self.new
        variable.delete('Name')
        variable.delete('LongName')
      end

      draft.set_user_and_provider(user)
      draft.draft = variable
      draft.save
      draft
    end
  end

  # def dummy_concept_id
  #   'C12345-TEST'
  # end

  # def display_short_name
  #   short_name || '<Blank Name>'
  # end
  #
  # def display_entry_title
  #   entry_title || '<Untitled Variable Record>'
  # end
end
