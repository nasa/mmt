module JsonSchemaForm
  module UmmPreviewElements
    # Renders a (Related) URL card
    # :nodoc:
    class UmmPreviewUrl < UmmPreviewElement
      def render
        capture do
          render_preview_link_to_draft_form unless draft_id.nil?

          type = "#{related_url? ? 'related-' : ''}url"

          concat(content_tag(:ul, class: "#{type}-cards cards") do
            Array.wrap(element_value).each_with_index do |metadata, index|
              concat(content_tag(:li, class: 'card') do
                concat render_card_header(metadata)
                concat render_card_body(metadata, index)
              end)
            end
          end)
        end
      end

      def render_card_header(metadata)
        content_tag(:div, class: 'card-header') do
          concat content_tag(:h5, url_content_type(metadata), title: url_content_type(metadata), class: 'card-header-title')
          concat(content_tag(:span, class: 'card-header-badge ocean-blue') do
            concat content_tag(:i, nil, class: 'eui-icon eui-fa-link')
          end)
        end
      end

      def render_card_body(metadata, index)
        content_tag(:div, class: 'card-body active') do
          concat(content_tag(:div, class: 'card-body-details-full') do
            concat content_tag(:p, metadata['Description']) if metadata['Description']
            concat(get_url(metadata))
            concat(content_tag(:ul, class: 'arrow-tag-group-list') do
              concat content_tag(:li, url_type(metadata), class: 'arrow-tag-group-item') if url_type(metadata)
              concat content_tag(:li, url_subtype(metadata), class: 'arrow-tag-group-item') if url_subtype(metadata)
            end)
            if metadata['Format'] || metadata['MimeType']
              concat(content_tag(:p, class: 'spaced-content') do
                concat content_tag(:span, metadata['Format']) if metadata['Format']
                concat content_tag(:span, metadata['MimeType']) if metadata['MimeType']
              end)
            end
          end)
        end
      end

      private

      def url_content_type(metadata)
        metadata.fetch('URLContentType', 'Related URL')
      end

      def url_type(metadata)
        metadata['Type']
      end

      def url_subtype(metadata)
        metadata['Subtype']
      end

      def url?
        key == 'URL'
      end

      def related_url?
        !url?
      end

      def get_url(metadata)
        if url? && metadata['URLValue']
          link_to metadata['URLValue'], metadata['URLValue'], title: url_content_type(metadata)
        elsif related_url? && metadata['URL']
          link_to metadata['URL'], metadata['URL'], title: url_content_type(metadata)
        else
          'URL Not Provided'
        end
      end
    end
  end
end
