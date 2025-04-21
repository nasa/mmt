module JsonSchemaForm
  module UmmFormElements
    # :nodoc:
    class UmmTextField < UmmFormElement
      def render_markup
        text_field_tag(keyify_property_name, text_value, element_properties(schema_fragment))
      end
    end
  end
end
