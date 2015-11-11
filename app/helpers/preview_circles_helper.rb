module PreviewCirclesHelper
  FORM_FIELDS = {
    'metadata_information' => {
      'MetadataLanguage' => { required: false },
      'MetadataDates' => { required: false }
    },
    'data_identification' => {
      'EntryId' => { required: true },
      'Version' => { required: false },
      'EntryTitle' => { required: true },
      'Abstract' => { required: true },
      'Purpose' => { required: false },
      'DataLanguage' => { required: false },
      'DataDates' => { required: true },
      'Organizations' => { required: true },
      'Personnel' => { required: false },
      'CollectionDataType' => { required: false },
      'ProcessingLevel' => { required: true },
      'CollectionCitations' => { required: false },
      'CollectionProgress' => { required: false },
      'Quality' => { required: false },
      'UseConstraints' => { required: false },
      'AccessConstraints' => { required: false },
      'MetadataAssociations' => { required: false },
      'PublicationReferences' => { required: false }
    },
    'descriptive_keywords' => {
      'ISOTopicCategories' => { required: false },
      'ScienceKeywords' => { required: true },
      'AncillaryKeywords' => { required: false },
      'AdditionalAttributes' => { required: false }
    },
    'distribution_information' => {
      'RelatedUrls' => { required: true },
      'Distributions' => { required: false }
    },
    'temporal_information' => {
      'TemporalExtents' => { required: true },
      'TemporalKeywords' => { required: false },
      'PaleoTemporalCoverage' => { required: false }
    },
    'spatial_information' => {
      'SpatialExtent' => { required: true },
      'TilingIdentificationSystem' => { required: false },
      'SpatialInformation' => { required: false },
      'SpatialKeywords' => { required: false }
    },
    'acquisition_information' => {
      'Platforms' => { required: true },
      'Projects' => { required: false }
    }
  }

  def form_circle(form_name, metadata, errors)
    circle = '<i class="fa fa-circle-thin icon-green"></i>'

    if errors
      page_errors = errors.select { |error| error[:page] == form_name }
      error_fields = page_errors.map { |error| error[:top_field] }

      valid = true
      FORM_FIELDS[form_name].each do |field, options|
        if metadata[field].nil?
          valid = false if options[:required]
        elsif error_fields.include?(field)
          valid = false
        end
      end

      circle = '<i class="fa fa-check-circle icon-green"></i>' if valid
    end

    circle
  end

  def preview_circles(form_name, draft, errors)
    circles = []
    page_errors = Array.wrap(errors).select { |error| error[:page] == form_name }
    error_fields = page_errors.map { |error| error[:top_field] }

    FORM_FIELDS[form_name].each do |field, options|
      circle = complete_circle(field, draft, form_name, options[:required])

      if draft.draft[field].nil?
        circle = empty_circle(field, draft, form_name, options[:required])
      elsif error_fields.include?(field)
        circle = invalid_circle(field, draft, form_name)
      end

      circles << circle
    end

    circles
  end

  def empty_circle(field, draft, form_name, required)
    icon = required ? 'icon-green' : 'icon-grey'
    link_to "<i class=\"fa fa-circle-o #{icon}\"></i>".html_safe, draft_edit_form_path(draft, form_name), title: field
  end

  def complete_circle(field, draft, form_name, required)
    icon = required ? 'icon-green' : 'icon-grey'
    link_to "<i class=\"fa fa-circle #{icon}\"></i>".html_safe, draft_edit_form_path(draft, form_name), title: field
  end

  def invalid_circle(field, draft, form_name)
    link_to '<i class="fa fa-minus-circle icon-red"></i>'.html_safe, draft_edit_form_path(draft, form_name), title: field
  end
end
