# :nodoc:
class CustomDateTime < UmmFormElement
  def render_markup
    props = element_properties(schema_fragment)
    datetime_field_tag(
      keyify_property_name,
      text_value,
      class: props[:class],
      placeholder: "YYYY-MM-DDTHH:MM:SSZ",
      data: props[:data]
    ).gsub('datetime-local','custom-datetime').html_safe
  end
end