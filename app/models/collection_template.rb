class CollectionTemplate < Template
  DRAFT_FORMS = %w(
    collection_information
    data_identification
    related_urls
    descriptive_keywords
    acquisition_information
    temporal_information
    spatial_information
    data_centers
    data_contacts
    collection_citations
    metadata_information
    archive_and_distribution_information
  )

  class << self
    def create_template(draft, user, name)
      template = CollectionTemplate.new do |temp|
        temp.draft = draft.draft
        temp.user = user
        temp.entry_title = draft.entry_title
        temp.template_name = name
        temp.provider_id = user.provider_id
        temp.short_name = draft.short_name
      end
      template.save
      template
    end

    def forms
      DRAFT_FORMS
    end

    def get_next_form(name, direction)
      delta = direction == 'Next' ? 1 : -1
      index = DRAFT_FORMS.index(name)
      DRAFT_FORMS[index + delta] || DRAFT_FORMS.first
    end
  end
end
