module JsonSchemaForm
  module UmmFormElements
    # :nodoc:
    class UmmTextarea < UmmFormElement
      def render_markup
        text_area_tag(keyify_property_name, text_value, element_properties(schema_fragment))
      end
    end
  end
end