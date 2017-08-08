# :nodoc:
class UmmSelect < UmmFormElement
  # options_for_select
  include ActionView::Helpers::FormOptionsHelper

  def render_markup
    select_tag(keyify_property_name(form_fragment), ui_options, element_properties(schema_fragment))
  end

  def element_properties(element)
    properties = super(element)

    # Prevent children of this class from adding further properties
    return properties unless self.class.to_s == 'UmmSelect'

    properties.merge(prompt: "Select a #{title}")
  end

  def ui_options
    options_for_select(schema_fragment['enum'], element_value)
  end

  def render_preview
    content_tag(:p, element_value)
  end
end
