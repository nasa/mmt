# :nodoc:
class ServiceDraft < Draft
  delegate :forms, to: :class

  before_save :set_metadata_specification

  class << self
    def forms
      []
    end

    def create_from_service(service, user, native_id, concept_id=nil)
      if native_id
        # Edited record
        draft = self.find_or_initialize_by(native_id: native_id)
        draft.entry_title = service['LongName']
        draft.short_name = service['Name']
      else
        # Cloned Record
        draft = self.new
        service.delete('Name')
        service.delete('LongName')
      end

      draft.set_user_and_provider(user)
      draft.draft = service
      draft.save
      draft
    end
  end

  private

  def schema_file_path
    File.join(Rails.root, 'lib', 'assets', 'schemas', 'services', 'umm-s-json-schema.json')
  end
end
