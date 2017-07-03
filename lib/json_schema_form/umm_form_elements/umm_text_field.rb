# :nodoc:
class UmmTextField < UmmFormElement
  def render_markup
    text_field_tag(schema.keyify_property_name(form_fragment), json_form.get_element_value(form_fragment['key']), element_properties(schema_fragment))
  end
end
