# :nodoc:
class CustomDateTime < UmmFormElement
  def render_markup
    properties = element_properties(schema_fragment)
    datetime_field_tag(
      keyify_property_name,
      text_value,
      class: properties[:class],
      placeholder: "YYYY-MM-DDTHH:MM:SSZ",
      data: properties[:data]
    ).gsub('datetime-local', 'custom-datetime').html_safe
  end
end
