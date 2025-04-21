module JsonSchemaForm
  module UmmFormElements
    # :nodoc:
    class UmmBoolean < UmmFormElement
      def element_properties(element)
        properties = super(element)

        properties[:class] = properties.fetch(:class, {}).split(' ') - ['full-width']

        properties
      end

      def render_markup
        content_tag(:section, class: 'radio-group-parent', id: idify_property_name) do

          concat(content_tag(:p, class: 'radio-group') do
            concat radio_button_tag(keyify_property_name, true, element_value == true, element_properties(schema_fragment))

            concat label_tag "#{keyify_property_name}_true", 'True'
          end)
          concat(content_tag(:p, class: 'radio-group') do
            concat radio_button_tag(keyify_property_name, false, element_value == false, element_properties(schema_fragment))

            concat label_tag "#{keyify_property_name}_false", 'False'
          end)
        end
      end
    end
  end
end
