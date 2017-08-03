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
      },
      'DirectoryNames' => {
        required: false,
        anchor: 'directory-names'
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
end
