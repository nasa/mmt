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
      'EntryTitle' => {
        required: true,
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
    'organizations' => {
      'Organizations' => {
        required: true,
        anchor: 'organizations'
      }
    },
    'personnel' => {
      'Personnel' => {
        required: false,
        anchor: 'personnel'
      }
    },
    'data_identification' => {
      'DataDates' => {
        required: true,
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
        required: false,
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
    'distribution_information' => {
      'RelatedUrls' => {
        required: true,
        anchor: 'relateui-urls'
      },
      'Distributions' => {
        required: false,
        anchor: 'distributions'
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
      'PaleoTemporalCoverage' => {
        required: false,
        anchor: 'paleo-temporal-coverage'
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
      'SpatialKeywords' => {
        required: false,
        anchor: 'spatial-keywords'
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
        if metadata[field].nil?
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

      if draft.draft[field].nil?
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
    link_to "<i class=\"#{icon}\"></i> <span class=\"is-invisible\">#{text}</span>".html_safe, draft_edit_form_path(draft, form_name, anchor: anchor), title: text
  end

  def complete_circle(field, draft, form_name, anchor, required)
    icon = required ? 'eui-required icon-green' : 'eui-icon eui-fa-circle icon-grey'
    text = required ? "#{name_to_title(field)} - Required field complete" : name_to_title(field)
    link_to "<i class=\"#{icon}\"></i> <span class=\"is-invisible\">#{text}</span>".html_safe, draft_edit_form_path(draft, form_name, anchor: anchor), title: text
  end

  def invalid_circle(field, draft, form_name, anchor)
    text = "#{name_to_title(field)} - Invalid"
    link_to "<i class=\"eui-icon eui-fa-minus-circle icon-red\"></i> <span class=\"is-invisible\">#{name_to_title(field)} Invalid</span>".html_safe, draft_edit_form_path(draft, form_name, anchor: anchor), title: text
  end
end
