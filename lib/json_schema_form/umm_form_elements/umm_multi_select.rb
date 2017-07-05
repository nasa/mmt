# :nodoc:
class UmmMultiSelect < UmmSelect
  def ui_options
    options_for_select(schema_fragment['items']['enum'], get_element_value(form_fragment['key']))
  end

  def element_properties(element)
    super(element).merge(multiple: true)
  end
end