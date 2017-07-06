# :nodoc:
class UmmKeywordPicker < UmmFormElement
  def render_markup
    content_tag(:section) do
      # Currently selected values
      concat render_keyword_list(form_fragment, get_element_value(form_fragment['key']))

      # The picker
      concat render_keyword_picker

      # Add Keyword button that displays below the picker
      button_options = {
        classes: 'eui-btn--blue add-science-keyword',
        button_text: 'Add Keyword',
        disabled: true
      }
      button = UmmButton.new(parsed_json, json_form, schema, button_options)

      concat content_tag(:div, button.render_markup, class: 'actions')
    end
  end

  def render_keyword_list(element, object)
    content_tag(:div, class: 'selected-science-keywords science-keywords') do
      concat(content_tag(:ul) do
        Array.wrap(object).each_with_index do |keyword, index|
          concat(content_tag(:li) do
            concat keyword_string(keyword)

            remove_link = UmmRemoveLink.new(parsed_json, json_form, schema, name: keyword_string(keyword))
            concat remove_link.render_markup

            concat hidden_field_tag("#{keyify_property_name(element)}[#{index}]", keyword_string(keyword))
          end)
        end
      end)

      concat hidden_field_tag("#{keyify_property_name(element)}[]", '')
    end
  end

  def render_keyword_picker
    content_tag(:div, class: 'eui-nested-item-picker') do
      concat(content_tag(:ul, class: 'eui-item-path') do
        content_tag(:li, link_to('Science Keyword', 'javascript:void(0);'), class: 'list-title')
      end)

      concat(content_tag(:div, class: 'eui-item-list-pane') do
        content_tag(:ul) do
          content_tag(:li) do
            text_field_tag('science-keyword-search', nil, name: nil, class: 'typeahead', placeholder: 'Search for keywords...')
          end
        end
      end)
    end
  end

  def keyword_string(keywords)
    keywords.map { |_key, value| value }.join(' > ')
  end
end
