# :nodoc:
class UmmMultiItems < UmmFormElement
  def render_markup
    content_tag(:div, class: "multiple #{form_fragment['key'].underscore.dasherize}") do
      values = Array.wrap(get_element_value(form_fragment['key']))
      values = [{}] if values.empty?
      values.each_with_index do |_value, index|
        concat render_accordion(index + 1)
      end

      concat(content_tag(:div, class: 'actions') do
        button = UmmButton.new(form_fragment, json_form, schema, 'button_text' => "Add another #{form_fragment['key'].titleize}", 'classes' => 'eui-btn--blue add-new').render_markup
        concat button
      end)
    end
  end

  def render_accordion(index)
    content_tag(:div, class: "multiple-item multiple-item-#{index} eui-accordion sub-fields space-top") do
      concat render_accordion_header(index)
      concat render_accordion_body(index)
    end
  end

  def render_accordion_header(index)
    content_tag(:div, class: 'eui-accordion__header') do
      concat(content_tag(:div, class: 'eui-accordion__icon', tabindex: '0') do
        concat content_tag(:i, '', class: 'eui-icon eui-fa-chevron-circle-down')
        concat content_tag(:span, "Toggle #{form_fragment['key'].titleize} #{index}", class: 'eui-sr-only')
      end)

      concat content_tag(:span, "#{form_fragment['key'].titleize} #{index}", class: 'header-title')

      concat(content_tag(:div, class: 'actions') do
        UmmRemoveLink.new(parsed_json, json_form, schema, name: form_fragment['key'].titleize).render_markup
      end)
    end
  end

  def render_accordion_body(index)
    content_tag(:div, class: 'eui-accordion__body') do
      form_fragment['items'].each do |property|
        concat UmmForm.new(property, json_form, schema, index: index).render_markup
      end
    end
  end
end
