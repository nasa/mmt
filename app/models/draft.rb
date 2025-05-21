# Parent class of all draft objects
class Draft < ApplicationRecord
  belongs_to :user

  validates :provider_id, presence: true, if: :provider_required?
  # collection_concept_id is only used for variable drafts, which require a
  # collection for ingest
  validates :collection_concept_id, inclusion: { in: [nil],
    message: "%{attribute} is not allowed for %{model}" }, unless: :is_variable_draft?

  serialize :draft, coder: JSON

  before_create :default_values
  after_create :set_native_id
  before_save :set_searchable_fields

  self.inheritance_column = :draft_type

  def default_values
    self.draft ||= {}
  end

  def set_native_id
    # native_id should not have 'draft'
    self.native_id ||= "mmt_#{record_type}_#{id}"
    save
  end

  def set_user_and_provider(user)
    self.user = user
    self.provider_id = user.provider_id if provider_required?
  end

  def set_searchable_fields
    # CollectionDraft needs to use different keys
    self.short_name = draft['Name']
    self.entry_title = draft['LongName']
  end

  def display_short_name
    blank_name = record_type == 'collection' ? '<Blank Short Name>' : '<Blank Name>'
    short_name || blank_name
  end

  def display_entry_title
    entry_title || "<Untitled #{capital_record_type} Record>"
  end

  private

  def provider_required?
    # provider is required for all drafts
    true
  end

  def record_type
    self.draft_type.underscore.split('_').first
  end

  def capital_record_type
    record_type.capitalize
  end

  def is_variable_draft?
    record_type == 'variable'
  end

  def schema_file_path
    # define this in draft models for the specific metadata type
    nil
  end

  def set_metadata_specification
    # set hidden fieldset values for metadata types that have it defined in
    # the schema, using values from the schema
    # skip if schema_file_path not defined OR not in the schema
    return unless schema_file_path
    file = File.read(schema_file_path)
    parsed_json = JSON.parse(file)
    metadata_specification_type = parsed_json.dig('definitions', 'MetadataSpecificationType', 'properties')
    return unless metadata_specification_type

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
