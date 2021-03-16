module PreviewCirclesHelper
  FORM_FIELDS = {
    'metadata_information' => {
      'MetadataLanguage' => {
        required: false,
        anchor: 'metadata-language'
      },
      'MetadataDates' => {
        required: false,
        anchor: 'metadata-dates'
      }
    },
    'collection_information' => {
      'ShortName' => {
        required: true,
        anchor: 'collection-information'
      },
      'Version' => {
        required: true,
        anchor: 'collection-information'
      },
      'VersionDescription' => {
        required: false,
        anchor: 'collection-information'
      },
      'EntryTitle' => {
        required: true,
        anchor: 'collection-information'
      },
      'DOI' => {
        required: false,
        anchor: 'collection-information'
      },
      'Abstract' => {
        required: true,
        anchor: 'collection-information'
      },
      'Purpose' => {
        required: false,
        anchor: 'collection-information'
      },
      'DataLanguage' => {
        required: false,
        anchor: 'collection-information'
      }
    },
    'data_centers' => {
      'DataCenters' => {
        required: true,
        anchor: 'data-centers'
      }
    },
    'data_contacts' => {
      'DataContacts' => {
        required: false,
        anchor: 'data-contacts'
      }
    },
    'data_identification' => {
      'DataDates' => {
        required: false,
        anchor: 'data-dates'
      },
      'CollectionDataType' => {
        required: false,
        anchor: 'collection-data-type'
      },
      'ProcessingLevel' => {
        required: true,
        anchor: 'processing-level'
      },
      'CollectionProgress' => {
        required: true,
        anchor: 'collection-progress'
      },
      'Quality' => {
        required: false,
        anchor: 'quality'
      },
      'UseConstraints' => {
        required: false,
        anchor: 'use-constraints'
      },
      'AccessConstraints' => {
        required: false,
        anchor: 'access-constraints'
      },
      'MetadataAssociations' => {
        required: false,
        anchor: 'metadata-associations'
      },
      'PublicationReferences' => {
        required: false,
        anchor: 'publication-references'
      }
    },
    'collection_citations' => {
      'CollectionCitations' => {
        required: false,
        anchor: 'collection-citation'
      }
    },
    'descriptive_keywords' => {
      'ScienceKeywords' => {
        required: true,
        anchor: 'science-keywords'
      },
      'AncillaryKeywords' => {
        required: false,
        anchor: 'ancillary-keywords'
      },
      'AdditionalAttributes' => {
        required: false,
        anchor: 'additional-attributes'
      }
    },
    'related_urls' => {
      'RelatedUrls' => {
        required: false,
        anchor: 'related-urls'
      }
    },
    'temporal_information' => {
      'TemporalExtents' => {
        required: true,
        anchor: 'temporal-extents'
      },
      'TemporalKeywords' => {
        required: false,
        anchor: 'temporal-keywords'
      },
      'PaleoTemporalCoverages' => {
        required: false,
        anchor: 'paleo-temporal-coverages'
      }
    },
    'spatial_information' => {
      'SpatialExtent' => {
        required: true,
        anchor: 'spatial-extent'
      },
      'TilingIdentificationSystems' => {
        required: false,
        anchor: 'tiling-identification-system'
      },
      'SpatialInformation' => {
        required: false,
        anchor: 'spatial-representation-information'
      },
      'LocationKeywords' => {
        required: false,
        anchor: 'location-keywords'
      }
    },
    'acquisition_information' => {
      'Platforms' => {
        required: true,
        anchor: 'platforms'
      },
      'Projects' => {
        required: false,
        anchor: 'projects'
      }
    },
    'archive_and_distribution_information' => {
      'FileArchiveInformation' => {
        required: true,
        anchor: 'file-archive-information'
      },
      'FileDistributionInformation' => {
        required: true,
        anchor: 'file-distribution-information'
      },
      'DirectDistributionInformation' => {
        required: false,
        anchor: 'direct-distribution-information'
      }
    }
  }

  def form_circle(form_name, metadata, errors)
    circle = "<i class='eui-icon eui-fa-circle-o icon-green'><span class='is-invisible'>#{form_name.titleize} is incomplete</span></i>"

    if !metadata.empty? && errors
      page_errors = errors.select { |error| error[:page] == form_name }
      error_fields = page_errors.map { |error| error[:top_field] }

      valid = true
      FORM_FIELDS[form_name].each do |field, options|
        if field == 'DataContacts'
          valid = false unless error_fields.blank?
        elsif form_name == 'archive_and_distribution_information'
          valid = archive_and_distribution_valid_check(metadata, errors)
        elsif metadata[field].nil?
          valid = false if options[:required]
        elsif error_fields.include?(field)
          valid = false
        end
      end

      circle = "<i class='eui-icon eui-check icon-green'><span class='is-invisible'>#{form_name.titleize} is valid</i>" if valid
    end

    circle
  end

  def preview_circles(form_name, draft, errors)
    circles = []
    page_errors = Array.wrap(errors).select { |error| error[:page] == form_name }
    error_fields = page_errors.map { |error| error[:top_field] }

    FORM_FIELDS[form_name].each do |field, options|
      circle = complete_circle(field, draft, form_name, options[:anchor], options[:required])

      if field == 'DataContacts'
        circle = data_contacts_circle(field, draft, form_name, options, circle, error_fields)
      # we want DirectDistributionInformation to be evaluated like a normal fieldset unlike File Archive/Distribution Information
      elsif form_name == 'archive_and_distribution_information' && field != 'DirectDistributionInformation'
        circle = archive_and_distribution_circle(field, draft, form_name, options, circle, errors)
      elsif draft.draft[field].nil?
        circle = empty_circle(field, draft, form_name, options[:anchor], options[:required])
      elsif error_fields.include?(field)
        circle = invalid_circle(field, draft, form_name, options[:anchor])
      end

      circles << circle
    end

    circles
  end

  def empty_circle(field, draft, form_name, anchor, required)
    icon = required ? 'eui-icon eui-required-o icon-green' : 'eui-icon eui-fa-circle-o icon-grey'
    text = required ? "#{name_to_title(field)} - Required" : name_to_title(field)
    link_to "<i class=\"#{icon} #{anchor}\"></i> <span class=\"is-invisible\">#{text}</span>".html_safe, send("edit_#{resource_name}_path", draft, form_name, anchor: anchor), title: text
  end

  def complete_circle(field, draft, form_name, anchor, required)
    icon = required ? 'eui-icon eui-required icon-green' : 'eui-icon eui-fa-circle icon-grey'
    text = required ? "#{name_to_title(field)} - Required field complete" : name_to_title(field)
    link_to "<i class=\"#{icon} #{anchor}\"></i> <span class=\"is-invisible\">#{text}</span>".html_safe, send("edit_#{resource_name}_path", draft, form_name, anchor: anchor), title: text
  end

  def invalid_circle(field, draft, form_name, anchor)
    text = "#{name_to_title(field)} - Invalid"
    link_to "<i class=\"eui-icon eui-fa-minus-circle icon-red #{anchor}\"></i> <span class=\"is-invisible\">#{name_to_title(field)} Invalid</span>".html_safe, send("edit_#{resource_name}_path", draft, form_name, anchor: anchor), title: text
  end

  def data_contacts_circle(field, draft, form_name, options, circle, error_fields)
    if draft_all_data_contacts_array(draft.draft).blank?
      circle = empty_circle(field, draft, form_name, options[:anchor], options[:required])
    elsif !error_fields.blank?
      circle = invalid_circle(field, draft, form_name, options[:anchor])
    end
    circle
  end

  def archive_and_distribution_valid_check(metadata, errors)
    archive_exist = metadata.key?('ArchiveAndDistributionInformation') && !metadata['ArchiveAndDistributionInformation']['FileArchiveInformation'].blank?
    distribution_exist = metadata.key?('ArchiveAndDistributionInformation') && !metadata['ArchiveAndDistributionInformation']['FileDistributionInformation'].blank?
    valid = true
    if !metadata.empty? && errors
      error_fields = errors.map { |error| error[:top_field] }
      # because DirectDistributionInformation contributes to the state of the form circle for Archive and Distribution Information, it must be checked as well
      if error_fields.include?('ArchiveAndDistributionInformation') || error_fields.include?('DirectDistributionInformation')
        valid = false
      end
    end
    (archive_exist || distribution_exist) && valid
  end

  def archive_and_distribution_circle(field, draft, form_name, options, circle, errors)
    metadata = draft.draft
    field_exist = metadata.key?('ArchiveAndDistributionInformation') && !metadata['ArchiveAndDistributionInformation'][field].blank?

    error_fields = []
    errors.each { |error| error_fields << error[:field] << error[:parent_field] }

    field_valid = !(field_exist && error_fields.include?(field))

    other_field = field == 'FileArchiveInformation' ? 'FileDistributionInformation' : 'FileArchiveInformation'

    if field_exist
      circle = invalid_circle(field, draft, form_name, options[:anchor]) unless field_valid
    else
      required = !archive_and_distribution_sub_field_exist_and_valid(other_field, draft, errors)
      circle = empty_circle(field, draft, form_name, options[:anchor], required)
    end
    circle
  end

  def archive_and_distribution_sub_field_exist_and_valid(field, draft, errors)
    metadata = draft.draft
    field_exist = metadata.key?('ArchiveAndDistributionInformation') && !metadata['ArchiveAndDistributionInformation'][field].blank?
    field_valid = true
    error_fields = errors.map { |error| error[:field] }
    error_fields += errors.map { |error| error[:parent_field]}
    if field_exist
      field_valid = false if error_fields.include?(field)
    end
    field_exist && field_valid
  end

  # These methods are for setting single preview circles that are not tied to
  # metadata schema forms or fields

  def single_form_circle(form_name, valid)
    # Default classes
    classes = %w[eui-icon icon-green]

    # Add the class that will define the final appearance of the circle and determine the invisible text
    if valid
      valid_text = 'valid'
      classes << 'eui-check'
    else
      valid_text = 'incomplete'
      classes << 'eui-fa-circle-o'
    end

    # Generate the actual content tag to return to the view
    content_tag(:i, class: classes.join(' ')) do
      content_tag(:span, class: 'is-invisible') do
        "#{form_name.titleize} is #{valid_text}"
      end
    end
  end

  def single_preview_circle(link, anchor, status)
    # currently this is only used for a required field, but it can be used for
    # not required fields, that would just need to be passed in and handled

    # Default classes
    classes = ['eui-icon', 'icon-green', anchor]

    case status
    when 'complete'
      classes << 'eui-required'
    when 'empty'
      classes << 'eui-required-o'
    end

    text = "#{anchor.titleize} - Required"

    icon = content_tag(:i, class: classes.join(' ')) do
             content_tag(:span, class: 'is-invisible') do
               text
             end
           end

    link_to icon, link, title: text
  end
end
