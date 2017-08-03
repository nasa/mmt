# :nodoc:
class UmmBoolean < UmmFormElement
  def render_markup
    content_tag(:section) do
      concat(content_tag(:span, class: 'radio-group') do
        concat radio_button_tag(keyify_property_name(form_fragment), true, element_value == true, element_properties(schema_fragment))

        concat label_tag "#{keyify_property_name(form_fragment)}_TRUE", 'True'
      end)
      concat(content_tag(:span, class: 'radio-group') do
        concat radio_button_tag(keyify_property_name(form_fragment), false, element_value == false, element_properties(schema_fragment))

        concat label_tag "#{keyify_property_name(form_fragment)}_FALSE", 'False'
      end)
    end
  end

  def render_preview
    content_tag(:p, element_value.to_s.upcase)
  end

  def element_properties(element)
    properties = super(element)

    properties[:class] = properties.fetch(:class, {}).split(' ') - ['full-width']

    properties
  end
end
