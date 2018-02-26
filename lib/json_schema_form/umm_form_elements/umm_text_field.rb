# :nodoc:
class UmmTextField < UmmFormElement
  def render_markup
    text_field_tag(keyify_property_name, text_value, element_properties(schema_fragment))
  end

  def render_preview
    content_tag(:p, text_value)
  end
end
