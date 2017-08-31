# :nodoc:
class UmmMultiItems < UmmFormElement
  def default_value
    []
  end
  
  # Return whether or not this element has a stored value
  def value?
    Array.wrap(element_value).reject(&:empty?).any?
  end

  def render_preview
    capture do
      values = Array.wrap(element_value)
      values = [{}] if values.empty?
      values.each_with_index do |_value, index|
        concat(content_tag(:fieldset) do
          concat content_tag(:h6, "#{parsed_json['key'].titleize.singularize} #{index + 1}")

          form_fragment['items'].each do |property|
            UmmFormSection.new(property, json_form, schema, 'index' => index).children.each do |child|
              concat child.render_preview
            end
          end
        end)
      end
    end
  end

  def render_markup
    content_tag(:div, class: "multiple #{form_fragment['key'].underscore.dasherize}") do
      values = Array.wrap(element_value)
      values = [{}] if values.empty?
      values.each_with_index do |_value, index|
        concat render_accordion(index, (index == values.size - 1))
      end

      concat(content_tag(:div, class: 'actions') do
        button = UmmButton.new(form_fragment, json_form, schema, 'button_text' => "Add another #{form_fragment['key'].titleize.singularize}", 'classes' => 'eui-btn--blue add-new').render_markup
        concat button
      end)
    end
  end

  def render_accordion(index, last = false)
    content_tag(:div, class: "multiple-item multiple-item-#{index} eui-accordion sub-fields space-top #{last ? '' : 'is-closed'}") do
      concat render_accordion_header(index, last)
      concat render_accordion_body(index)
    end
  end

  def render_accordion_header(index, last = false)
    content_tag(:div, class: 'eui-accordion__header') do
      concat(content_tag(:div, class: 'eui-accordion__icon', tabindex: '0') do
        concat content_tag(:i, '', class: 'eui-icon eui-fa-chevron-circle-down')
        concat content_tag(:span, "Toggle #{form_fragment['key'].titleize.singularize} #{index + 1}", class: 'eui-sr-only')
      end)

      concat content_tag(:span, "#{form_fragment['key'].titleize.singularize} #{index + 1}", class: 'header-title')

      concat(content_tag(:div, class: 'actions') do
        UmmRemoveLink.new(parsed_json, json_form, schema, 'name' => title).render_markup
      end)
    end
  end

  def render_accordion_body(index)
    content_tag(:div, class: 'eui-accordion__body') do
      form_fragment['items'].each do |property|
        concat UmmForm.new(property, json_form, schema, 'index' => index).render_markup
      end
    end
  end
end
