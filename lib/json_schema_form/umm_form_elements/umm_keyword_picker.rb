# :nodoc:
class UmmKeywordPicker < UmmFormElement
  KEYWORD_LEVELS = %w(
    Category
    Topic
    Term
    VariableLevel1
    VariableLevel2
    VariableLevel3
    DetailedVariable
  ).freeze

  # Return whether or not this element has a stored value
  def value?
    Array.wrap(element_value).reject(&:empty?).any?
  end

  def render_markup
    content_tag(:section) do
      # Currently selected values
      concat render_keyword_list(form_fragment, element_value)

      # The picker
      concat render_keyword_picker

      # Add Keyword button that displays below the picker
      button_options = {
        'classes'     => 'eui-btn--blue add-science-keyword',
        'button_text' => 'Add Keyword',
        'disabled'    => true
      }
      button_options['data'] = { 'field-prefix' => json_form.options['field_prefix'] } if json_form.options.key?('field_prefix')

      button = UmmButton.new(parsed_json, json_form, schema, button_options)

      concat content_tag(:div, button.render_markup, class: 'actions')
    end
  end

  def render_preview
    capture do
      element_value.each do |keyword|
        concat(content_tag(:ul, class: 'arrow-tag-group-list') do
          KEYWORD_LEVELS.each do |level|
            unless keyword[level].blank?
              concat content_tag(:li, keyword[level], itemprop: 'keyword', class: 'arrow-tag-group-item')
            end
          end
        end)
      end
    end
  end

  def render_keyword_list(element, object)
    content_tag(:div, class: 'selected-science-keywords science-keywords') do
      concat(content_tag(:ul) do
        Array.wrap(object).each_with_index do |keyword, index|
          concat(content_tag(:li) do
            concat keyword_string(keyword)

            remove_link = UmmRemoveLink.new(parsed_json, json_form, schema, name: keyword)
            concat remove_link.render_markup

            concat hidden_field_tag("#{keyify_property_name(element)}[#{index}][category]", keyword.fetch('Category', ''))
            concat hidden_field_tag("#{keyify_property_name(element)}[#{index}][topic]", keyword.fetch('Topic', ''))
            concat hidden_field_tag("#{keyify_property_name(element)}[#{index}][term]", keyword.fetch('Term', ''))
            concat hidden_field_tag("#{keyify_property_name(element)}[#{index}][variable_level_1]", keyword.fetch('VariableLevel1', ''))
            concat hidden_field_tag("#{keyify_property_name(element)}[#{index}][variable_level_2]", keyword.fetch('VariableLevel2', ''))
            concat hidden_field_tag("#{keyify_property_name(element)}[#{index}][variable_level_3]", keyword.fetch('VariableLevel3', ''))
            concat hidden_field_tag("#{keyify_property_name(element)}[#{index}][detailed_variable]", keyword.fetch('DetailedVariable', ''))
          end)
        end
      end)

      concat hidden_field_tag("#{keyify_property_name(element)}[#{Time.now.to_i}]", '')
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
