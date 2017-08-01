# :nodoc:
class UmmTextarea < UmmFormElement
  def render_markup
    text_area_tag(keyify_property_name(form_fragment), element_value, element_properties(schema_fragment))
  end

  def render_preview
    content_tag(:p, element_value)
  end
end
