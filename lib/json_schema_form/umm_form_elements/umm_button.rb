# :nodoc:
class UmmButton < UmmFormElement
  def render_markup
    button_tag(type: 'button', class: options[:classes], disabled: options['disabled']) do
      concat content_tag(:i, nil, class: 'fa fa-plus-circle')
      concat " #{options[:button_text]}"
    end
  end
end
