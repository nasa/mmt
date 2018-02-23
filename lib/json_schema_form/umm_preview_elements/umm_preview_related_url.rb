# :nodoc:
class UmmPreviewRelatedURL < UmmPreviewText
  def render
    content_tag(:ul, class: 'related-url-card cards') do
      content_tag(:li, class: 'card') do
        concat render_card_header
        concat render_card_body
      end
    end
  end

  def render_card_header
    content_tag(:div, class: 'card-header') do
      concat content_tag(:h5, url_content_type, title: url_content_type, class: 'card-header-title')
      concat(content_tag(:span, class: 'card-header-badge ocean-blue') do
        concat content_tag(:i, nil, class: 'eui-icon eui-fa-link')
      end)
    end
  end

  def render_card_body
    content_tag(:div, class: 'card-body active') do
      concat(content_tag(:div, class: 'card-body-details-full') do
        concat content_tag(:p, data['Description']) if data['Description']

        concat(if data['URL']
                 link_to data['URL'], data['URL'], title: url_content_type
               else
                 'Not provided'
               end)

        concat(content_tag(:ul, class: 'arrow-tag-group-list') do
          if ['GET SERVICE', 'GET DATA'].include? url_type
            concat content_tag(:li, data['Type'], class: 'arrow-tag-group-item')
            concat content_tag(:li, data['Subtype'], class: 'arrow-tag-group-item') if data['Subtype']
          elsif url_subtype
            concat content_tag(:li, data['Subtype'], class: 'arrow-tag-group-item')
          elsif url_type
            concat content_tag(:li, data['Type'], class: 'arrow-tag-group-item')
          end
        end)
      end)
    end
  end

  private

  def url_content_type
    data.fetch('URLContentType', 'Related URL')
  end

  def url_type
    data['Type']
  end

  def url_subtype
    data['Subtype']
  end
end
