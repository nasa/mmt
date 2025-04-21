module JsonSchemaForm
  module UmmFormElements
    # UmmScienceKeywordPicker is used for a nested item picker
    # populated with Science Keywords

    # :nodoc:
    class UmmScienceKeywordPicker < UmmKeywordPicker
      KEYWORD_LEVELS = %w(
        Category
        Topic
        Term
        VariableLevel1
        VariableLevel2
        VariableLevel3
        DetailedVariable
      ).freeze

      def keyword_type
        'science'
      end

      def render_keyword_list(object)
        content_tag(:div, class: "selected-#{keyword_type}-keywords #{keyword_type}-keywords") do
          concat(content_tag(:ul) do
            Array.wrap(object).each_with_index do |keyword, index|
              concat(content_tag(:li) do
                concat keyword_string(keyword)

                remove_link = UmmRemoveLink.new(form_section_json: parsed_json, json_form: json_form, schema: schema, options: { name: keyword })
                concat remove_link.render_markup

                concat hidden_field_tag("#{keyify_property_name}[#{index}][category]", keyword.fetch('Category', ''))
                concat hidden_field_tag("#{keyify_property_name}[#{index}][topic]", keyword.fetch('Topic', ''))
                concat hidden_field_tag("#{keyify_property_name}[#{index}][term]", keyword.fetch('Term', ''))
                concat hidden_field_tag("#{keyify_property_name}[#{index}][variable_level_1]", keyword.fetch('VariableLevel1', ''))
                concat hidden_field_tag("#{keyify_property_name}[#{index}][variable_level_2]", keyword.fetch('VariableLevel2', ''))
                concat hidden_field_tag("#{keyify_property_name}[#{index}][variable_level_3]", keyword.fetch('VariableLevel3', ''))
                concat hidden_field_tag("#{keyify_property_name}[#{index}][detailed_variable]", keyword.fetch('DetailedVariable', ''))
              end)
            end
          end)

          render_hidden_validation_element
        end
      end
    end
  end
end
