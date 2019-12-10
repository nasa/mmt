# :nodoc:
class UmmTextField < UmmFormElement
  def render_markup
    byebug
    text_field_tag(keyify_property_name, text_value, element_properties(schema_fragment))
  end
end
