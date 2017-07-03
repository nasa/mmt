# :nodoc:
class UmmSelect < UmmFormElement
  # options_for_select
  include ActionView::Helpers::FormOptionsHelper

  def render_markup
    select_tag(schema.keyify_property_name(form_fragment), ui_options, element_properties(schema_fragment))
  end

  def ui_options
    options_for_select(schema_fragment['enum'], json_form.get_element_value(form_fragment['key']))
  end
end

# :nodoc:
class UmmMultiSelect < UmmSelect
  def ui_options
    options_for_select(schema_fragment['items']['enum'], json_form.get_element_value(form_fragment['key']))
  end

  def element_properties(element)
    super(element).merge(multiple: true)
  end
end
