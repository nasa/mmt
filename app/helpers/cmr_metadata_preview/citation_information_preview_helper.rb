module CmrMetadataPreview
  module CitationInformationPreviewHelper

    def display_preview_collection_citation(metadata)
      collection_citations = metadata.fetch('CollectionCitations', [])
      if collection_citations.blank?
        content_tag(:p) do
          concat(content_tag(:span, 'No citation information has been supplied for this collection.  Please contact '))
          concat(link_to('Earthdata Support', 'javascript:void(0)', id: 'earthdata-feedback-modal'))
          concat(content_tag(:span, ' to obtain proper citation information.'))
        end
      else
        content_tag(:div) do
          collection_citations.each do |collection_citation|
            concat(content_tag(:ul) do
              display_citation_list_item_field('Title', collection_citation)
              display_citation_list_item_field('Version', collection_citation)
              display_citation_list_item_field('Creator', collection_citation)
              display_citation_list_item_field('Editor', collection_citation)
              display_citation_list_item_field('Publisher', collection_citation)
              display_citation_list_item_field('ReleaseDate', collection_citation)
              display_citation_list_item_field('OtherCitationDetails', collection_citation)

              online_resource = collection_citation.fetch('OnlineResource', nil)
              if online_resource != nil
                url = online_resource['Linkage']
                display_list_item_with_link(label: 'Linkage', url: url, description: nil, schema_org_parameters: nil) unless url.blank? || url == 'Not provided'
              end
            end)
          end
        end
      end
    end

    def display_citation_list_item_field(field, collection_citation)
      field_value = collection_citation.fetch(field, '')
      unless field_value.blank?
        concat(content_tag(:li) do
          concat(content_tag(:span, "#{field.titleize}: ", class: 'list-item-label'))
          concat(content_tag(:span, field_value))
        end)
      end
    end

    def display_citation_url(metadata)
      citing_urls = parse_related_urls_for_tab(metadata: metadata, type_and_subtype_map: RelatedUrlsPreviewHelper::CITATION_TYPES)

      unless citing_urls.blank?
        content_tag(:ul) do
          citing_urls.each do |citing_url|
            label = citing_url['Subtype']
            url = citing_url.fetch('URL', 'URL Not Provided')
            description = citing_url.fetch('Description', '')
            display_list_item_with_link(label: label, url: url, description: description, schema_org_parameters: nil)
          end
        end
      end
    end

    def display_doi(metadata)
      doi = metadata['DOI']
      if doi
        content_tag(:div, class: 'doi-preview', itemprop: 'identifier', itemtype: 'http://schema.org/PropertyValue', ' itemscope' => '') do
          concat(content_tag(:span, 'DOI', class: 'field-name'))
          if doi['DOI']
            concat(content_tag(:p) do
              concat(content_tag(:meta, nil, itemprop: 'propertyID', content: 'DOI'))
              concat(content_tag(:span, doi['DOI'], itemprop: 'value'))
            end)
            concat(content_tag(:p, doi['Authority']))
          else
            concat(content_tag(:p, doi['MissingReason']))
            concat(content_tag(:p, doi['Explanation']))
          end
        end
      end
    end

    def display_associated_dois(metadata)
      if metadata['AssociatedDOIs']
        content_tag(:div, class: 'associated-dois-preview') do
          concat(content_tag(:span, 'Associated DOIs', class: 'field-name'))
          concat(content_tag(:ul) do
            metadata['AssociatedDOIs'].each do |doi|
              concat(content_tag(:li, class: 'associated-doi-preview', itemtype: 'http://schema.org/PropertyValue', ' itemscope' => '') do
                concat(content_tag(:p, content_tag(:span, doi['DOI'])))
                concat(content_tag(:p, content_tag(:span, doi['Title'])))
                concat(content_tag(:p, content_tag(:span, doi['Authority'])))
                concat(tag.br)
              end)
            end
          end)
        end
      end
    end

  end
end
