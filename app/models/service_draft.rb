# :nodoc:
class ServiceDraft < Draft
  before_save :set_searchable_fields

  delegate :forms, to: :class

  class << self
    def forms
      []
    end

    def create_from_service(service, user, native_id)
      if native_id
        # Edited record
        draft = ServiceDraft.find_or_initialize_by(native_id: native_id)
        draft.entry_title = service['LongName']
        draft.short_name = service['Name']
      else
        # Cloned Record
        draft = ServiceDraft.new
        service.delete('Name')
        service.delete('LongName')
      end

      draft.user = user
      draft.provider_id = user.provider_id
      draft.draft = service
      draft.save
      draft
    end
  end

  def display_short_name
    short_name || '<Blank Name>'
  end

  def display_entry_title
    entry_title || '<Untitled Service Record>'
  end

  def set_searchable_fields
    self.short_name = draft['Name']
    self.entry_title = draft['LongName']
  end
end
