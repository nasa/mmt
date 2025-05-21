module JsonSchemaForm
  module UmmFormElements
    # UmmServiceKeywordPicker is used for a nested item picker
    # populated with Service Keywords

    # :nodoc:
    class UmmServiceKeywordPicker < UmmKeywordPicker
      KEYWORD_LEVELS = %w(
        ServiceCategory
        ServiceTopic
        ServiceTerm
        ServiceSpecificTerm
      ).freeze

      def keyword_type
        'service'
      end

      def render_keyword_list(object)
        content_tag(:div, class: "selected-#{keyword_type}-keywords #{keyword_type}-keywords") do
          concat(content_tag(:ul) do
            Array.wrap(object).each_with_index do |keyword, index|
              concat(content_tag(:li) do
                concat keyword_string(keyword)

                remove_link = UmmRemoveLink.new(form_section_json: parsed_json, json_form: json_form, schema: schema, options: { name: keyword })
                concat remove_link.render_markup

                concat hidden_field_tag("#{keyify_property_name}[#{index}][service_category]", keyword.fetch('ServiceCategory', ''))
                concat hidden_field_tag("#{keyify_property_name}[#{index}][service_topic]", keyword.fetch('ServiceTopic', ''))
                concat hidden_field_tag("#{keyify_property_name}[#{index}][service_term]", keyword.fetch('ServiceTerm', ''))
                concat hidden_field_tag("#{keyify_property_name}[#{index}][service_specific_term]", keyword.fetch('ServiceSpecificTerm', ''))
              end)
            end
          end)

          render_hidden_validation_element
        end
      end
    end
  end
end
