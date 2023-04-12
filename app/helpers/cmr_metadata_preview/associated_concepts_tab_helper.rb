module CmrMetadataPreview
  module AssociatedConceptsTabHelper

    def display_associated_concepts(is_mmt:, additional_information:, concept_type:)
      concepts = additional_information&.fetch(concept_type, [])
      if concepts.is_a?(Array) && concepts.present? && concepts[0].key?('meta') && concepts[0].key?('umm')
        url_for_button = application_url(root_url: additional_information['root_url'], is_mmt: is_mmt, is_dmmt: additional_information['is_dmmt'], concept_type: concept_type)
        render_concept_cards(concepts: concepts, button_url: url_for_button, concept_type: concept_type)
      else
        "This collection does not have any associated #{concept_type} at this time."
      end
    end

    def render_concept_cards(concepts:, button_url:, concept_type:)
      capture do
        concat(content_tag(:div, class: 'row') do
          concat(content_tag(:ul, class: 'preview-gem-cards') do
            Array.wrap(concepts).each_with_index do |concept, index|
              concat(content_tag(:li, class: "preview-gem-card col-8 #{"is-hidden show-more-#{concept_type.singularize}" if index > 2}") do
                concat render_card_header(concept: concept, button_url: button_url, index: index, concept_type: concept_type.singularize)
                concat render_card_body(concept: concept)
              end)
            end
            if concepts.length > 3
              concat(content_tag(:a, 'Show More', href: '#', class: 'show-more-toggle col-8', data: { parent_class: '.preview-gem-cards', list_item: ".show-more-#{concept_type.singularize}" }))
              concat(content_tag(:a, 'Show Less', href: '#', class: 'show-less-toggle is-hidden col-8', data: { parent_class: '.preview-gem-cards', list_item: ".show-more-#{concept_type.singularize}" }))
            end
          end)
        end)
      end
    end

    def render_card_header(concept:, button_url:, index:, concept_type:)
      capture do
        title = html_escape(concept.dig('umm','Name'))
        url = html_escape(button_url + concept.dig('meta', 'concept-id'))
        valid_url = validate_url(html_escape(concept.dig('umm', 'URL', 'URLValue')))

        content_tag(:div, class: 'preview-gem-card-header') do
          # This section should be updated when we have resolved the url_for
          # overwrite in CMR
          if valid_url
            concat(content_tag(:a, title, title: title, class: 'preview-gem-card-header-title', href: valid_url))
          else
            concat(content_tag(:p, title, title: title, class: 'preview-gem-card-header-title'))
          end
          concat(content_tag(:a, "View #{concept_type.singularize.capitalize} Record", title: "View #{concept_type.singularize.capitalize} Record", class: 'eui-btn--blue', href: url))
        end
      end
    end

    def render_card_body(concept:)
      capture do
        concat(content_tag(:div, class: 'preview-gem-card-body active') do
          concat(content_tag(:div, class: 'preview-gem-card-body-details-full') do
            concat(content_tag(:span, 'Type: ', class: 'list-item-label'))
            concat(content_tag(:span, concept.dig('umm', 'Type').to_s))
            concat(content_tag(:p))
            concat(content_tag(:span, 'Description: ', class: 'list-item-label'))
            concat(content_tag(:span, concept.dig('umm', 'Description').to_s))
          end)
        end)
      end
    end

    # returns concepts show page in mmt or the concepts search in cmr
    def application_url(root_url:, is_mmt:, is_dmmt:, concept_type:)
      is_mmt && !is_dmmt ? "#{root_url}#{concept_type}/" : "#{root_url}concepts/"
    end

    def validate_url(url)
      begin
        url if URI.parse(url).scheme
      rescue URI::InvalidURIError
        nil
      end
    end
  end
end
