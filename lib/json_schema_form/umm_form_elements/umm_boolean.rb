# :nodoc:
class UmmBoolean < UmmFormElement
  def render_markup
    content_tag(:section) do
      concat(content_tag(:span, class: 'radio-group') do
        concat radio_button_tag(keyify_property_name(form_fragment), true, get_element_value(form_fragment['key']) == true, element_properties(schema_fragment))

        concat label_tag "#{keyify_property_name(form_fragment)}_TRUE", 'True'
      end)
      concat(content_tag(:span, class: 'radio-group') do
        concat radio_button_tag(keyify_property_name(form_fragment), false, get_element_value(form_fragment['key']) == false, element_properties(schema_fragment))

        concat label_tag "#{keyify_property_name(form_fragment)}_FALSE", 'False'
      end)
    end
  end

  def element_properties(element)
    properties = super(element)

    properties[:class] = properties.fetch(:class, {}).split(' ') - ['full-width']

    properties
  end
end
