module JsonSchemaForm
  module UmmFormElements
    # :nodoc:
    class UmmRemoveLink < UmmFormElement
      def render_markup
        content_tag(:a, class: 'remove') do
          concat content_tag(:i, nil, class: 'fa fa-times-circle')
          concat content_tag(:span, "Remove #{options[:name]}", class: 'is-invisible')
        end
      end
    end
  end
end