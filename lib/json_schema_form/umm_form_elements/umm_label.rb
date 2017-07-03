# :nodoc:
class UmmLabel < UmmFormElement
  def render_markup
    label_tag(schema.keyify_property_name(form_fragment), form_fragment.fetch('label', form_fragment['key'].split('/').last.titleize), class: ('eui-required-o' if schema.required_field?(form_fragment['key'])))
  end
end
