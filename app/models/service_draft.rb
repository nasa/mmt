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

  def set_metadata_specification
    # this is a hidden fieldset added to UMM-S to document the metadata version

    # pulling from the schema enums to populate these values
    file_path = File.join(Rails.root, 'lib', 'assets', 'schemas', 'services', 'umm-s-json-schema.json')
    file = File.read(file_path)
    parsed_json = JSON.parse(file)
    metadata_specification_type = parsed_json['definitions']['MetadataSpecificationType']['properties']
    url_value = metadata_specification_type['URL']['enum'].first
    name_value = metadata_specification_type['Name']['enum'].first
    version_value = metadata_specification_type['Version']['enum'].first

    metadata_specification = {
      'URL' => url_value,
      'Name' => name_value,
      'Version' => version_value
    }

    unless self.draft['MetadataSpecification'] == metadata_specification
      self.draft['MetadataSpecification'] = metadata_specification
    end
  end
end
