# :nodoc:
class UmmTextField < UmmFormElement
  def render_markup
    value = if full_key.ends_with?('index_id')
              field_value
            elsif full_key.index('index_id')
              path = json_form.element_path_for_object(full_key.split('index_id/').last)
              path.reduce(field_value) { |a, e| a.fetch(e, {}) }
            else
              element_value
            end

    text_field_tag(keyify_property_name(form_fragment), value, element_properties(schema_fragment))
  end

  def render_preview
    content_tag(:p, element_value)
  end
end
