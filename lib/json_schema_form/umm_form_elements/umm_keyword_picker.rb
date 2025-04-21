module JsonSchemaForm
  module UmmFormElements
    # UmmScienceKeywordPicker is used for a nested item picker
    # populated with Science Keywords

    # :nodoc:
    class UmmKeywordPicker < UmmFormElement
      KEYWORD_LEVELS = [].freeze

      def default_value
        []
      end

      def keyword_type
        'default'
      end

      # Return whether or not this element has a stored value
      def value?
        Array.wrap(element_value).reject(&:empty?).any?
      end

      def render_markup
        content_tag(:section) do
          # Currently selected values
          concat render_keyword_list(element_value)

          # The picker
          concat render_keyword_picker

          # Add Keyword button that displays below the picker
          button_options = {
            'classes'     => "eui-btn--blue add-#{keyword_type}-keyword",
            'button_text' => 'Add Keyword',
            'disabled'    => true
          }
          button_options['data'] = { 'field-prefix' => json_form.options['field_prefix'] } if json_form.options.key?('field_prefix')

          button = UmmButton.new(form_section_json: parsed_json, json_form: json_form, schema: schema, options: button_options)

          concat content_tag(:div, button.render_markup, class: 'actions')
        end
      end

      def render_keyword_picker
        content_tag(:div, class: 'eui-nested-item-picker') do
          concat(content_tag(:ul, class: 'eui-item-path') do
            content_tag(:li, link_to("#{keyword_type.titleize} Keyword", 'javascript:void(0);'), class: 'list-title')
          end)

          concat(content_tag(:div, class: 'eui-item-list-pane') do
            content_tag(:ul) do
              content_tag(:li) do
                text_field_tag("#{keyword_type}-keyword-search", nil, name: nil, class: 'typeahead', placeholder: 'Search for keywords...')
              end
            end
          end)
        end
      end

      def keyword_string(keywords)
        keywords.map { |_key, value| value }.join(' > ')
      end

      def render_hidden_validation_element
        # Element that holds all attributes for a hidden input that is used for form validation within its data attributes
        concat content_tag(:span, nil, element_properties(schema_fragment).deep_merge(id: "empty_#{idify_property_name}", data: { id: idify_property_name, name: keyify_property_name }))
      end
    end
  end
end
