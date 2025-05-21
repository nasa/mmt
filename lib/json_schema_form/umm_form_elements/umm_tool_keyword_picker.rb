module JsonSchemaForm
  module UmmFormElements
    # UmmToolKeywordPicker for v1.0 is essentially the same as UmmServiceKeywordPicker
    # with minor modifications because it is populated with the same set of
    # Service Keywords. This is supposed to change in the future.

    # :nodoc
    class UmmToolKeywordPicker < UmmKeywordPicker
      KEYWORD_LEVELS = %w(
        ToolCategory
        ToolTopic
        ToolTerm
        ToolSpecificTerm
      ).freeze

      def keyword_type
        'tool'
      end

      def render_keyword_list(object)
        content_tag(:div, class: "selected-#{keyword_type}-keywords #{keyword_type}-keywords") do
          concat(content_tag(:ul) do
            Array.wrap(object).each_with_index do |keyword, index|
              concat(content_tag(:li) do
                concat keyword_string(keyword)

                remove_link = UmmRemoveLink.new(form_section_json: parsed_json, json_form: json_form, schema: schema, options: { name: keyword })
                concat remove_link.render_markup

                concat hidden_field_tag("#{keyify_property_name}[#{index}][tool_category]", keyword.fetch('ToolCategory', ''))
                concat hidden_field_tag("#{keyify_property_name}[#{index}][tool_topic]", keyword.fetch('ToolTopic', ''))
                concat hidden_field_tag("#{keyify_property_name}[#{index}][tool_term]", keyword.fetch('ToolTerm', ''))
                concat hidden_field_tag("#{keyify_property_name}[#{index}][tool_specific_term]", keyword.fetch('ToolSpecificTerm', ''))
              end)
            end
          end)

          render_hidden_validation_element
        end
      end
    end
  end
end