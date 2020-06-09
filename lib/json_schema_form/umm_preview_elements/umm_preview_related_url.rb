# Renders a Related URL card
# Also used for URL

# :nodoc:
class UmmPreviewRelatedURL < UmmPreviewElement
  def render
    capture do
      render_preview_link_to_draft_form unless draft_id.nil?

      concat(content_tag(:ul, class: 'related-url-card cards') do
        Array.wrap(element_value).each_with_index do |related_url, index|
          concat(content_tag(:li, class: 'card') do
            concat render_card_header(related_url)
            concat render_card_body(related_url, index)
          end)
        end
      end)
    end
  end

  def render_card_header(related_url)
    content_tag(:div, class: 'card-header') do
      concat content_tag(:h5, url_content_type(related_url), title: url_content_type(related_url), class: 'card-header-title')
      concat(content_tag(:span, class: 'card-header-badge ocean-blue') do
        concat content_tag(:i, nil, class: 'eui-icon eui-fa-link')
      end)
    end
  end

  def render_card_body(related_url, index)
    content_tag(:div, class: 'card-body active') do
      concat(content_tag(:div, class: 'card-body-details-full') do
        concat content_tag(:p, related_url['Description']) if related_url['Description']

        concat(if related_url['URL']
                 link_to related_url['URL'], related_url['URL'], title: url_content_type(related_url)
               else
                 'Not provided'
               end)

        concat(content_tag(:ul, class: 'arrow-tag-group-list') do
          if ['GET SERVICE', 'GET DATA'].include? url_type(related_url)
            concat content_tag(:li, url_type(related_url), class: 'arrow-tag-group-item')
            concat content_tag(:li, url_subtype(related_url), class: 'arrow-tag-group-item') if url_subtype(related_url)
          elsif url_subtype(related_url)
            concat content_tag(:li, url_subtype(related_url), class: 'arrow-tag-group-item')
          elsif url_type(related_url)
            concat content_tag(:li, url_type(related_url), class: 'arrow-tag-group-item')
          end
        end)
      end)
    end
  end

  private

  def url_content_type(related_url)
    related_url.fetch('URLContentType', 'Related URL')
  end

  def url_type(related_url)
    related_url['Type']
  end

  def url_subtype(related_url)
    related_url['Subtype']
  end

  def is_url?
    key == "URL"
  end

  def is_related_url?
    !is_url?
  end
end
