# :nodoc:
class UmmTextField < UmmFormElement
  def render_markup
    value = if full_key.ends_with?('index_id')
              field_value
            elsif full_key.index('index_id')
              field_value[full_key.split('/').last]
            else
              element_value
            end

    text_field_tag(keyify_property_name(form_fragment), value, element_properties(schema_fragment))
  end

  def render_preview
    content_tag(:p, element_value)
  end
end
